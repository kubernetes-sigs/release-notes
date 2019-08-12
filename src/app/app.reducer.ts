import { ActionReducerMap } from '@ngrx/store';
import { State as NotesState, notesReducer } from './notes/notes.reducer';
import { State as FilterState, filterReducer } from './filter/filter.reducer';

export interface State {
  filter: FilterState;
  notes: NotesState;
}

export const reducers: ActionReducerMap<State> = {
  filter: filterReducer,
  notes: notesReducer,
};
