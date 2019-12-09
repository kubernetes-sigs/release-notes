import { createSelector } from '@ngrx/store';
import { ActionTypes, NotesAction } from './notes.actions';
import { Note } from '@app/shared/model/notes.model';
import { State as RootState } from '@app/app.reducer';

export interface State {
  error: string | null;
  filteredNotes: Note[];
  notes: Note[];
}

export const initialState: State = {
  error: null,
  filteredNotes: [],
  notes: [],
};

export function notesReducer(state = initialState, action: NotesAction): State {
  switch (action.type) {
    case ActionTypes.GetNotesSuccess: {
      return {
        ...state,
        notes: action.payload,
      };
    }

    case ActionTypes.DoFilterSuccess: {
      return {
        ...state,
        filteredNotes: action.notes,
      };
    }

    case ActionTypes.Failed: {
      return {
        ...state,
        error: action.error,
      };
    }

    default:
      return state;
  }
}

export const selectNotes = (state: RootState) => state.notes;
export const getAllNotesSelector = createSelector(selectNotes, (state: State) => state.notes);
export const getFilteredNotesSelector = createSelector(
  selectNotes,
  (state: State) => state.filteredNotes,
);
export const getErrorSelector = createSelector(selectNotes, (state: State) => state.error);
