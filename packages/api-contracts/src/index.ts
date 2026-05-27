import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { authContract } from "./auth.contract.js";
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
});

export type AppContract = typeof contract;
export type AppRoutesContract = typeof appContract;

export { authContract } from "./auth.contract.js";
export type { AuthContract } from "./auth.contract.js";
export { userPublicSchema, roleSchema } from "./schemas/user.js";
export type { UserPublic } from "./schemas/user.js";
