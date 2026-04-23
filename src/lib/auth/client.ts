"use client";

import { createAuthClient } from "better-auth/react";
import { getPublicAuthUrl } from "@/src/lib/config/public";

export const authClient = createAuthClient({
  baseURL: getPublicAuthUrl(),
});

export type AuthSession = (typeof authClient)["$Infer"]["Session"];
