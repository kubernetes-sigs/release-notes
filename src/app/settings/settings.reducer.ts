import { Action, createSelector } from '@ngrx/store';
import { ActionTypes, Failed, UpdateSettingsSuccess } from './settings.actions';
import { Settings } from '@app/shared/model/settings.model';
import { State as RootState } from '@app/app.reducer';

export interface State {
  error: string | null;
  settings: Settings;
}

export const initialState: State = {
  error: null,
  settings: new Settings(),
};

export function settingsReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case ActionTypes.UpdateSettingsSuccess: {
      return {
        ...state,
        settings: (action as UpdateSettingsSuccess).settings,
      };
    }

    case ActionTypes.Failed: {
      return {
        ...state,
        error: (action as Failed).error,
      };
    }

    default:
      return state;
  }
}

export const selectSettings = (state: RootState) => state.settings;
export const getSettingsSelector = createSelector(selectSettings, (state: State) => state.settings);
