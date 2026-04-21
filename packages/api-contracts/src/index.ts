import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
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
    },
    summary: "Hello world",
  },
});

export type AppContract = typeof contract;
