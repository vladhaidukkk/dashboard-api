import { DotenvParseOutput, config } from 'dotenv';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { KEYS } from './../keys';
import type { ILogger } from './../logger/logger.interface';
import type { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(KEYS.ILogger) private logger: ILogger) {
    const { error, parsed } = config();

    if (error) {
      this.logger.error("[ConfigService] Failed to read .env file or it doesn't exist");
    } else {
      this.logger.info('[ConfigService] Registered');
      this.config = parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
