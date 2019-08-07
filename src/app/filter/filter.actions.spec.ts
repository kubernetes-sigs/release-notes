import { ActionTypes, UpdateFilter, UpdateFilterSuccess, Failed } from './filter.actions';
import { Filter } from '@app/shared/model/options.model';

describe('FilterActions', () => {
  // Given
  const testFilter = new Filter();

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

  it('should be able to create a UpdateFilter action', () => {
    // When
    const action = new UpdateFilter(testFilter);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.UpdateFilter,
      filter: testFilter,
    });
  });

  it('should be able to create a UpdateFilterSuccess action', () => {
    // When
    const action = new UpdateFilterSuccess(testFilter);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.UpdateFilterSuccess,
      filter: testFilter,
    });
  });
});
