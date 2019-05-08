import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '@environment';
import { State as NotesState, notesReducer } from './notes/notes.reducer';

export interface State {
  notes: NotesState;
}

export const reducers: ActionReducerMap<State> = {
  notes: notesReducer,
};
