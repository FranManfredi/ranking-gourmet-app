import { NextRequest } from "next/server";

const DEFAULT_BACKEND_API_URL = "http://localhost:3000";

function getBackendApiUrl() {
  return process.env.BACKEND_API_URL?.replace(/\/$/, "") ?? DEFAULT_BACKEND_API_URL;
}

export async function GET(request: NextRequest) {
  const targetUrl = `${getBackendApiUrl()}/api/restaurants/GetAllRestaurants${request.nextUrl.search}`;

  const upstreamResponse = await fetch(targetUrl, {
    method: "GET",
    headers: request.headers,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  upstreamResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "content-encoding") {
      responseHeaders.append(key, value);
    }
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
