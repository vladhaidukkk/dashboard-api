import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import 'reflect-metadata';

import { BaseController } from '../common/base.controller';
import type { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from './../common/auth.guard';
import { ValidateMiddleware } from './../common/validate.middleware';
import { HTTPError } from './../errors/http-error.class';
import { KEYS } from './../keys';
import type { ILogger } from './../logger/logger.interface';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import type { IUsersController } from './users.controller.interface';
import type { IUsersService } from './users.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  constructor(
    @inject(KEYS.ILogger) logger: ILogger,
    @inject(KEYS.IConfigService) private configService: IConfigService,
    @inject(KEYS.IUsersService) private usersService: IUsersService
  ) {
    super(logger);

    this.bindRoutes([
      {
        method: 'post',
        path: '/register',
        handler: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDTO)],
      },
      {
        method: 'post',
        path: '/login',
        handler: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDTO)],
      },
      {
        method: 'get',
        path: '/info',
        handler: this.info,
        middlewares: [new AuthGuard()],
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
    this.created(res, { id: result.id, email: result.email, name: result.name });
  }

  async login(
    { body, originalUrl }: Request<{}, {}, UserLoginDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.usersService.validateUser(body);
    if (!result) {
      return next(new HTTPError(401, 'Failed to authorize', originalUrl));
    }
    const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
    this.ok(res, { jwt });
  }

  async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
    const userInfo = await this.usersService.getUserInfo(user);
    this.ok(res, { id: userInfo?.id, email: userInfo?.email, name: userInfo?.name });
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sign({ email, iat: Date.now() }, secret, { algorithm: 'HS256' }, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token as string);
      });
    });
  }
}
