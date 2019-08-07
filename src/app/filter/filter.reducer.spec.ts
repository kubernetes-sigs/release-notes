import { Failed, UpdateFilterSuccess } from './filter.actions';
import { initialState, filterReducer } from './filter.reducer';
import { Filter } from '@app/shared/model/options.model';

describe('FilterReducer', () => {
  describe('reducing an undefined action', () => {
    it('should return the default state', () => {
      expect(filterReducer(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('reducing UpdateFilterSuccess', () => {
    it('should modify the filter state', () => {
      const f = new Filter();
      const testAction = new UpdateFilterSuccess(f);
      expect(filterReducer(initialState, testAction)).toEqual({
        ...initialState,
        filter: f,
      });
    });
  });

  describe('reducing Failed', () => {
    it('should modify the filter state', () => {
      const testAction = new Failed('error');
      expect(filterReducer(initialState, testAction)).toEqual({
        ...initialState,
        error: 'error',
      });
    });
  });
});
