import type { NextFunction, Request, Response } from 'express';

import { BaseController } from '../common/base.controller';
import type { LoggerService } from './../logger/logger.service';

export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
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
