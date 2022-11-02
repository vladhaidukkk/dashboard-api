import type { RequestHandler } from 'express';

export interface IMiddleware {
  execute: RequestHandler;
}
