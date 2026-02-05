import { State, reducers } from './app.reducer';
import { filterReducer, initialState as filterInitialState } from './filter/filter.reducer';
import { notesReducer, initialState as notesInitialState } from './notes/notes.reducer';
import { settingsReducer, initialState as settingsInitialState } from './settings/settings.reducer';

describe('App Reducer', () => {
  it('should create the root state structure', () => {
    const state: State = {
      filter: filterInitialState,
      notes: notesInitialState,
      settings: settingsInitialState,
    };

    expect(state.filter).toBeDefined();
    expect(state.notes).toBeDefined();
    expect(state.settings).toBeDefined();
  });

  it('should have correct reducer mapping', () => {
    expect(reducers.filter).toBe(filterReducer);
    expect(reducers.notes).toBe(notesReducer);
    expect(reducers.settings).toBe(settingsReducer);
  });

  it('should have filter reducer in reducers map', () => {
    expect(typeof reducers.filter).toBe('function');
  });

  it('should have notes reducer in reducers map', () => {
    expect(typeof reducers.notes).toBe('function');
  });

  it('should have settings reducer in reducers map', () => {
    expect(typeof reducers.settings).toBe('function');
  });
});
