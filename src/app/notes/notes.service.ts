import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Note } from './note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  noteUrl = './assets/data/release-notes.json';

  constructor(private http: HttpClient) { }

  getNotes(filter): Observable<Note[]> {
    console.log('Gathering notes');
    console.log(filter);

    let params = new HttpParams();

    for (const key of Object.keys(filter)) {
      if (typeof filter[key] === 'object') {
        for (const value of Object.keys(filter[key])) {
          if (String(filter[key][value]) === 'true') {
            const newVal = (params.get(key) === null ? '' : params.get(key)) + ',' + value;
            console.log('Setting ' + key + ' to ' + newVal);
            params = params.set(key, newVal);
          }
        }
      } else {
        params = params.set(key, filter[key]);
      }
    }

    console.log(params);

    const options = { params };

    return this.http.get<Note[]>(this.noteUrl, options).pipe();
    
  }
}
