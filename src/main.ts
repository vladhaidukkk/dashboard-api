import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import { KEYS } from './keys';
import type { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import type { IUsersController } from './users/users.controller.interface';

interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(KEYS.ILogger).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(KEYS.IExceptionFilter).to(ExceptionFilter);
  bind<IUsersController>(KEYS.IUsersController).to(UsersController);
  bind<App>(KEYS.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(KEYS.Application);
  app.init();

  return { appContainer, app };
}

export const { appContainer, app } = bootstrap();
