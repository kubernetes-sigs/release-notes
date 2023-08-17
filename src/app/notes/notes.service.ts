import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { Note } from '@app/shared/model/notes.model';
import { LoggerService } from '@shared/services/logger.service';
import { assets as localAssets } from '@env/assets';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpClient, private logger: LoggerService) {}

  /**
   * Retrieve the notes
   *
   * @returns The NoteList as observable
   */
  getNotes(): Observable<Note[]> {
    this.logger.debug('Gathering assets list');

    // Remote release notes index
    const indexObservable = this.http
      .get('https://cdn.dl.k8s.io/release/release-notes-index.json')
      .pipe(
        switchMap(response => {
          const observables = [];

          // Remote Assets
          this.logger.debug(`Gathering remote notes from ${Object.keys(response).length} assets`);
          for (const releaseVersion of Object.keys(response)) {
            const assetLink = this.cdnLinkFromGsPath(response[releaseVersion]);
            observables.unshift(
              this.http.get(assetLink, { observe: 'response' }).pipe(
                map(response1 => {
                  return [response1.body, releaseVersion];
                }),
              ),
            );
          }

          // Local Assets
          this.logger.debug(`Gathering local notes from ${localAssets.length} assets`);
          for (const asset of localAssets) {
            observables.push(
              this.http.get(asset, { observe: 'response' }).pipe(
                map(response2 => {
                  return [response2.body, this.releaseVersionFromPath(asset)];
                }),
              ),
            );
          }

          return forkJoin(observables);
        }),
      );

    return indexObservable.pipe(map(this.toNoteList));
  }

  /**
   * Convert an array of any objects to a list of notes
   *
   * @returns The Note list
   */
  toNoteList(res: any[]): Note[] {
    const list = [];

    for (let i = 0, len = res.length; i < len; i++) {
      for (const x of Object.values(res[i][0])) {
        const value: any = x;

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
    const regex = /^gs:\/\/[\w-/.]*\.json$/;
    if (!path.match(regex)) {
      throw new Error(`Asset path from remote index "${path}" does not match regex ${regex}`);
    }
    return path.replace(/^gs:\/\/[\w-]*\//, 'https://cdn.dl.k8s.io/');
  }
}
