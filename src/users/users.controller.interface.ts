import type { RequestHandler } from 'express';

import type { BaseController } from '../common/base.controller';

export interface IUsersController extends BaseController {
  register: RequestHandler;
  login: RequestHandler;
  info: RequestHandler;
}
