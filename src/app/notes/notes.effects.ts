import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  ActionTypes,
  DoFilterSuccess,
  DoFilter,
  Failed,
  GetNotesComplete,
  GetNotesSuccess,
} from './notes.actions';
import { NotesService } from './notes.service';
import { Note } from '@app/shared/model/notes.model';
import { OptionType } from '@app/shared/model/options.model';
import { LoggerService } from '@shared/services/logger.service';

@Injectable()
export class NotesEffects {
  getNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.GetNotes),
      exhaustMap(() =>
        concat(
          this.notesService.getNotes().pipe(
            map((notes: Note[]) => {
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
          of(new GetNotesComplete()),
        ),
      ),
    ),
  );

  doFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.DoFilter),
      map((action: DoFilter) => {
        return {
          filter: action.filter,
          notes: action.notes,
        };
      }),
      exhaustMap(data => {
        const filteredNotes: Set<Note> = new Set();
        const filter = data.filter;

        for (const note of data.notes) {
          // Filter the release versions
          if (
            !filter.has(OptionType.releaseVersions, note.release_version) &&
            (!filter.optionIsEmpty(OptionType.releaseVersions) ||
              filter.isPreRelease(note.release_version))
          ) {
            // Wrong release version set, it will not be added
            continue;
          }

          // If the filter is empty (this ignores the releaseVersions field),
          // show the note
          if (filter.isEmpty()) {
            filteredNotes.add(note);
            continue;
          }

          // Filter all regular option types
          if (filter.hasAny(OptionType.areas, note.areas)) {
            filteredNotes.add(note);
            continue;
          }
          if (filter.hasAny(OptionType.kinds, note.kinds)) {
            filteredNotes.add(note);
            continue;
          }
          if (filter.hasAny(OptionType.sigs, note.sigs)) {
            filteredNotes.add(note);
            continue;
          }
          if (
            note.documentation &&
            filter.hasAny(
              OptionType.documentation,
              note.documentation.map(x => x.type.toString()),
            )
          ) {
            filteredNotes.add(note);
            continue;
          }

          // Now lazily filter every string based field via the text based filter
          if (filter.text.length > 0) {
            for (const key of Object.keys(note)) {
              const value = note[key as keyof Note];
              if (
                typeof value === 'string' &&
                value.toUpperCase().trim().includes(filter.text.toUpperCase().trim())
              ) {
                filteredNotes.add(note);
                break;
              }
            }
          }
        }

        this.logger.debug('[Notes Effects:DoFilter] SUCCESS (filtered)');
        return of(new DoFilterSuccess([...filteredNotes]));
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private notesService: NotesService,
    private logger: LoggerService,
  ) {}
}
