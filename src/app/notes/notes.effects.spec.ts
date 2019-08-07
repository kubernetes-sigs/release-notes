import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NotesService } from './notes.service';
import { NotesEffects } from './notes.effects';
import { DoFilter, DoFilterSuccess, Failed, GetNotes, GetNotesSuccess } from './notes.actions';
import { notesMock } from './notes.model.mock';
import { LoggerService } from '@shared/services/logger.service';
import { Filter } from '@app/shared/model/options.model';

describe('NotesEffects', () => {
  const filter = new Filter();

  let effects: NotesEffects;
  let actions: Observable<any>;
  let notesService: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotesEffects, provideMockActions(() => actions), LoggerService, NotesService],
    });

    effects = TestBed.get(NotesEffects);
    notesService = TestBed.get(NotesService);
  });

  describe('GetNotes', () => {
    it('should succeed with empty filter', () => {
      const action = new GetNotes();
      const completion = new GetNotesSuccess(notesMock);

      actions = hot('-a---', { a: action });
      const response = cold('-a|', { a: notesMock });
      const expected = cold('--b', { b: completion });
      notesService.getNotes = () => response;

      expect(effects.getNotes$).toBeObservable(expected);
    });

    it('should fail if NotesService fails', () => {
      const error = 'error';
      const action = new GetNotes();
      const completion = new Failed(error);

      actions = hot('-a---', { a: action });
      const response = cold('-#|', { a: error });
      const expected = cold('--b', { b: completion });
      notesService.getNotes = () => response;

      expect(effects.getNotes$).toBeObservable(expected);
    });
  });

  describe('DoFilter', () => {
    it('should succeed with empty filter', () => {
      const action = new DoFilter(notesMock, filter);
      const completion = new DoFilterSuccess(notesMock);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });

    it('should succeed with non matching filter', () => {
      const testFilter = new Filter();
      testFilter.areas = ['area'];
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess([]);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });
  });
});
