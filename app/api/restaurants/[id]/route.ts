import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.restaurants.backendDetail(id)}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Restaurant detail gateway error", error);
    return Response.json(
      { message: "Failed to load restaurant from backend gateway" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.restaurants.backendDetail(id)}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Restaurant update gateway error", error);
    return Response.json(
      { message: "Failed to update restaurant through backend gateway" },
      { status: 500 }
    );
  }
}
