import { applyDecorators, UseGuards } from '@nestjs/common';

import { AdminGuard } from '@/admin/guards/admin.guard';

/**
 * Restricts a route or controller to users with role `ADMIN`.
 * Requires a valid session (`SessionAuthGuard` runs globally first).
 */
export function AdminOnly(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseGuards(AdminGuard));
}
