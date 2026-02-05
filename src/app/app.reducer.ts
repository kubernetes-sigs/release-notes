import { ActionReducerMap } from '@ngrx/store';
import { State as NotesState, notesReducer } from './notes/notes.reducer';
import { State as FilterState, filterReducer } from './filter/filter.reducer';
import { State as SettingsState, settingsReducer } from './settings/settings.reducer';

export interface State {
  filter: FilterState;
  notes: NotesState;
  settings: SettingsState;
}

export const reducers: ActionReducerMap<State> = {
  filter: filterReducer as any,
  notes: notesReducer as any,
  settings: settingsReducer as any,
};
