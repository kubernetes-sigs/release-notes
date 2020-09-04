import { TestBed } from '@angular/core/testing';
import { NotesService } from './notes.service';
import { LoggerService } from '@shared/services/logger.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { notesMock } from '@app/shared/model/notes.model.mock';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggerService],
    }).compileComponents();

    service = TestBed.inject(NotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should succeed to get notes', () => {
    expect(service.getNotes()).toBeTruthy();
  });

  it('should succeed to convert to note list', () => {
    expect(
      service.toNoteList([
        [notesMock, '0.1.0'],
        [notesMock, '0.2.0'],
      ]),
    ).toEqual(notesMock.concat(notesMock));
  });
});
