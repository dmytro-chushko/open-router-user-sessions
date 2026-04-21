import { Module } from '@nestjs/common';
import { ApiContractController } from './api-contract.controller';

@Module({
  imports: [],
  controllers: [ApiContractController],
  providers: [],
})
export class AppModule {}
