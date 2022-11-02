import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { BaseController } from '../common/base.controller';
import { KEYS } from './../keys';
import type { ILogger } from './../logger/logger.interface';
import type { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(@inject(KEYS.ILogger) logger: ILogger) {
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

  register(req: Request, res: Response, next: NextFunction): void {
    this.created(res, { message: 'Registered' });
  }

  login(req: Request, res: Response, next: NextFunction): void {
    this.ok(res, { message: 'Logged in' });
  }
}
