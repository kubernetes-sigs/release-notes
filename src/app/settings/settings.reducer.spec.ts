import { Failed, UpdateSettingsSuccess } from './settings.actions';
import { initialState, settingsReducer } from './settings.reducer';
import { Settings } from '@app/shared/model/settings.model';

describe('SettingsReducer', () => {
  describe('reducing an undefined action', () => {
    it('should return the default state', () => {
      expect(settingsReducer(undefined, {} as any)).toEqual(initialState);
    });
  });

  describe('reducing UpdateSettingsSuccess', () => {
    it('should modify the settings state', () => {
      const f = new Settings();
      const testAction = new UpdateSettingsSuccess(f);
      expect(settingsReducer(initialState, testAction)).toEqual({
        ...initialState,
        settings: f,
      });
    });
  });

  describe('reducing Failed', () => {
    it('should modify the settings state', () => {
      const testAction = new Failed('error');
      expect(settingsReducer(initialState, testAction)).toEqual({
        ...initialState,
        error: 'error',
      });
    });
  });
});
