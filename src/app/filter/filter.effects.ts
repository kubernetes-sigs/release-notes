import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { ActionTypes, UpdateFilterSuccess, UpdateFilter } from './filter.actions';
import { Filter } from '@app/shared/model/filter.model';
import { LoggerService } from '@shared/services/logger.service';

@Injectable()
export class FilterEffects {
  updateFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.UpdateFilter),
      map((action: UpdateFilter) => action.filter),
      exhaustMap(filter => {
        this.logger.debug('[Filter Effects:UpdateFilter] SUCCESS');
        const copy = new (filter.constructor as { new (): Filter })();
        Object.assign(copy, filter);
        return of(new UpdateFilterSuccess(copy));
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private logger: LoggerService,
  ) {}
}
