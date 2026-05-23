import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { authContract } from "./auth.contract.js";
import {
  badRequestResponse,
  internalServerErrorResponse,
} from "./common-responders.js";

const c = initContract();

export const appContract = c.router({
  health: {
    method: "GET",
    path: "/health",
    responses: {
      200: z.object({ ok: z.literal(true) }),
    },
    summary: "Health check",
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
  ...appContract,
  ...authContract,
});

export type AppContract = typeof contract;
export type AppRoutesContract = typeof appContract;

export { authContract } from "./auth.contract.js";
export type { AuthContract } from "./auth.contract.js";
export { userPublicSchema, roleSchema } from "./schemas/user.js";
export type { UserPublic } from "./schemas/user.js";
