import { Action, createSelector } from '@ngrx/store';
import { ActionTypes, Failed, UpdateFilterSuccess } from './filter.actions';
import { Filter } from '@app/shared/model/filter.model';
import { State as RootState } from '@app/app.reducer';

export interface State {
  error: string | null;
  filter: Filter;
}

export const initialState: State = {
  error: null,
  filter: new Filter(),
};

export function filterReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case ActionTypes.UpdateFilterSuccess: {
      return {
        ...state,
        filter: (action as UpdateFilterSuccess).filter,
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

export const selectFilter = (state: RootState) => state.filter;
export const getFilterSelector = createSelector(selectFilter, (state: State) => state.filter);
