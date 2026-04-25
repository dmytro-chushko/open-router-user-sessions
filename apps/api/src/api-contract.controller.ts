import { Controller } from '@nestjs/common';
import { contract } from '@repo/api-contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

@Controller()
export class ApiContractController {
  @TsRestHandler(contract)
  handler() {
    return tsRestHandler(contract, {
      health: () =>
        Promise.resolve({
          status: 200 as const,
          body: { ok: true as const },
        }),
      hello: () =>
        Promise.resolve({
          status: 200 as const,
          body: { message: 'Hello world' },
        }),
    });
  }
}
