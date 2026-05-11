import { API_ROUTES } from "@/src/lib/api/routes";

export interface ReviewerDTO {
  id: number;
  name: string;
  surname: string;
  userId: string;
}

export async function getAllReviewers(): Promise<ReviewerDTO[]> {
  const response = await fetch(API_ROUTES.reviewers.localBase, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error loading reviewers (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid reviewers response format");
  }

  return payload as ReviewerDTO[];
}
