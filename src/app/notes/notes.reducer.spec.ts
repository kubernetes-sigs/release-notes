import { DoFilterSuccess, Failed, GetNotesSuccess } from './notes.actions';
import { initialState, notesReducer } from './notes.reducer';
import { notesMock } from './notes.model.mock';

describe('NotesReducer', () => {
  describe('reducing an undefined action', () => {
    it('should return the default state', () => {
      expect(notesReducer(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('reducing GetNotesSuccess', () => {
    it('should modify the notes state', () => {
      const testAction = new GetNotesSuccess(notesMock);
      expect(notesReducer(initialState, testAction)).toEqual({
        ...initialState,
        notes: notesMock,
      });
    });
  });

  describe('reducing DoFilterSuccess', () => {
    it('should modify the notes state', () => {
      const testAction = new DoFilterSuccess(notesMock);
      expect(notesReducer(initialState, testAction)).toEqual({
        ...initialState,
        filteredNotes: notesMock,
      });
    });
  });

  describe('reducing Failed', () => {
    it('should modify the notes state', () => {
      const testAction = new Failed('error');
      expect(notesReducer(initialState, testAction)).toEqual({
        ...initialState,
        error: 'error',
      });
    });
  });
});
