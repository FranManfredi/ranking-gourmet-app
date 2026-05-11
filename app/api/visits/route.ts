import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";

export async function GET(request: NextRequest) {
  try {
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.visits.backendBase}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Visits gateway error", error);
    return Response.json(
      { message: "Failed to load visits from backend gateway" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.visits.backendCreate}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Visits create gateway error", error);
    return Response.json(
      { message: "Failed to create visit through backend gateway" },
      { status: 500 }
    );
  }
}
