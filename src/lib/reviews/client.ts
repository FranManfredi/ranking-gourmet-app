import { API_ROUTES } from "@/src/lib/api/routes";

export interface ReviewDTO {
  id: number;
  reviewerId: number;
  visitId: number;
  foodRating: number;
  beverageRating: number;
  serviceRating: number;
  valueRating: number;
  ambianceRating: number;
  createdAt: string;
}

export interface CreateReviewDTO {
  reviewerId: number;
  visitId: number;
  foodRating: number;
  beverageRating: number;
  serviceRating: number;
  valueRating: number;
  ambianceRating: number;
}

export interface UpdateReviewDTO {
  foodRating: number;
  beverageRating: number;
  serviceRating: number;
  valueRating: number;
  ambianceRating: number;
}

export async function getAllReviews(): Promise<ReviewDTO[]> {
  const response = await fetch(API_ROUTES.reviews.localBase, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error loading reviews (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid reviews response format");
  }

  return payload as ReviewDTO[];
}

export async function getReviewsByVisitId(visitId: string | number): Promise<ReviewDTO[]> {
  const response = await fetch(`${API_ROUTES.reviews.localBase}/visit/${visitId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error loading visit reviews (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid visit reviews response format");
  }

  return payload as ReviewDTO[];
}

export async function createReview(payload: CreateReviewDTO): Promise<ReviewDTO> {
  const response = await fetch(API_ROUTES.reviews.localBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error creating review (${response.status})`);
  }

  const createdReview: unknown = await response.json();
  if (!createdReview || typeof createdReview !== "object") {
    throw new Error("Invalid review creation response format");
  }

  return createdReview as ReviewDTO;
}

export async function updateReview(
  id: string | number,
  payload: UpdateReviewDTO
): Promise<ReviewDTO> {
  const response = await fetch(API_ROUTES.reviews.localDetail(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error updating review (${response.status})`);
  }

  const updatedReview: unknown = await response.json();
  if (!updatedReview || typeof updatedReview !== "object") {
    throw new Error("Invalid review update response format");
  }

  return updatedReview as ReviewDTO;
}

export async function deleteReview(id: string | number): Promise<void> {
  const response = await fetch(API_ROUTES.reviews.localDetail(id), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error deleting review (${response.status})`);
  }
}
