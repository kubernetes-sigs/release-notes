import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { ActionTypes, DoFilterSuccess, DoFilter, Failed, GetNotesSuccess } from './notes.actions';
import { NotesService } from './notes.service';
import { Kep } from '@app/shared/model/notes.model';
import { OptionType } from '@app/shared/model/options.model';
import { LoggerService } from '@shared/services/logger.service';

@Injectable()
export class NotesEffects {
  @Effect()
  getNotes$ = this.actions$.pipe(
    ofType(ActionTypes.GetNotes),
    exhaustMap(() =>
      this.notesService.getNotes().pipe(
        map((notes: Kep[]) => {
          this.logger.debug('[Notes Effects:GetNotes] SUCCESS');
          return new GetNotesSuccess(notes);
        }),
        catchError(error => {
          this.logger.debug(`[Notes Effects:GetNotes] FAILED: ${error.message}`);
          if (error && error.message) {
            return of(new Failed(error.message));
          }
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
      const filteredKeps: Set<Kep> = new Set();
      const filter = data.filter;

      for (const kep of data.notes) {
        // If the filter is empty (this ignores the releaseVersions field),
        // show the note
        if (filter.isEmpty()) {
          filteredKeps.add(kep);
          continue;
        }

        // Filter all regular option types
        if (filter.has(OptionType.owningSigs, kep.owningSig)) {
          filteredKeps.add(kep);
          continue;
        }
        if (filter.hasAny(OptionType.participatingSigs, kep.participatingSigs)) {
          filteredKeps.add(kep);
          continue;
        }

        // Now lazily filter every string based field via the text based filter
        if (filter.text.length > 0) {
          for (const key of Object.keys(kep)) {
            if (
              typeof kep[key] === 'string' &&
              kep[key]
                .toUpperCase()
                .trim()
                .includes(filter.text.toUpperCase().trim())
            ) {
              filteredKeps.add(kep);
              break;
            }
          }
        }
      }

      this.logger.debug('[Notes Effects:DoFilter] SUCCESS (filtered)');
      return of(new DoFilterSuccess([...filteredKeps]));
    }),
  );

  constructor(
    private actions$: Actions,
    private notesService: NotesService,
    private logger: LoggerService,
  ) {}
}
