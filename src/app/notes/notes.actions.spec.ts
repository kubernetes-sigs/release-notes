import {
  ActionTypes,
  DoFilter,
  DoFilterSuccess,
  Failed,
  GetNotes,
  GetNotesSuccess,
} from './notes.actions';
import { notesMock } from './notes.model.mock';

describe('NotesActions', () => {
  // Given
  const filter = { key: 'value' };

  it('should be able to create a Failed action', () => {
    // Given
    const error = 'error';

    // When
    const action = new Failed(error);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.Failed,
      error,
    });
  });

  it('should be able to create a DoFilter action', () => {
    // When
    const action = new DoFilter(notesMock, filter);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.DoFilter,
      notes: notesMock,
      filter,
    });
  });

  it('should be able to create a DoFilterSuccess action', () => {
    // When
    const action = new DoFilterSuccess(notesMock);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.DoFilterSuccess,
      notes: notesMock,
    });
  });

  it('should be able to create a GetNotes action', () => {
    // When
    const action = new GetNotes(filter);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.GetNotes,
      filter,
    });
  });

  it('should be able to create a GetNotesSuccess action', () => {
    // When
    const action = new GetNotesSuccess(notesMock);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.GetNotesSuccess,
      payload: notesMock,
    });
  });
});
