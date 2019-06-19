import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Note, NoteList } from './notes.model';
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
  getNotes(): Observable<NoteList> {
    this.logger.debug(`Gathering notes from ${environment.notesAsset}`);
    return this.http.get<NoteList>(environment.notesAsset).pipe();
  }
}
