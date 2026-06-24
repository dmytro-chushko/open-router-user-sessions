import { AuditAction } from '@generated/prisma/client';
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

import { AuditLogService } from '@/audit/audit-log.service';
import type { PublicUser } from '@/user/types/public-user';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auditLogService: AuditLogService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as PublicUser | undefined;

    if (user?.role === 'ADMIN') {
      return true;
    }

    await this.auditLogService.record({
      action: AuditAction.ADMIN_ACCESS_DENIED,
      actorId: user?.id ?? null,
      success: false,
      ipAddress: request.ip ?? null,
      userAgent: this.readUserAgent(request),
      metadata: {
        path: request.path,
        method: request.method,
        ...(user !== undefined ? { role: user.role } : {}),
      },
    });

    throw new ForbiddenException('Admin access required');
  }

  private readUserAgent(request: Request): string | null {
    const value = request.headers['user-agent'];

    return typeof value === 'string' ? value : null;
  }
}
