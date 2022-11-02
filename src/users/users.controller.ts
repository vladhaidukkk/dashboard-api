import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { BaseController } from '../common/base.controller';
import { KEYS } from './../keys';
import type { ILogger } from './../logger/logger.interface';
import type { UserLoginDTO } from './dto/user-login.dto';
import type { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
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

  async register(
    { body }: Request<{}, {}, UserRegisterDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const newUser = new User(body.email, body.name);
    await newUser.setPassword(body.password);
    this.created(res, { email: newUser.email, name: newUser.name });
  }

  login(req: Request<{}, {}, UserLoginDTO>, res: Response, next: NextFunction): void {
    this.ok(res, { message: 'Logged in' });
  }
}
