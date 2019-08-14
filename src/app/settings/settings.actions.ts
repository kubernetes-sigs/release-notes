import { Action } from '@ngrx/store';
import { Settings } from '@app/shared/model/settings.model';

export enum ActionTypes {
  Failed = '[Settings Component] Failed',

  UpdateSettings = '[Settings Component] Update Settings',
  UpdateSettingsSuccess = '[Settings Component] Update Settings Success',
}

export class Failed implements Action {
  readonly type = ActionTypes.Failed;
  constructor(public error: string) {}
}

export class UpdateSettings implements Action {
  readonly type = ActionTypes.UpdateSettings;
  constructor(public settings: Settings) {}
}

export class UpdateSettingsSuccess implements Action {
  readonly type = ActionTypes.UpdateSettingsSuccess;
  constructor(public settings: Settings) {}
}

export type SettingsAction = Failed | UpdateSettings | UpdateSettingsSuccess;
