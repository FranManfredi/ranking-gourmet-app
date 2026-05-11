import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ visitId: string }> }
) {
  try {
    const { visitId } = await context.params;
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviews.backendBase}/visit/${visitId}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Visit reviews gateway error", error);
    return Response.json(
      { message: "Failed to load visit reviews from backend gateway" },
      { status: 500 }
    );
  }
}
