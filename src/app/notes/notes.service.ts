import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Note, NoteList } from './notes.model';
import { LoggerService } from '@shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  noteUrl = './assets/data/release-notes.json';

  constructor(private http: HttpClient, private logger: LoggerService) {}

  /**
   * Retrieve the notes
   *
   * @returns The NoteList as observable
   */
  getNotes(): Observable<NoteList> {
    this.logger.debug('Gathering notes');
    return this.http.get<NoteList>(this.noteUrl).pipe();
  }
}
