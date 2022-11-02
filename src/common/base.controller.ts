import { Response, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import type { ILogger } from './../logger/logger.interface';
import type { IControllerRoute } from './route.interface';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(protected logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  private send<T>(res: Response, code: number, data: T): Response {
    return res.status(code).json(data);
  }

  protected ok<T>(res: Response, data: T): Response {
    return this.send<T>(res, 200, data);
  }

  protected created<T>(res: Response, data: T): Response {
    return this.send<T>(res, 201, data);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      this.logger.info(`[${route.method.toUpperCase()}] ${route.path}`);
      const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.handler.bind(this);
      const pipeline = middlewares ? [...middlewares, handler] : handler;
      this._router[route.method](route.path, pipeline);
    }
  }
}
