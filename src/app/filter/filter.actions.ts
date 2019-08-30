import { Action } from '@ngrx/store';
import { Filter } from '@app/shared/model/filter.model';

export enum ActionTypes {
  Failed = '[Filter Component] Failed',

  UpdateFilter = '[Filter Component] Update Filter',
  UpdateFilterSuccess = '[Filter Component] Update Filter Success',
}

export class Failed implements Action {
  readonly type = ActionTypes.Failed;
  constructor(public error: string) {}
}

export class UpdateFilter implements Action {
  readonly type = ActionTypes.UpdateFilter;
  constructor(public filter: Filter) {}
}

export class UpdateFilterSuccess implements Action {
  readonly type = ActionTypes.UpdateFilterSuccess;
  constructor(public filter: Filter) {}
}

export type FilterAction = Failed | UpdateFilter | UpdateFilterSuccess;
