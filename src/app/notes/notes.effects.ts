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
import { LoggerService } from '@shared/services/logger.service';

@Injectable()
export class NotesEffects {
  @Effect()
  getNotes$ = this.actions$.pipe(
    ofType(ActionTypes.GetNotes),
    exhaustMap(() =>
      this.notesService.getNotes().pipe(
        map((notes: Note[]) => {
          this.logger.debug('[Notes Effects:GetNotes] SUCCESS');
          return new GetNotesSuccess(notes);
        }),
        catchError(error => {
          this.logger.debug(`[Notes Effects:GetNotes] FAILED: ${error}`);
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
      this.logger.debug('[Notes Effects:DoFilter] SUCCESS');
      const filteredNotes: Note[] = [];
      if (data.filter && data.filter.isEmpty()) {
        return of(new DoFilterSuccess(data.notes));
      } else {
        if (data.filter) {
          const copyFilter = Object.create(data.filter);

          copyFilter.releaseVersions = [];

          for (const note of data.notes) {
            // Release Version is a special filter.
            if (
              (data.filter.isset('releaseVersions') &&
                Object.keys(data.filter.get('releaseVersions')).indexOf(note.release_version) >=
                  0) ||
              (!('releaseVersions' in data.filter) ||
                !(Object.keys(data.filter.get('releaseVersions')).length > 0))
            ) {
              if (copyFilter.isEmpty()) {
                filteredNotes.push(note);
              } else {
                for (const key in data.filter) {
                  if (key in note && typeof note[key] !== 'string') {
                    // Filter the documentation by its doctype
                    if (key === 'documentation' && note[key]) {
                      for (let i = 0, len = note[key].length; i < len; i++) {
                        const docType = note[key][i].type.toString();
                        if (data.filter[key][docType] === true && filteredNotes.indexOf(note) < 0) {
                          filteredNotes.push(note);
                        }
                      }
                    } else if (
                      // Filter everything else based on a simple set manipulation
                      [...new Set(note[key])].filter(x => {
                        return data.filter[key].indexOf(x) && data.filter[key][x];
                      }).length > 0 &&
                      filteredNotes.indexOf(note) < 0
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
                          .includes(data.filter[key].toUpperCase().trim()) &&
                        filteredNotes.indexOf(note) < 0
                      ) {
                        filteredNotes.push(note);
                      }
                    }
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

  constructor(
    private actions$: Actions,
    private notesService: NotesService,
    private logger: LoggerService,
  ) {}
}
