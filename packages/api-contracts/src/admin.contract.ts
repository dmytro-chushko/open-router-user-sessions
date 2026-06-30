import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  badRequestResponse,
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from "./common-responders.js";
import {
  adminStatsSchema,
  adminUpdateUserRoleBodySchema,
  adminUserDetailSchema,
  adminUserIdParamsSchema,
  adminUserListResultSchema,
  adminUsersListQuerySchema,
  auditLogListResultSchema,
  auditLogsListQuerySchema,
} from "./schemas/admin.js";

const c = initContract();

const emptyBodySchema = z.object({}).strict();

export const adminContract = c.router(
  {
    getStats: {
      method: "GET",
      path: "/stats",
      responses: {
        200: adminStatsSchema,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        500: internalServerErrorResponse,
      },
      summary: "Admin overview statistics",
      description: "Requires ADMIN session cookie.",
    },

    listUsers: {
      method: "GET",
      path: "/users",
      query: adminUsersListQuerySchema,
      responses: {
        200: adminUserListResultSchema,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        422: unprocessableEntityResponse,
        500: internalServerErrorResponse,
      },
      summary: "List users (admin)",
      description: "Requires ADMIN session cookie.",
    },

    getUser: {
      method: "GET",
      path: "/users/:id",
      pathParams: adminUserIdParamsSchema,
      responses: {
        200: adminUserDetailSchema,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        500: internalServerErrorResponse,
      },
      summary: "Get user detail (admin)",
      description: "Requires ADMIN session cookie.",
    },

    updateUserRole: {
      method: "PATCH",
      path: "/users/:id",
      pathParams: adminUserIdParamsSchema,
      body: adminUpdateUserRoleBodySchema,
      responses: {
        200: adminUserDetailSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        422: unprocessableEntityResponse,
        500: internalServerErrorResponse,
      },
      summary: "Update user role (admin)",
      description: "Requires ADMIN session cookie.",
    },

    deleteUser: {
      method: "DELETE",
      path: "/users/:id",
      pathParams: adminUserIdParamsSchema,
      body: emptyBodySchema,
      responses: {
        204: z.void(),
        400: badRequestResponse,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        500: internalServerErrorResponse,
      },
      summary: "Delete user (admin)",
      description: "Requires ADMIN session cookie.",
    },

    revokeUserSessions: {
      method: "DELETE",
      path: "/users/:id/sessions",
      pathParams: adminUserIdParamsSchema,
      body: emptyBodySchema,
      responses: {
        204: z.void(),
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        500: internalServerErrorResponse,
      },
      summary: "Revoke all sessions for user (admin)",
      description: "Requires ADMIN session cookie.",
    },

    listAuditLogs: {
      method: "GET",
      path: "/audit-logs",
      query: auditLogsListQuerySchema,
      responses: {
        200: auditLogListResultSchema,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        422: unprocessableEntityResponse,
        500: internalServerErrorResponse,
      },
      summary: "List security audit logs (admin)",
      description: "Requires ADMIN session cookie.",
    },
  },
  {
    pathPrefix: "/admin",
  },
);

export type AdminContract = typeof adminContract;
