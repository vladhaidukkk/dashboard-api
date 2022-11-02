import type { NextFunction, Request, Response } from 'express';

import type { ILogger } from './../logger/logger.interface';
import type { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';

export class ExceptionFilter implements IExceptionFilter {
  constructor(private logger: ILogger) {
    this.logger.info('[ExceptionFilter] registered');
  }

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof HTTPError) {
      const logMessage = err.context
        ? `[${err.code}] on ${err.context}: ${err.message}`
        : `[${err.code}] ${err.message}`;
      this.logger.error(logMessage);
      res.status(err.code).json({ error: err.message });
    } else {
      this.logger.error(err.message);
      res.status(500).json({ error: err.message });
    }
  }
}
