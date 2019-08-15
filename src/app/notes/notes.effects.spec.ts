import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NotesService } from './notes.service';
import { NotesEffects } from './notes.effects';
import { DoFilter, DoFilterSuccess, Failed, GetNotes, GetNotesSuccess } from './notes.actions';
import { notesMock } from '@app/shared/model/notes.model.mock';
import { OptionType } from '@app/shared/model/options.model';
import { LoggerService } from '@shared/services/logger.service';
import { Filter } from '@app/shared/model/filter.model';

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
      testFilter.set(OptionType.areas, 'area52');
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess([]);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });

    it('should succeed with matching filter by area', () => {
      const testFilter = new Filter();
      testFilter.set(OptionType.areas, notesMock[0].areas[0]);
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess(notesMock);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });

    it('should succeed with matching filter by kinds', () => {
      const testFilter = new Filter();
      testFilter.set(OptionType.kinds, notesMock[0].kinds[0]);
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess(notesMock);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });

    it('should succeed with matching filter by sig', () => {
      const testFilter = new Filter();
      testFilter.set(OptionType.sigs, notesMock[0].sigs[0]);
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess(notesMock);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });

    it('should succeed with matching filter by documentation', () => {
      const testFilter = new Filter();
      testFilter.set(OptionType.documentation, notesMock[0].documentation[0].type.toString());
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess(notesMock);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });

    it('should succeed with matching filter by text', () => {
      const testFilter = new Filter();
      testFilter.text = notesMock[0].author;
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess(notesMock);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });

    it('should succeed with non matching pre-release version', () => {
      const testFilter = new Filter();
      testFilter.set(OptionType.releaseVersions, '1.18.0-alpha.1');
      const action = new DoFilter(notesMock, testFilter);
      const completion = new DoFilterSuccess([]);

      actions = hot('--a-', { a: action });
      const expected = cold('--b', { b: completion });

      expect(effects.doFilter$).toBeObservable(expected);
    });
  });
});
