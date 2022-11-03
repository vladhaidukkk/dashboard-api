import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import type { ILogger } from '../logger/logger.interface';
import { KEYS } from './../keys';
import type { IPrismaService } from './prisma.service.interface';

@injectable()
export class PrismaService implements IPrismaService {
  client: PrismaClient;

  constructor(@inject(KEYS.ILogger) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.info('[PrismaService] Connected to database');
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`[PrismaService] Failed to connect to database: ${err.message}`);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
