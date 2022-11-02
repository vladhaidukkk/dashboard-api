import type { ErrorRequestHandler } from 'express';

export interface IExceptionFilter {
  catch: ErrorRequestHandler;
}
