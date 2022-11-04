import type { NextFunction, Request, Response } from 'express';

import type { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
  execute({ user }: Request, res: Response, next: NextFunction): void {
    if (user) {
      return next();
    }
    res.status(401).json({ error: 'You are not logged in' });
  }
}
