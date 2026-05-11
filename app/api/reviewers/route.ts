import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";

export async function GET(request: NextRequest) {
  try {
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviewers.backendBase}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Reviewers gateway error", error);
    return Response.json(
      { message: "Failed to load reviewers from backend gateway" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviewers.backendBase}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Reviewers create gateway error", error);
    return Response.json(
      { message: "Failed to create reviewer through backend gateway" },
      { status: 500 }
    );
  }
}
