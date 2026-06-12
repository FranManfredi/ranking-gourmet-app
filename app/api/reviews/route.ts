import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";
import { authorizeReviewCreation } from "@/src/lib/server/review-authorization";

export async function GET(request: NextRequest) {
  try {
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviews.backendBase}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Reviews gateway error", error);
    return Response.json(
      { message: "Failed to load reviews from backend gateway" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.clone().json()) as { reviewerId?: number } | null;

    if (!payload || typeof payload.reviewerId !== "number") {
      return Response.json({ message: "Invalid review payload" }, { status: 400 });
    }

    const authorization = await authorizeReviewCreation(
      payload.reviewerId,
      request.headers.get("cookie") ?? ""
    );

    if (!authorization.ok) {
      return Response.json(
        { message: authorization.error.message },
        { status: authorization.error.status }
      );
    }

    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviews.backendBase}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Reviews create gateway error", error);
    return Response.json(
      { message: "Failed to create review through backend gateway" },
      { status: 500 }
    );
  }
}
