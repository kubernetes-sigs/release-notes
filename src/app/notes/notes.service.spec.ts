import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NotesService } from './notes.service';
import { LoggerService } from '@shared/services/logger.service';

describe('NotesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LoggerService],
    }),
  );

  it('should be created', () => {
    const service: NotesService = TestBed.get(NotesService);
    expect(service).toBeTruthy();
  });
});
