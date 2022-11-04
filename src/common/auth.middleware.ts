import type { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import type { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const jwt = req.headers.authorization?.split(' ')[1];
    if (jwt) {
      const payload = await this.verifyJWT(jwt);
      if (payload) {
        req.user = payload.email;
      }
    }
    next();
  }

  private async verifyJWT(token: string): Promise<JwtPayload | null> {
    return new Promise((resolve, reject) => {
      verify(token, this.secret, (err, payload) => {
        if (err) {
          reject(null);
        }
        resolve(payload as JwtPayload);
      });
    });
  }
}
