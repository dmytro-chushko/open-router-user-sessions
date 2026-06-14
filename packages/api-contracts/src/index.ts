import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { authContract } from "./auth.contract.js";
import { userContract } from "./user.contract.js";
import {
  badRequestResponse,
  internalServerErrorResponse,
} from "./common-responders.js";

const c = initContract();

const healthOkResponse = z.object({ ok: z.literal(true) });

const healthNotReadyResponse = z.object({
  ok: z.literal(false),
  error: z.string(),
});

export const appContract = c.router({
  health: {
    method: "GET",
    path: "/health",
    responses: {
      200: healthOkResponse,
    },
    summary: "Liveness — process is up (no database check)",
  },
  healthReady: {
    method: "GET",
    path: "/health/ready",
    responses: {
      200: healthOkResponse,
      503: healthNotReadyResponse,
    },
    summary: "Readiness — database is reachable",
  },
  hello: {
    method: "GET",
    path: "/hello",
    responses: {
      200: z.object({ message: z.string() }),
      400: badRequestResponse,
      500: internalServerErrorResponse,
    },
    summary: "Hello world",
  },
});

export const contract = c.router({
  common: appContract,
  auth: authContract,
  users: userContract,
});

export type AppContract = typeof contract;
export type AppRoutesContract = typeof appContract;

export { authContract } from "./auth.contract.js";
export type { AuthContract } from "./auth.contract.js";
export { userContract } from "./user.contract.js";
export type { UserContract } from "./user.contract.js";
export { passwordSchema } from "./schemas/password.js";
export {
  avatarContentTypeSchema,
  avatarUploadIntentSchema,
  AVATAR_MAX_BYTES,
  providerSchema,
  roleSchema,
  userMeSchema,
  userPublicSchema,
} from "./schemas/user.js";
export type { AvatarUploadIntent, UserMe, UserPublic } from "./schemas/user.js";
