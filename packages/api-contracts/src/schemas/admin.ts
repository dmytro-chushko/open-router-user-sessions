import { z } from "zod";

import { providerSchema, roleSchema } from "./user.js";

export const auditActionSchema = z.enum([
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT",
  "ADMIN_ACCESS_DENIED",
  "USER_ROLE_CHANGED",
  "USER_DELETED",
  "SESSIONS_REVOKED",
  "ACCOUNT_SELF_DELETED",
]);

export type AuditAction = z.infer<typeof auditActionSchema>;

export const adminStatsSchema = z.object({
  totalUsers: z.number().int().nonnegative(),
  newUsersLast7Days: z.number().int().nonnegative(),
  unverifiedUsers: z.number().int().nonnegative(),
  adminCount: z.number().int().nonnegative(),
  oauthOnlyUsers: z.number().int().nonnegative(),
  newUsersSince: z.string(),
  generatedAt: z.string(),
});

export type AdminStatsOverview = z.infer<typeof adminStatsSchema>;

export const adminUserListItemSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  role: roleSchema,
  emailVerifiedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  connectedProviders: z.array(providerSchema),
  hasPassword: z.boolean(),
});

export type AdminUserListItem = z.infer<typeof adminUserListItemSchema>;

export const adminUserListResultSchema = z.object({
  items: z.array(adminUserListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type AdminUserListResult = z.infer<typeof adminUserListResultSchema>;

export const adminUserSessionSummarySchema = z.object({
  id: z.string(),
  userAgent: z.string().nullable(),
  ipAddress: z.string().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export type AdminUserSessionSummary = z.infer<
  typeof adminUserSessionSummarySchema
>;

export const adminUserDetailSchema = adminUserListItemSchema.extend({
  updatedAt: z.coerce.date(),
  sessions: z.array(adminUserSessionSummarySchema),
});

export type AdminUserDetail = z.infer<typeof adminUserDetailSchema>;

export const adminUserIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type AdminUserIdParams = z.infer<typeof adminUserIdParamsSchema>;

export const adminUsersListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  role: roleSchema.optional(),
  verified: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  createdAfter: z.coerce.date().optional(),
  sortBy: z.enum(["createdAt", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type AdminUsersListQuery = z.infer<typeof adminUsersListQuerySchema>;

export const adminUpdateUserRoleBodySchema = z.object({
  role: roleSchema,
});

export type AdminUpdateUserRoleBody = z.infer<
  typeof adminUpdateUserRoleBodySchema
>;

export const auditLogUserSummarySchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
});

export type AuditLogUserSummary = z.infer<typeof auditLogUserSummarySchema>;

export const auditLogItemSchema = z.object({
  id: z.string(),
  action: auditActionSchema,
  actorId: z.string().nullable(),
  targetUserId: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  success: z.boolean(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.coerce.date(),
  actor: auditLogUserSummarySchema.nullable(),
  targetUser: auditLogUserSummarySchema.nullable(),
});

export type AuditLogItem = z.infer<typeof auditLogItemSchema>;

export const auditLogListResultSchema = z.object({
  items: z.array(auditLogItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type AuditLogListResult = z.infer<typeof auditLogListResultSchema>;

export const auditLogsListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  action: auditActionSchema.optional(),
  actorId: z.string().optional(),
  targetUserId: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type AuditLogsListQuery = z.infer<typeof auditLogsListQuerySchema>;
