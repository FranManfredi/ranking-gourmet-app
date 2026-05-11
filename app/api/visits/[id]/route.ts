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
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.visits.backendDetail(id)}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Visit detail gateway error", error);
    return Response.json(
      { message: "Failed to load visit from backend gateway" },
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
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.visits.backendDetail(id)}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Visit update gateway error", error);
    return Response.json(
      { message: "Failed to update visit through backend gateway" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.visits.backendDetail(id)}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Visit delete gateway error", error);
    return Response.json(
      { message: "Failed to delete visit through backend gateway" },
      { status: 500 }
    );
  }
}
