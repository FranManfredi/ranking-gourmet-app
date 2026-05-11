import { API_ROUTES } from "@/src/lib/api/routes";
import { ReviewDTO } from "@/src/lib/reviews/client";
import { SimpleRestaurantDTO } from "@/src/lib/restaurants/client";

export interface SimpleVisitDTO {
  id: number;
  visitedAt: string;
  restaurantId: number;
  createdAt?: string;
  updatedAt?: string;
  score?: number | null;
}

export interface VisitWithDetailsDTO extends SimpleVisitDTO {
  restaurant: SimpleRestaurantDTO;
  reviews: ReviewDTO[];
}

export interface CreateVisitDTO {
  restaurantId: number;
  visitedAt?: string;
}

export interface UpdateVisitDTO {
  visitedAt: string;
}

function normalizeVisitedAt(visitedAt?: string) {
  const normalizedValue = visitedAt?.trim();

  if (normalizedValue) {
    return new Date(`${normalizedValue}T00:00:00`).toISOString();
  }

  return new Date().toISOString();
}

export async function createVisit(payload: CreateVisitDTO): Promise<SimpleVisitDTO> {
  const response = await fetch(API_ROUTES.visits.localCreate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: payload.restaurantId,
      visitedAt: normalizeVisitedAt(payload.visitedAt),
    }),
  });

  if (!response.ok) {
    throw new Error(`Error creating visit (${response.status})`);
  }

  const createdVisit: unknown = await response.json();
  if (!createdVisit || typeof createdVisit !== "object") {
    throw new Error("Invalid visit creation response format");
  }

  return createdVisit as SimpleVisitDTO;
}

export async function getAllVisits(): Promise<VisitWithDetailsDTO[]> {
  const response = await fetch(API_ROUTES.visits.localBase, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error loading visits (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid visits response format");
  }

  return payload as VisitWithDetailsDTO[];
}

export async function getVisitById(id: string | number): Promise<VisitWithDetailsDTO> {
  const response = await fetch(API_ROUTES.visits.localDetail(id), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error loading visit (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid visit response format");
  }

  return payload as VisitWithDetailsDTO;
}

export async function getVisitsByRestaurantId(
  restaurantId: string | number
): Promise<VisitWithDetailsDTO[]> {
  const visits = await getAllVisits();
  return visits.filter((visit) => String(visit.restaurantId) === String(restaurantId));
}

export async function updateVisit(
  id: string | number,
  payload: UpdateVisitDTO
): Promise<SimpleVisitDTO> {
  const response = await fetch(API_ROUTES.visits.localDetail(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitedAt: normalizeVisitedAt(payload.visitedAt),
    }),
  });

  if (!response.ok) {
    throw new Error(`Error updating visit (${response.status})`);
  }

  const updatedVisit: unknown = await response.json();
  if (!updatedVisit || typeof updatedVisit !== "object") {
    throw new Error("Invalid visit update response format");
  }

  return updatedVisit as SimpleVisitDTO;
}

export async function deleteVisit(id: string | number): Promise<void> {
  const response = await fetch(API_ROUTES.visits.localDetail(id), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error deleting visit (${response.status})`);
  }
}
