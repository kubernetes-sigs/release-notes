import { Action } from '@ngrx/store';
import { Note } from '@app/shared/model/notes.model';
import { Filter } from '@app/shared/model/filter.model';

export enum ActionTypes {
  Failed = '[Notes Component] Failed',

  GetNotes = '[Notes Component] Get Notes',
  GetNotesSuccess = '[Notes Component] Get Notes Success',
  GetNotesComplete = '[Notes Component] Get Notes Complete',

  DoFilter = '[Notes Component] Do Filter',
  DoFilterSuccess = '[Notes Component] Do Filter Success',
}

export class Failed implements Action {
  readonly type = ActionTypes.Failed;
  constructor(public error: string) {}
}

export class DoFilter implements Action {
  readonly type = ActionTypes.DoFilter;
  constructor(
    public notes: Note[],
    public filter: Filter,
  ) {}
}

export class DoFilterSuccess implements Action {
  readonly type = ActionTypes.DoFilterSuccess;
  constructor(public notes: Note[]) {}
}

export class GetNotes implements Action {
  readonly type = ActionTypes.GetNotes;
  constructor() {}
}

export class GetNotesSuccess implements Action {
  readonly type = ActionTypes.GetNotesSuccess;
  constructor(public payload: Note[]) {}
}

export class GetNotesComplete implements Action {
  readonly type = ActionTypes.GetNotesComplete;
}

export type NotesAction =
  | Failed
  | DoFilter
  | DoFilterSuccess
  | GetNotes
  | GetNotesSuccess
  | GetNotesComplete;
