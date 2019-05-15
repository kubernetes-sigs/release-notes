import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { OptionsService } from './options.service';
import { LoggerService } from '@shared/services/logger.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('OptionsService', () => {
  let service: OptionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggerService],
    }).compileComponents();

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(OptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should succeed to get options', () => {
    expect(service.getOptions()).toBeTruthy();
  });
});
