import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { FilterEffects } from './filter.effects';
import { UpdateFilter, UpdateFilterSuccess } from './filter.actions';
import { LoggerService } from '@shared/services/logger.service';
import { Filter } from '@app/shared/model/filter.model';

describe('FilterEffects', () => {
  const testFilter = new Filter();

  let effects: FilterEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterEffects, provideMockActions(() => actions), LoggerService],
    });

    effects = TestBed.inject(FilterEffects);
  });

  describe('GetFilter', () => {
    it('should succeed with empty filter', () => {
      const action = new UpdateFilter(testFilter);
      const completion = new UpdateFilterSuccess(testFilter);

      actions = hot('-a---', { a: action });
      cold('a|', { a: testFilter });
      const expected = cold('-b', { b: completion });

      expect(effects.updateFilter$).toBeObservable(expected);
    });
  });
});
