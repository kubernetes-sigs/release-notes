import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, concat, forkJoin, merge, of } from 'rxjs';
import { catchError, map, scan, switchMap } from 'rxjs/operators';
import { Marked } from 'marked';

import { Note } from '@app/shared/model/notes.model';
import { LoggerService } from '@shared/services/logger.service';
import { assets as localAssets } from '@env/assets';
import { indexUrl } from '@env/index-url';
import { environment } from '@env/environment';

type AssetTuple = [Record<string, unknown>, string];

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private marked = new Marked({ gfm: true, breaks: false });

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
  ) {}

  /**
   * Retrieve the notes via progressive loading.
   * Local assets and remote assets load in parallel, emitting results
   * as each source completes for faster initial rendering.
   *
   * @returns The NoteList as observable (emits progressively)
   */
  getNotes(): Observable<Note[]> {
    this.logger.debug('Gathering assets list');

    // Local assets load in chunks for smoother progressive rendering
    this.logger.debug(`Gathering local notes from ${localAssets.length} assets`);
    const local$ = this.loadAssetsInChunks(
      localAssets.map(asset => ({ url: asset, version: this.releaseVersionFromPath(asset) })),
    );

    // Remote assets depend on the index fetch, sorted newest-first
    // and loaded in chunks so the newest releases render quickly
    const remote$ = this.http.get<Record<string, string>>(indexUrl).pipe(
      switchMap(response => {
        const versions = Object.keys(response).sort((a, b) =>
          this.compareVersions(b.substring(1), a.substring(1)),
        );
        this.logger.debug(`Gathering remote notes from ${versions.length} assets`);
        if (versions.length === 0) return of([] as AssetTuple[]);
        return this.loadAssetsInChunks(
          versions.map(v => ({
            url: this.cdnLinkFromGsPath(response[v]),
            version: v.substring(1),
          })),
        );
      }),
      catchError(err => {
        this.logger.error(`Failed to fetch remote index: ${err.message}`);
        return of([] as AssetTuple[]);
      }),
    );

    // Emit results progressively as each source completes.
    // Notes are sorted by release version (newest first) after each emission.
    return merge(local$, remote$).pipe(
      scan((acc, batch) => [...acc, ...batch], [] as AssetTuple[]),
      map(data => this.toNoteList(data)),
    );
  }

  /**
   * Load assets in sequential chunks, emitting each chunk as it completes.
   * This avoids firing all requests at once while still allowing progressive rendering.
   */
  private loadAssetsInChunks(
    assets: { url: string; version: string }[],
    chunkSize = 10,
  ): Observable<AssetTuple[]> {
    if (assets.length === 0) return of([] as AssetTuple[]);

    const chunks: Observable<AssetTuple[]>[] = [];
    for (let i = 0; i < assets.length; i += chunkSize) {
      const chunk = assets.slice(i, i + chunkSize);
      chunks.push(forkJoin(chunk.map(a => this.loadAsset(a.url, a.version))));
    }

    // Emit each chunk sequentially
    return concat(...chunks);
  }

  /**
   * Load a single asset file and return it with its version
   */
  private loadAsset(url: string, version: string): Observable<AssetTuple> {
    return this.http.get<Record<string, unknown>>(url, { observe: 'response' }).pipe(
      map(response => [response.body || {}, version] as AssetTuple),
      catchError(err => {
        this.logger.error(`Failed to fetch asset ${url}: ${err.message}`);
        return of([{}, version] as AssetTuple);
      }),
    );
  }

  /**
   * Sanitize the markdown by removing trailing PR/SIG references
   */
  saneMarkdown(markdown: string): string {
    return markdown.replace(/  \(\[\#\d+\]\(.*\)\) \[SIG .*\]$/, '');
  }

  /**
   * Convert an array of any objects to a list of notes
   *
   * @returns The Note list
   */
  toNoteList(res: AssetTuple[]): Note[] {
    const list: Note[] = [];

    for (let i = 0, len = res.length; i < len; i++) {
      for (const x of Object.values(res[i][0])) {
        const value = x as Note;

        // Set the release version from the asset path
        value.release_version = res[i][1];

        // Pre-render markdown to HTML
        if (value.markdown) {
          value.renderedHtml = this.marked.parse(this.saneMarkdown(value.markdown)) as string;
        }

        // Add the converted value to the results
        list.push(value);
      }
    }

    // Sort by release version descending (newest first)
    list.sort((a, b) => this.compareVersions(b.release_version, a.release_version));

    return list;
  }

  /**
   * Compare two semver-like version strings.
   * Returns negative if a < b, positive if a > b, 0 if equal.
   */
  private compareVersions(a: string, b: string): number {
    const pa = a.split(/[.-]/).map(s => (/^\d+$/.test(s) ? parseInt(s, 10) : s));
    const pb = b.split(/[.-]/).map(s => (/^\d+$/.test(s) ? parseInt(s, 10) : s));
    const len = Math.max(pa.length, pb.length);

    for (let i = 0; i < len; i++) {
      const va = pa[i];
      const vb = pb[i];

      // Missing segment: release (no suffix) > pre-release (alpha/beta/rc)
      if (va === undefined && vb === undefined) return 0;
      if (va === undefined) return typeof vb === 'string' ? 1 : -1;
      if (vb === undefined) return typeof va === 'string' ? -1 : 1;

      // Both numbers: numeric comparison
      if (typeof va === 'number' && typeof vb === 'number') {
        if (va !== vb) return va - vb;
        continue;
      }

      // String vs number: number wins (release > pre-release label)
      if (typeof va === 'number') return 1;
      if (typeof vb === 'number') return -1;

      // Both strings: lexicographic
      if (va < vb) return -1;
      if (va > vb) return 1;
    }

    return 0;
  }

  /**
   * Retrieve the release version from a asset path
   *
   * @returns The release version
   */
  private releaseVersionFromPath(path: string): string {
    // Enforce asset path syntax
    const regex = /^.*release-notes-[0-9]\.[0-9]+\.[0-9]+.*\.json$/;
    if (!path.match(regex)) {
      throw new Error(`Asset path "${path}" does not match regex ${regex}`);
    }
    return path.replace(/^.*release-notes-/, '').replace(/\.json$/, '');
  }

  /**
   * Get cdn.dl.k8s.io path from gs:// url in release index.
   *
   * @returns Transformed URL
   */
  private cdnLinkFromGsPath(path: string): string {
    // Normalize the link if required
    if (path.match(/^gs:\/\/[\w-/.]*\.json$/)) {
      return path.replace(/^gs:\/\/[\w-]*\//, `https://${environment.cdnDomain}/`);
    }

    return path.replace(/dl\.k8s\.io/, environment.cdnDomain);
  }
}
