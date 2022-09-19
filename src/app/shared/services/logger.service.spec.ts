import { TestBed, getTestBed } from '@angular/core/testing';
import { LoggerService, Verbosity } from './logger.service';
import {jest} from '@jest/globals'

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
    service = injector.inject(LoggerService);

    jest.spyOn(global.console, 'log');
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    jest.spyOn(global.console, 'log').mockReset();
    jest.spyOn(global.console, 'warn').mockReset();
    jest.spyOn(global.console, 'error').mockReset();
  })

  describe('error', () => {
    it('should log', () => {
      // Given
      service.setVerbosity(Verbosity.Error);

      // When
      service.error(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should not log when logLevel < Verbosity.Warn', () => {
      // Given
      service.setVerbosity(Verbosity.Error);

      // When
      service.warn(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log when logLevel >= Verbosity.Warn', () => {
      // Given
      service.setVerbosity(Verbosity.Warn);

      // When
      service.warn(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should not log when logLevel < Verbosity.Info', () => {
      // Given
      service.setVerbosity(Verbosity.Warn);

      // When
      service.info(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log when logLevel >= Verbosity.Info', () => {
      // Given
      service.setVerbosity(Verbosity.Info);

      // When
      service.info(message);

      // Then
      expect(console.log).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should not log when logLevel < Verbosity.Debug', () => {
      // Given
      service.setVerbosity(Verbosity.Info);

      // When
      service.debug(message);

      // Then
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log when logLevel >= Verbosity.Debug', () => {
      // Given
      service.setVerbosity(Verbosity.Debug);

      // When
      service.debug(message);

      // Then
      expect(console.log).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
