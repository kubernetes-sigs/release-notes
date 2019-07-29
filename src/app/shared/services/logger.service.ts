import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

/**
 * All available verbosity levels
 */
export enum Verbosity {
  Error = 0,
  Warn,
  Info,
  Debug,
}

/**
 * The logger service implementation
 */
@Injectable()
export class LoggerService {
  /**
   * The default verbosity in non production mode
   */
  private logLevel = Verbosity.Debug;

  /**
   * The loggers constructor
   */
  constructor() {
    // Adapt the default verbosity in production mode
    if (!isDevMode()) {
      this.logLevel = Verbosity.Error;
    }
  }

  /**
   * Gets the current time as prefix
   *
   * @returns The time prefix.
   */
  private date(): string {
    const date = new Date();
    return date.toLocaleString();
  }

  /**
   * Set the verbosity to a dedicated level
   *
   * @param level     The verbosity level
   */
  public setVerbosity(level: Verbosity) {
    this.logLevel = level;
  }

  /**
   * Logs a debug message to the console when log level >= 3
   *
   * @param msg     The log message
   */
  public debug(msg: string) {
    if (this.logLevel >= Verbosity.Debug) {
      console.log(`[DEBUG]\t${this.date()}: ${msg}`);
    }
  }

  /**
   * Logs an info message to the console when log level >= 2
   *
   * @param msg     The info log message
   */
  public info(msg: string) {
    if (this.logLevel >= Verbosity.Info) {
      console.log(`[INFO]\t${this.date()}: ${msg}`);
    }
  }

  /**
   * Logs a warning to the console when log level >= 1
   *
   * @param msg     The warning log message
   */
  public warn(msg: string) {
    if (this.logLevel >= Verbosity.Warn) {
      console.warn(`[WARN]\t${this.date()}: ${msg}`);
    }
  }

  /**
   * Always logs an error message to the console
   *
   * @param msg     The error log message
   */
  public error(msg: string) {
    if (this.logLevel >= Verbosity.Error) {
      console.error(`[ERROR]\t${this.date()}: ${msg}`);
    }
  }
}
