import { API_ROUTES } from "@/src/lib/api/routes";
import { getServerSession, isAdminSession } from "@/src/lib/auth/server";
import { getBackendApiBaseUrl } from "@/src/lib/config/server";

interface ReviewerRecord {
  id: number;
  userId: string;
}

interface ReviewRecord {
  id: number;
  reviewerId: number;
}

interface AuthorizationError {
  message: string;
  status: number;
}

interface AuthorizationSuccess {
  isAdmin: boolean;
  reviewerId: number | null;
}

type AuthorizationResult =
  | { ok: true; value: AuthorizationSuccess }
  | { ok: false; error: AuthorizationError };

async function fetchBackendJson<T>(
  path: string,
  cookieHeader: string
): Promise<T | null> {
  const response = await fetch(`${getBackendApiBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

export async function authorizeReviewMutation(
  reviewId: string,
  cookieHeader: string
): Promise<AuthorizationResult> {
  const session = await getServerSession();

  if (!session?.user) {
    return {
      ok: false,
      error: { message: "Unauthorized", status: 401 },
    };
  }

  if (isAdminSession(session)) {
    return {
      ok: true,
      value: { isAdmin: true, reviewerId: null },
    };
  }

  const [review, reviewers] = await Promise.all([
    fetchBackendJson<ReviewRecord>(
      API_ROUTES.reviews.backendDetail(reviewId),
      cookieHeader
    ),
    fetchBackendJson<ReviewerRecord[]>(
      API_ROUTES.reviewers.backendBase,
      cookieHeader
    ),
  ]);

  if (!review) {
    return {
      ok: false,
      error: { message: "Review not found", status: 404 },
    };
  }

  const currentReviewer = reviewers?.find((reviewer) => reviewer.userId === session.user.id);

  if (!currentReviewer) {
    return {
      ok: false,
      error: { message: "Reviewer not found for current user", status: 403 },
    };
  }

  if (review.reviewerId !== currentReviewer.id) {
    return {
      ok: false,
      error: { message: "Forbidden", status: 403 },
    };
  }

  return {
    ok: true,
    value: { isAdmin: false, reviewerId: currentReviewer.id },
  };
}

export async function authorizeReviewCreation(
  reviewerId: number,
  cookieHeader: string
): Promise<AuthorizationResult> {
  const session = await getServerSession();

  if (!session?.user) {
    return {
      ok: false,
      error: { message: "Unauthorized", status: 401 },
    };
  }

  if (isAdminSession(session)) {
    return {
      ok: true,
      value: { isAdmin: true, reviewerId },
    };
  }

  const reviewers = await fetchBackendJson<ReviewerRecord[]>(
    API_ROUTES.reviewers.backendBase,
    cookieHeader
  );
  const currentReviewer = reviewers?.find((reviewer) => reviewer.userId === session.user.id);

  if (!currentReviewer) {
    return {
      ok: false,
      error: { message: "Reviewer not found for current user", status: 403 },
    };
  }

  if (currentReviewer.id !== reviewerId) {
    return {
      ok: false,
      error: { message: "Forbidden", status: 403 },
    };
  }

  return {
    ok: true,
    value: { isAdmin: false, reviewerId: currentReviewer.id },
  };
}
