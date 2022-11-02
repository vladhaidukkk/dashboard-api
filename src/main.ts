import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';

function bootstrap(): void {
  const logger = new LoggerService();
  const exceptionFilter = new ExceptionFilter(logger);
  const usersController = new UsersController(logger);

  const app = new App(logger, exceptionFilter, usersController);
  app.init();
}

bootstrap();
