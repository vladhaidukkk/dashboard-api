import { json } from 'body-parser';
import express, { Express } from 'express';
import type { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import type { IConfigService } from './config/config.service.interface';
import type { IPrismaService } from './database/prisma.service.interface';
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
    @inject(KEYS.IConfigService) private configService: IConfigService,
    @inject(KEYS.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(KEYS.IUsersController) private usersController: IUsersController,
    @inject(KEYS.IPrismaService) private prismaService: IPrismaService
  ) {
    this.app = express();
    this.port = Number(this.configService.get('PORT')) || 8080;
  }

  private useMiddlewares(): void {
    this.app.use(json());
  }

  private useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  private useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init(): Promise<void> {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();

    await this.prismaService.connect();
    this.server = this.app.listen(this.port);
    this.logger.info(`Server running at http://localhost:${this.port}`);
  }

  close(): void {
    this.server.close();
  }
}
