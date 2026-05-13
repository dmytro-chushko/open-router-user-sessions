import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { ApiContractController } from '@/api-contract.controller';
import { AuthModule } from '@/auth/auth.module';
import { SessionAuthGuard } from '@/auth/guards/session-auth.guard';
import { CommonModule } from '@/common/common.module';
import { AllExceptionsFilter } from '@/filters';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [ApiContractController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: SessionAuthGuard,
    },
  ],
})
export class AppModule {}
