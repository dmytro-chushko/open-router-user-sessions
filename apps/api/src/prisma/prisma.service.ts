import { PrismaClient } from '@generated/prisma/client';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { withErrorHandling } from '@/common/utils/error/error-handler';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL');

    if (connectionString === undefined || connectionString === '') {
      throw new Error('DATABASE_URL is not set');
    }

    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.ping();
    this.logger.log('Database connection verified');
  }

  async ping(): Promise<void> {
    await this.$executeRawUnsafe('SELECT 1');
  }

  async onModuleDestroy(): Promise<void> {
    await withErrorHandling(
      async () => {
        await this.$disconnect();
      },
      { logger: this.logger, context: 'PrismaService.onModuleDestroy' },
    );
  }
}
