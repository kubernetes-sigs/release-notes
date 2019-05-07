import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Note } from './notes.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  noteUrl = './assets/data/release-notes.json';

  constructor(private http: HttpClient) {}

  getNotes(filter): Observable<Note[]> {
    console.log('Gathering notes');

    return this.http.get<Note[]>(this.noteUrl).pipe();
  }
}
