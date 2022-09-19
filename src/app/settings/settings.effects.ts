import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { ActionTypes, UpdateSettingsSuccess, UpdateSettings } from './settings.actions';
import { LoggerService } from '@shared/services/logger.service';

@Injectable()
export class SettingsEffects {
  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.UpdateSettings),
      map((action: UpdateSettings) => action.settings),
      exhaustMap(settings => {
        this.logger.debug('[Settings Effects:UpdateSettings] SUCCESS');
        const copy = new (settings.constructor as { new () })();
        Object.assign(copy, settings);
        return of(new UpdateSettingsSuccess(copy));
      }),
    ),
  );

  constructor(private actions$: Actions, private logger: LoggerService) {}
}
