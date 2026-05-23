import { Controller } from '@nestjs/common';
import { contract } from '@repo/api-contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { Public } from '@/auth/decorators/public.decorator';

/** D2: replace auth stubs with AuthService / verification / reset handlers. */
const authNotImplemented = () =>
  Promise.resolve({
    status: 500 as const,
    body: { status: 500 as const, error: 'Not implemented' },
  });

@Public()
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
      register: authNotImplemented,
      login: authNotImplemented,
      logout: authNotImplemented,
      me: authNotImplemented,
      verifyEmail: authNotImplemented,
      resendVerification: authNotImplemented,
      forgotPassword: authNotImplemented,
      resetPassword: authNotImplemented,
      resendPasswordReset: authNotImplemented,
    });
  }
}
