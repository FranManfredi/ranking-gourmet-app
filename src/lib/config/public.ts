import { API_ROUTES } from "@/src/lib/api/routes";

const DEFAULT_PUBLIC_AUTH_PATH = API_ROUTES.auth.localBase;
const DEFAULT_PUBLIC_APP_URL = "http://localhost:3000";

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function getPublicAppOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const explicitAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (explicitAppUrl) {
    return stripTrailingSlash(explicitAppUrl);
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return DEFAULT_PUBLIC_APP_URL;
}

export function getPublicAuthUrl() {
  const configuredAuthUrl = stripTrailingSlash(
    process.env.NEXT_PUBLIC_AUTH_URL ?? DEFAULT_PUBLIC_AUTH_PATH
  );

  if (isAbsoluteHttpUrl(configuredAuthUrl)) {
    return configuredAuthUrl;
  }

  if (configuredAuthUrl.startsWith("/")) {
    return `${getPublicAppOrigin()}${configuredAuthUrl}`;
  }

  return `${getPublicAppOrigin()}/${configuredAuthUrl}`;
}
