import express, { Express } from 'express';
import type { Server } from 'http';

import type { LoggerService } from './logger/logger.service';
import { usersRouter } from './users/users';

export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(private logger: LoggerService) {
    this.app = express();
    this.port = 8080;
  }

  private useRoutes(): void {
    this.app.use('/users', usersRouter);
  }

  init(): void {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.info(`Server running at http://localhost:${this.port}`);
  }

  close(): void {
    this.server.close();
  }
}
