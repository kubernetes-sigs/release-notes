import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin, switchMap, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Note } from '@app/shared/model/notes.model';
import { LoggerService } from '@shared/services/logger.service';
import { assets as localAssets } from '@env/assets';
import { indexUrl } from '@env/index-url';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(
    private http: HttpClient,
    private logger: LoggerService,
  ) {}

  /**
   * Retrieve the notes
   *
   * @returns The NoteList as observable
   */
  getNotes(): Observable<Note[]> {
    this.logger.debug('Gathering assets list');

    // Remote release notes index
    const indexObservable = this.http.get<Record<string, string>>(indexUrl).pipe(
      switchMap(response => {
        const observables: Observable<[Record<string, unknown>, string]>[] = [];

        // Remote Assets
        this.logger.debug(`Gathering remote notes from ${Object.keys(response).length} assets`);
        for (const releaseVersion of Object.keys(response)) {
          const assetLink = this.cdnLinkFromGsPath(response[releaseVersion]);
          observables.unshift(
            this.http.get<Record<string, unknown>>(assetLink, { observe: 'response' }).pipe(
              map(response1 => {
                return [response1.body || {}, releaseVersion.substring(1)] as [
                  Record<string, unknown>,
                  string,
                ];
              }),
              catchError(err => {
                this.logger.error(`Failed to fetch remote asset ${assetLink}: ${err.message}`);
                return of([{}, releaseVersion.substring(1)] as [Record<string, unknown>, string]);
              }),
            ),
          );
        }

        // Local Assets
        this.logger.debug(`Gathering local notes from ${localAssets.length} assets`);
        for (const asset of localAssets) {
          observables.push(
            this.http.get<Record<string, unknown>>(asset, { observe: 'response' }).pipe(
              map(response2 => {
                return [response2.body || {}, this.releaseVersionFromPath(asset)] as [
                  Record<string, unknown>,
                  string,
                ];
              }),
              catchError(err => {
                this.logger.error(`Failed to fetch local asset ${asset}: ${err.message}`);
                return of([{}, this.releaseVersionFromPath(asset)] as [
                  Record<string, unknown>,
                  string,
                ]);
              }),
            ),
          );
        }

        return forkJoin(observables).pipe(
          catchError(err => {
            this.logger.error(`Failed to gather release notes: ${err.message}`);
            return of([] as [Record<string, unknown>, string][]);
          }),
        );
      }),
    );

    return indexObservable.pipe(map(data => this.toNoteList(data)));
  }

  /**
   * Convert an array of any objects to a list of notes
   *
   * @returns The Note list
   */
  toNoteList(res: [Record<string, unknown>, string][]): Note[] {
    const list: Note[] = [];

    for (let i = 0, len = res.length; i < len; i++) {
      for (const x of Object.values(res[i][0])) {
        const value = x as Note;

        // Set the release version from the asset path
        value.release_version = res[i][1];

        // Add the converted value to the results
        list.push(value);
      }
    }

    return list;
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
