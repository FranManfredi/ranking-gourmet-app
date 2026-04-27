import { API_ROUTES } from "@/src/lib/api/routes";
import {headers} from "next/headers";

interface ServerSessionUser {
  id: string;
  email: string;
  name?: string;
}

export interface ServerSession {
  user: ServerSessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
}

interface SessionPayloadWrapper {
  data?: ServerSession | null;
  error?: unknown;
}

function isServerSession(value: unknown): value is ServerSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeSession = value as Partial<ServerSession>;
  return Boolean(
    maybeSession.user &&
      typeof maybeSession.user === "object" &&
      maybeSession.session &&
      typeof maybeSession.session === "object"
  );
}

function normalizeServerSession(payload: unknown): ServerSession | null {
  if (isServerSession(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const wrapped = payload as SessionPayloadWrapper;
  if (isServerSession(wrapped.data)) {
    return wrapped.data;
  }

  return null;
}

export async function getServerSession(): Promise<ServerSession | null> {
  const requestHeaders = await headers();
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host");

  if (!host) {
    return null;
  }

  const origin = `${forwardedProto ?? "http"}://${host}`;
  const sessionUrl = `${origin}${API_ROUTES.auth.localBase}/get-session`;

  const sessionResponse = await fetch(sessionUrl, {
    method: "GET",
    headers: {
      cookie: requestHeaders.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (!sessionResponse.ok) {
    return null;
  }

  const payload = (await sessionResponse.json()) as unknown;
  return normalizeServerSession(payload);
}
