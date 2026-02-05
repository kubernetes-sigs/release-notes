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
    const note1 = { ...notesMock[0], release_version: 'original' };
    const note2 = { ...notesMock[0], release_version: 'original' };
    const mockData: [Record<string, unknown>, string][] = [
      [{ note1 }, '0.1.0'],
      [{ note2 }, '0.2.0'],
    ];
    const result = service.toNoteList(mockData);
    expect(result).toHaveLength(2);
    // Verify each note got its release version set
    const versions = result.map(n => n.release_version).sort();
    expect(versions).toEqual(['0.1.0', '0.2.0']);
  });
});
