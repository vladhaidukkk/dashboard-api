import express, { Express } from 'express';
import type { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import type { IExceptionFilter } from './errors/exception.filter.interface';
import { KEYS } from './keys';
import type { ILogger } from './logger/logger.interface';
import type { IUsersController } from './users/users.controller.interface';

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(KEYS.ILogger) private logger: ILogger,
    @inject(KEYS.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(KEYS.IUsersController) private usersController: IUsersController
  ) {
    this.app = express();
    this.port = 8080;
  }

  private useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  private useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  init(): void {
    this.useRoutes();
    this.useExceptionFilters();

    this.server = this.app.listen(this.port);
    this.logger.info(`Server running at http://localhost:${this.port}`);
  }

  close(): void {
    this.server.close();
  }
}
