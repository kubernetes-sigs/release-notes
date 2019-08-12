import { ActionTypes, UpdateSettings, UpdateSettingsSuccess, Failed } from './settings.actions';
import { Settings } from '@app/shared/model/settings.model';

describe('SettingsActions', () => {
  // Given
  const testSettings = new Settings();

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

  it('should be able to create a UpdateSettings action', () => {
    // When
    const action = new UpdateSettings(testSettings);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.UpdateSettings,
      settings: testSettings,
    });
  });

  it('should be able to create a UpdateSettingsSuccess action', () => {
    // When
    const action = new UpdateSettingsSuccess(testSettings);

    // Then
    expect({ ...action }).toEqual({
      type: ActionTypes.UpdateSettingsSuccess,
      settings: testSettings,
    });
  });
});
