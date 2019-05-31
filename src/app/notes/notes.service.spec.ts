import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NotesService } from './notes.service';
import { LoggerService } from '@shared/services/logger.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Filter } from '@app/shared/model/options.model';

describe('NotesService', () => {
  let service: NotesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggerService],
    }).compileComponents();

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(NotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should succeed to get notes', () => {
    expect(service.getNotes(new Filter())).toBeTruthy();
  });
});
