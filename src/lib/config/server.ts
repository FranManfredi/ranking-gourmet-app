const DEFAULT_BACKEND_API_URL = "http://localhost:3000";

export function getBackendApiBaseUrl() {
  return process.env.BACKEND_API_URL?.replace(/\/$/, "") ?? DEFAULT_BACKEND_API_URL;
}
