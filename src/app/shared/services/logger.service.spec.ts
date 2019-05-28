import { TestBed, getTestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { environment } from '@environment';

describe('LoggerService', () => {
  let service: LoggerService;
  let injector: TestBed;

  // Given
  const message = 'message';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    }).compileComponents();
    injector = getTestBed();
    service = injector.get(LoggerService);

    spyOn(global.console, 'log').and.callThrough();
    spyOn(global.console, 'warn').and.callThrough();
    spyOn(global.console, 'error').and.callThrough();
  });

  describe('error', () => {
    it('should log', () => {
      // When
      service.error(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should not log when logLevel < 1', () => {
      // Given
      environment.logLevel = 0;

      // When
      service.warn(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log when logLevel >= 1', () => {
      // Given
      environment.logLevel = 1;

      // When
      service.warn(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should not log when logLevel < 2', () => {
      // Given
      environment.logLevel = 1;

      // When
      service.info(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log when logLevel >= 2', () => {
      // Given
      environment.logLevel = 2;

      // When
      service.info(message);

      // Then
      expect(console.log).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should not log when logLevel < 3', () => {
      // Given
      environment.logLevel = 2;

      // When
      service.debug(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log when logLevel >= 3', () => {
      // Given
      environment.logLevel = 3;

      // When
      service.debug(message);

      // Then
      expect(console.log).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
