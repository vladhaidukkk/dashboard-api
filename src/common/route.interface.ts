import type { RequestHandler, Router } from 'express';

import type { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
  path: string;
  handler: RequestHandler;
  middlewares?: IMiddleware[];
}
