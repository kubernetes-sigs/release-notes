import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Note } from '@app/shared/model/notes.model';
import { LoggerService } from '@shared/services/logger.service';
import { assets } from '@env/assets';

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
    this.logger.debug(`Gathering notes from ${assets.length} assets`);

    const observables = [];
    for (const asset of assets) {
      observables.push(
        this.http.get(asset, { observe: 'response' }).pipe(
          map(response => {
            return [response.body, this.releaseVersionFromPath(asset)];
          }),
        ),
      );
    }

    return forkJoin(observables).pipe(map(this.toNoteList));
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
    return path.replace(/^.*release-notes-/, '').replace(/.json$/, '');
  }
}
