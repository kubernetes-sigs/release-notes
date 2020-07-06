import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { SettingsEffects } from './settings.effects';
import { UpdateSettings, UpdateSettingsSuccess } from './settings.actions';
import { LoggerService } from '@shared/services/logger.service';
import { Settings } from '@app/shared/model/settings.model';

describe('SettingsEffects', () => {
  const testSettings = new Settings();

  let effects: SettingsEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsEffects, provideMockActions(() => actions), LoggerService],
    });

    effects = TestBed.inject(SettingsEffects);
  });

  describe('GetSettings', () => {
    it('should succeed with empty settings', () => {
      const action = new UpdateSettings(testSettings);
      const completion = new UpdateSettingsSuccess(testSettings);

      actions = hot('-a---', { a: action });
      cold('a|', { a: testSettings });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSettings$).toBeObservable(expected);
    });
  });
});
