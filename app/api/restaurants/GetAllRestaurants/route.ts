import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";

export async function GET(request: NextRequest) {
  try {
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.restaurants.backendGetAll}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Restaurants gateway error", error);
    return Response.json(
      { message: "Failed to load restaurants from backend gateway" },
      { status: 500 }
    );
  }
}
