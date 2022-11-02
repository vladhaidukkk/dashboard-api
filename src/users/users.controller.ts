import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { BaseController } from '../common/base.controller';
import { HTTPError } from './../errors/http-error.class';
import { KEYS } from './../keys';
import type { ILogger } from './../logger/logger.interface';
import type { UserLoginDTO } from './dto/user-login.dto';
import type { UserRegisterDTO } from './dto/user-register.dto';
import type { IUsersController } from './users.controller.interface';
import type { IUsersService } from './users.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(KEYS.ILogger) logger: ILogger,
    @inject(KEYS.IUsersService) private usersService: IUsersService
  ) {
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
    { body, originalUrl }: Request<{}, {}, UserRegisterDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.usersService.createUser(body);
    if (!result) {
      return next(new HTTPError(409, 'User with this email already registered', originalUrl));
    }
    this.created(res, { email: result.email, name: result.name });
  }

  login(req: Request<{}, {}, UserLoginDTO>, res: Response, next: NextFunction): void {
    this.ok(res, { message: 'Logged in' });
  }
}
