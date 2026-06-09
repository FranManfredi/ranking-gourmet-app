import { NextRequest } from "next/server";
import {
  getBackendApiBaseUrl,
  getBackendAuthBaseUrl,
} from "@/src/lib/config/server";

function getRequestOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");

  if (!host) {
    return "http://localhost:3001";
  }

  return `${forwardedProto ?? "http"}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      surname?: string;
      email?: string;
      password?: string;
    };

    const name = payload.name?.trim() ?? "";
    const surname = payload.surname?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const password = payload.password ?? "";

    if (!name || !surname || !email || !password) {
      return Response.json(
        { message: "Faltan datos obligatorios para crear el evaluador." },
        { status: 400 }
      );
    }

    const cookieHeader = request.headers.get("cookie") ?? "";
    const origin = getRequestOrigin(request);

    const signUpResponse = await fetch(`${getBackendAuthBaseUrl()}/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
        origin,
        referer: `${origin}/home`,
      },
      body: JSON.stringify({
        name: `${name} ${surname}`.trim(),
        email,
        password,
      }),
      cache: "no-store",
    });

    const signUpPayload = (await signUpResponse.json().catch(() => null)) as
      | {
          user?: {
            id?: string;
          };
          message?: string;
          error?: string;
        }
      | null;

    if (!signUpResponse.ok || !signUpPayload?.user?.id) {
      return Response.json(
        {
          message:
            signUpPayload?.message ??
            signUpPayload?.error ??
            "No pudimos crear el usuario del evaluador.",
        },
        { status: signUpResponse.status || 500 }
      );
    }

    const reviewerResponse = await fetch(`${getBackendApiBaseUrl()}/api/reviewers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        name,
        surname,
        userId: signUpPayload.user.id,
      }),
      cache: "no-store",
    });

    const reviewerPayload = await reviewerResponse.json().catch(() => null);

    if (!reviewerResponse.ok) {
      return Response.json(
        {
          message:
            (reviewerPayload as { message?: string; error?: string } | null)?.message ??
            (reviewerPayload as { message?: string; error?: string } | null)?.error ??
            "No pudimos crear el evaluador.",
        },
        { status: reviewerResponse.status || 500 }
      );
    }

    return Response.json(reviewerPayload, { status: 201 });
  } catch (error) {
    console.error("Evaluator create gateway error", error);
    return Response.json(
      { message: "Failed to create evaluator through backend gateway" },
      { status: 500 }
    );
  }
}
