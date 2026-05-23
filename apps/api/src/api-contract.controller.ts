import { Controller } from '@nestjs/common';
import { appContract } from '@repo/api-contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { Public } from '@/auth/decorators/public.decorator';

@Public()
@Controller()
export class ApiContractController {
  @TsRestHandler(appContract)
  handler() {
    return tsRestHandler(appContract, {
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
