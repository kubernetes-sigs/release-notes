import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  ActionTypes,
  DoFilterSuccess,
  DoFilter,
  Failed,
  GetNotes,
  GetNotesSuccess,
} from './notes.actions';
import { NotesService } from './notes.service';
import { Note } from './notes.model';
import { Filter } from '@app/shared/model/options.model';

@Injectable()
export class NotesEffects {
  @Effect()
  getNotes$ = this.actions$.pipe(
    ofType(ActionTypes.GetNotes),
    map((action: GetNotes) => action.filter),
    exhaustMap(filter =>
      this.notesService.getNotes(filter).pipe(
        map((notes: Note[]) => {
          console.log('[Notes Effects:GetNotes] SUCCESS');
          return new GetNotesSuccess(notes);
        }),
        catchError(error => {
          console.log(`[Notes Effects:GetNotes] FAILED: ${error}`);
          return of(new Failed(error));
        }),
      ),
    ),
  );

  @Effect()
  doFilter$ = this.actions$.pipe(
    ofType(ActionTypes.DoFilter),
    map((action: DoFilter) => {
      return {
        filter: action.filter,
        notes: action.notes,
      };
    }),
    exhaustMap(data => {
      console.log('[Notes Effects:DoFilter] SUCCESS');
      if (data.filter.isEmpty()) {
        return of(new DoFilterSuccess(data.notes));
      } else {
        const filteredNotes: Note[] = [];
        for (const note of data.notes) {
          for (const key in data.filter) {
            if (
              key === 'releaseVersions' &&
              Object.keys(data.filter[key]).indexOf(note.release_version) >= 0
            ) {
              filteredNotes.push(note);
            } else {
              if (key in note && typeof note[key] !== 'string') {
                if (
                  [...new Set(note[key])].filter(x => {
                    return data.filter[key].indexOf(x) && data.filter[key][x];
                  }).length > 0
                ) {
                  filteredNotes.push(note);
                }
              } else {
                if (
                  key in note &&
                  typeof note[key] === 'string' &&
                  data.filter[key].trim().length > 0
                ) {
                  if (
                    note[key]
                      .toUpperCase()
                      .trim()
                      .includes(data.filter[key].toUpperCase().trim())
                  ) {
                    filteredNotes.push(note);
                  }
                }
              }
            }
          }
        }
        return of(new DoFilterSuccess(filteredNotes));
      }
    }),
  );

  constructor(private actions$: Actions, private notesService: NotesService) {}
}
