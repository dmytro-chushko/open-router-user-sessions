import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  badRequestResponse,
  forbiddenResponse,
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from "./common-responders.js";
import {
  avatarContentTypeSchema,
  avatarUploadIntentSchema,
  AVATAR_MAX_BYTES,
  userMeSchema,
} from "./schemas/user.js";

const c = initContract();

export const userContract = c.router(
  {
    me: {
      method: "GET",
      path: "/me",
      responses: {
        200: userMeSchema,
        401: unauthorizedResponse,
        500: internalServerErrorResponse,
      },
      summary: "Current user profile",
      description: "Requires session cookie from login.",
    },

    updateMe: {
      method: "PATCH",
      path: "/me",
      body: z.object({
        name: z.string().min(1).max(120).optional(),
      }),
      responses: {
        200: userMeSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        422: unprocessableEntityResponse,
        500: internalServerErrorResponse,
      },
      summary: "Update current user profile",
    },

    avatarUploadIntent: {
      method: "POST",
      path: "/me/avatar/upload-intent",
      body: z.object({
        contentType: avatarContentTypeSchema,
        contentLength: z.number().int().positive().max(AVATAR_MAX_BYTES),
      }),
      responses: {
        200: avatarUploadIntentSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        422: unprocessableEntityResponse,
        500: internalServerErrorResponse,
      },
      summary: "Create signed upload URL for avatar",
    },

    avatarConfirm: {
      method: "POST",
      path: "/me/avatar/confirm",
      body: z.object({
        path: z.string().min(1),
      }),
      responses: {
        200: userMeSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        422: unprocessableEntityResponse,
        500: internalServerErrorResponse,
      },
      summary: "Confirm avatar upload and update profile",
    },

    avatarDelete: {
      method: "DELETE",
      path: "/me/avatar",
      body: z.object({}).strict(),
      responses: {
        200: userMeSchema,
        401: unauthorizedResponse,
        500: internalServerErrorResponse,
      },
      summary: "Remove avatar from profile",
    },
  },
  {
    pathPrefix: "/users",
  },
);

export type UserContract = typeof userContract;
