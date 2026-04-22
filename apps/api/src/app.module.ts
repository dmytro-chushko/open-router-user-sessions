import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiContractController } from './api-contract.controller';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CommonModule],
  controllers: [ApiContractController],
  providers: [],
})
export class AppModule {}
