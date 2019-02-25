import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Options } from './options';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  optionsUrl = 'http://localhost:8080/options';

  constructor(private http: HttpClient) { }

  getOptions(): Observable<Options> {
    return this.http.get<Options>(this.optionsUrl).pipe();
  }
}
