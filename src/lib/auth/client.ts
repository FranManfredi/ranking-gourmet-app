import { createAuthClient } from "better-auth/react";

const DEFAULT_AUTH_URL = "http://localhost:3000/api/auth";

const baseURL =
  process.env.NEXT_PUBLIC_AUTH_URL?.replace(/\/$/, "") ?? DEFAULT_AUTH_URL;

export const authClient = createAuthClient({
  baseURL,
});

export type AuthSession = (typeof authClient)["$Infer"]["Session"];
