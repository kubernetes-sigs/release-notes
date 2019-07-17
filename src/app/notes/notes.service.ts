import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Note } from './notes.model';
import { LoggerService } from '@shared/services/logger.service';
import { environment } from '@environment';

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
    this.logger.debug(`Gathering notes from ${environment.notesAssets}`);

    const observables = [];
    for (const jsonFile of environment.notesAssets) {
      observables.push(this.http.get(jsonFile));
    }

    return forkJoin(observables).pipe(map(this.toNoteList));
  }

  /**
   * Convert an array of any objects to a list of notes
   *
   * @returns The Note list
   */
  toNoteList(jsonArray: any[]): Note[] {
    const list = [];

    for (let i = 0, len = jsonArray.length; i < len; i++) {
      for (const value of Object.values(jsonArray[i])) {
        list.push(value);
      }
    }

    return list;
  }
}
