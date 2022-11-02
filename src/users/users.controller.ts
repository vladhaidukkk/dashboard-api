import type { NextFunction, Request, Response } from 'express';

import { BaseController } from '../common/base.controller';
import type { ILogger } from './../logger/logger.interface';

export class UsersController extends BaseController {
  constructor(logger: ILogger) {
    super(logger);

    this.bindRoutes([
      {
        method: 'post',
        path: '/register',
        handler: this.register,
      },
      {
        method: 'post',
        path: '/login',
        handler: this.login,
      },
    ]);
  }

  private register(req: Request, res: Response, next: NextFunction): void {
    this.created(res, { message: 'Registered' });
  }

  private login(req: Request, res: Response, next: NextFunction): void {
    this.ok(res, { message: 'Logged in' });
  }
}
