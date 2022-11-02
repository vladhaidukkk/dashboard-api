import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

import type { IMiddleware } from './middleware.interface';

export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidate: ClassConstructor<object>) {}

  async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const instance = plainToInstance(this.classToValidate, body);
    const errors = await validate(instance);

    if (errors.length > 0) {
      res.status(422).json(errors);
    } else {
      next();
    }
  }
}
