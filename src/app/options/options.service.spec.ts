import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { OptionsService } from './options.service';

describe('OptionsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    }),
  );

  it('should be created', () => {
    const service: OptionsService = TestBed.get(OptionsService);
    expect(service).toBeTruthy();
  });
});
