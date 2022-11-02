import { App } from './app';
import { LoggerService } from './logger/logger.service';

function bootstrap(): void {
  const app = new App(new LoggerService());
  app.init();
}

bootstrap();
