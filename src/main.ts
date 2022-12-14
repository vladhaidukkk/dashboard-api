import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { ConfigService } from './config/config.service';
import type { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import type { IPrismaService } from './database/prisma.service.interface';
import { ExceptionFilter } from './errors/exception.filter';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import { KEYS } from './keys';
import type { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import type { IUsersController } from './users/users.controller.interface';
import { UsersRepository } from './users/users.repository';
import type { IUsersRepository } from './users/users.repository.interface';
import { UsersService } from './users/users.service';
import type { IUsersService } from './users/users.service.interface';

interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(KEYS.ILogger).to(LoggerService).inSingletonScope();
  bind<IConfigService>(KEYS.IConfigService).to(ConfigService).inSingletonScope();
  bind<IExceptionFilter>(KEYS.IExceptionFilter).to(ExceptionFilter);
  bind<IUsersController>(KEYS.IUsersController).to(UsersController);
  bind<IUsersService>(KEYS.IUsersService).to(UsersService);
  bind<IUsersRepository>(KEYS.IUsersRepository).to(UsersRepository).inSingletonScope();
  bind<IPrismaService>(KEYS.IPrismaService).to(PrismaService).inSingletonScope();
  bind<App>(KEYS.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(KEYS.Application);
  await app.init();

  return { appContainer, app };
}

export const boot = bootstrap();
