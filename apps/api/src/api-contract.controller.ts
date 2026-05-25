import { Controller } from '@nestjs/common';
import { appContract } from '@repo/api-contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { Public } from '@/auth/decorators/public.decorator';
import { getErrorMessage } from '@/common/utils/error/get-error-message';
import { PrismaService } from '@/prisma/prisma.service';

@Public()
@Controller()
export class ApiContractController {
  constructor(private readonly prisma: PrismaService) {}

  @TsRestHandler(appContract)
  handler() {
    return tsRestHandler(appContract, {
      health: () =>
        Promise.resolve({
          status: 200 as const,
          body: { ok: true as const },
        }),
      healthReady: async () => {
        try {
          await this.prisma.ping();

          return {
            status: 200 as const,
            body: { ok: true as const },
          };
        } catch (error: unknown) {
          return {
            status: 503 as const,
            body: {
              ok: false as const,
              error: getErrorMessage(error),
            },
          };
        }
      },
      hello: () =>
        Promise.resolve({
          status: 200 as const,
          body: { message: 'Hello world' },
        }),
    });
  }
}
