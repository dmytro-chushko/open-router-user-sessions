import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  badRequestResponse,
  conflictResponse,
  forbiddenResponse,
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from "./common-responders.js";
import { userPublicSchema } from "./schemas/user.js";

const c = initContract();

const emailBodySchema = z.object({
  email: z.string().email(),
});

const passwordSchema = z.string().min(8).max(128);

export const authContract = c.router(
  {
    register: {
      method: "POST",
      path: "/register",
      body: z.object({
        email: z.string().email(),
        password: passwordSchema,
        name: z.string().min(1).max(120).optional(),
      }),
      responses: {
        201: userPublicSchema,
        400: badRequestResponse,
        409: conflictResponse,
        422: unprocessableEntityResponse,
        500: internalServerErrorResponse,
      },
      summary: "Register with email and password",
    },

    login: {
      method: "POST",
      path: "/login",
      body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
      responses: {
        200: z.object({ user: userPublicSchema }),
        400: badRequestResponse,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        500: internalServerErrorResponse,
      },
      summary: "Login (sets session cookie)",
      description:
        "Response body: { user }. Session cookie is set via Set-Cookie (not in JSON). " +
        "Requires verified email (403 otherwise).",
    },

    logout: {
      method: "POST",
      path: "/logout",
      body: z.object({}).strict(),
      responses: {
        204: z.void(),
        401: unauthorizedResponse,
        500: internalServerErrorResponse,
      },
      summary: "Logout",
      description: "Clears session cookie. Requires active session.",
    },

    verifyEmail: {
      method: "POST",
      path: "/verify-email",
      body: z.object({
        token: z.string().min(1),
      }),
      responses: {
        200: z.object({ ok: z.literal(true) }),
        400: badRequestResponse,
        500: internalServerErrorResponse,
      },
      summary: "Confirm email with token from mail",
    },

    resendVerification: {
      method: "POST",
      path: "/resend-verification",
      body: emailBodySchema,
      responses: {
        200: z.object({ ok: z.literal(true) }),
        400: badRequestResponse,
        429: z.object({
          status: z.literal(429),
          error: z.string(),
        }),
        500: internalServerErrorResponse,
      },
      summary: "Resend verification email",
    },

    forgotPassword: {
      method: "POST",
      path: "/forgot-password",
      body: emailBodySchema,
      responses: {
        200: z.object({ ok: z.literal(true) }),
        400: badRequestResponse,
        500: internalServerErrorResponse,
      },
      summary: "Request password reset (always 200 if email format valid)",
    },

    resetPassword: {
      method: "POST",
      path: "/reset-password",
      body: z.object({
        token: z.string().min(1),
        newPassword: passwordSchema,
      }),
      responses: {
        200: z.object({ ok: z.literal(true) }),
        400: badRequestResponse,
        500: internalServerErrorResponse,
      },
      summary: "Set new password with token from mail",
    },

    resendPasswordReset: {
      method: "POST",
      path: "/resend-password-reset",
      body: emailBodySchema,
      responses: {
        200: z.object({ ok: z.literal(true) }),
        400: badRequestResponse,
        429: z.object({
          status: z.literal(429),
          error: z.string(),
        }),
        500: internalServerErrorResponse,
      },
      summary: "Resend password reset email",
    },
  },
  {
    pathPrefix: "/auth",
  },
);

export type AuthContract = typeof authContract;
