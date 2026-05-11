import { API_ROUTES } from "@/src/lib/api/routes";

export interface SimpleRestaurantDTO {
  id: number;
  name: string;
  address: string;
  city: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  score?: number | null;
}

export type RestaurantListItemDTO = SimpleRestaurantDTO;

export interface CreateRestaurantDTO {
  name: string;
  address: string;
  city?: string;
  tags?: string[];
}

export interface UpdateRestaurantDTO {
  name?: string;
  address?: string;
  city?: string;
  tags?: string[];
}

export async function getAllRestaurants(): Promise<RestaurantListItemDTO[]> {
  const response = await fetch(API_ROUTES.restaurants.localGetAll, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error loading restaurants (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Invalid restaurants response format");
  }

  return payload as RestaurantListItemDTO[];
}

export async function createRestaurant(payload: CreateRestaurantDTO): Promise<SimpleRestaurantDTO> {
  const normalizedPayload: CreateRestaurantDTO = {
    name: payload.name.trim(),
    address: payload.address.trim(),
    city: payload.city?.trim() || "MAR DEL PLATA",
    tags: payload.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
  };

  const response = await fetch(API_ROUTES.restaurants.localCreate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedPayload),
  });

  if (!response.ok) {
    throw new Error(`Error creating restaurant (${response.status})`);
  }

  const createdRestaurant: unknown = await response.json();
  if (!createdRestaurant || typeof createdRestaurant !== "object") {
    throw new Error("Invalid restaurant creation response format");
  }

  return createdRestaurant as SimpleRestaurantDTO;
}

export async function getRestaurantById(id: string | number): Promise<SimpleRestaurantDTO> {
  const response = await fetch(API_ROUTES.restaurants.localDetail(id), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error loading restaurant (${response.status})`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid restaurant response format");
  }

  return payload as SimpleRestaurantDTO;
}

export async function updateRestaurant(
  id: string | number,
  payload: UpdateRestaurantDTO
): Promise<SimpleRestaurantDTO> {
  const normalizedPayload: UpdateRestaurantDTO = {
    ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
    ...(payload.address !== undefined ? { address: payload.address.trim() } : {}),
    ...(payload.city !== undefined ? { city: payload.city.trim() } : {}),
    ...(payload.tags !== undefined
      ? { tags: payload.tags.map((tag) => tag.trim()).filter(Boolean) }
      : {}),
  };

  const response = await fetch(API_ROUTES.restaurants.localDetail(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedPayload),
  });

  if (!response.ok) {
    throw new Error(`Error updating restaurant (${response.status})`);
  }

  const updatedRestaurant: unknown = await response.json();
  if (!updatedRestaurant || typeof updatedRestaurant !== "object") {
    throw new Error("Invalid restaurant update response format");
  }

  return updatedRestaurant as SimpleRestaurantDTO;
}

export async function deleteRestaurant(id: string | number): Promise<void> {
  const response = await fetch(API_ROUTES.restaurants.localDetail(id), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Error deleting restaurant (${response.status})`);
  }
}
