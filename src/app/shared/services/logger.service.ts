import { Injectable } from '@angular/core';
import { environment } from '@environment';

/**
 * The logger service implementation
 */
@Injectable()
export class LoggerService {
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
   * Logs a debug message to the console when log level >= 3
   *
   * @param msg     The log message
   */
  public debug(msg: string) {
    if (environment.logLevel >= 3) {
      console.log(`[DEBUG]\t${this.date()}: ${msg}`);
    }
  }

  /**
   * Logs an info message to the console when log level >= 2
   *
   * @param msg     The info log message
   */
  public info(msg: string) {
    if (environment.logLevel >= 2) {
      console.log(`[INFO]\t${this.date()}: ${msg}`);
    }
  }

  /**
   * Logs a warning to the console when log level >= 1
   *
   * @param msg     The warning log message
   */
  public warn(msg: string) {
    if (environment.logLevel >= 1) {
      console.warn(`[WARN]\t${this.date()}: ${msg}`);
    }
  }

  /**
   * Always logs an error message to the console
   *
   * @param msg     The error log message
   */
  public error(msg: string) {
    console.error(`[ERROR]\t${this.date()}: ${msg}`);
  }
}
