import express, { Express } from 'express';
import type { Server } from 'http';

import type { ExceptionFilter } from './errors/exception.filter';
import type { ILogger } from './logger/logger.interface';
import type { UsersController } from './users/users.controller';

export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    private logger: ILogger,
    private exceptionFilter: ExceptionFilter,
    private usersController: UsersController
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
