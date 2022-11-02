import { Response, Router } from 'express';

import type { LoggerService } from './../logger/logger.service';
import type { IControllerRoute } from './route.interface';

export abstract class BaseController {
  private readonly _router: Router;

  constructor(protected logger: LoggerService) {
    this._router = Router();
  }

  get router(): Router {
    return this.router;
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
      const handler = route.handler.bind(this);
      this._router[route.method](route.path, handler);
      this.logger.info(`[${route.method.toUpperCase()}] ${route.path}`);
    }
  }
}
