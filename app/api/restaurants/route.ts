import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";

export async function POST(request: NextRequest) {
  try {
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.restaurants.backendCreate}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Restaurants create gateway error", error);
    return Response.json(
      { message: "Failed to create restaurant through backend gateway" },
      { status: 500 }
    );
  }
}
