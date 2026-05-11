import { NextRequest } from "next/server";
import { API_ROUTES } from "@/src/lib/api/routes";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";
import { proxyToUpstream } from "@/src/lib/server/proxy";
import { authorizeReviewMutation } from "@/src/lib/server/review-authorization";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviews.backendDetail(id)}${request.nextUrl.search}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Review detail gateway error", error);
    return Response.json(
      { message: "Failed to load review from backend gateway" },
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
    const authorization = await authorizeReviewMutation(id);

    if (!authorization.ok) {
      return Response.json(
        { message: authorization.error.message },
        { status: authorization.error.status }
      );
    }

    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviews.backendDetail(id)}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Review update gateway error", error);
    return Response.json(
      { message: "Failed to update review through backend gateway" },
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
    const authorization = await authorizeReviewMutation(id);

    if (!authorization.ok) {
      return Response.json(
        { message: authorization.error.message },
        { status: authorization.error.status }
      );
    }

    const targetUrl = `${getBackendApiBaseUrl()}${API_ROUTES.reviews.backendDetail(id)}`;
    return proxyToUpstream(request, targetUrl);
  } catch (error) {
    console.error("Review delete gateway error", error);
    return Response.json(
      { message: "Failed to delete review through backend gateway" },
      { status: 500 }
    );
  }
}
