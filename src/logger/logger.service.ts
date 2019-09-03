import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import { Request, RequestHandler, Response } from 'express';
import * as morgan from 'morgan';
import { LOG_FORMAT } from './logger.constant';

/**
 * The application logger based on winston and morgan is defined here.
 */
@Injectable()
export class LoggerService implements NestLoggerService {

  private readonly logger: Logger;
  private readonly format: string;

  constructor() {

    this.format = LOG_FORMAT;
    this.logger = createLogger({
        level: 'info',
        format: format.json(),
        transports: [
          new transports.Console(),
          new transports.File({ filename: 'error.log', level: 'error' }),
        ]});
  }

  logInfo(): RequestHandler {
    return morgan(this.format, {
      skip: (req: Request, res: Response) => res.statusCode < 400,
      stream: process.stdout,
    });
  }

  logError(): RequestHandler {
    return morgan(this.format, {
      skip: (req: Request, res: Response) => res.statusCode >= 400,
      stream: process.stderr,
    });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.debug(message, context, trace);
  }

  log(message: string, context?: string): void {
    this.logger.log({ level: 'info', message });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, context);
  }

  warn(message: string, context?: string): void {
    this.logger.verbose(message, context);
  }
}
