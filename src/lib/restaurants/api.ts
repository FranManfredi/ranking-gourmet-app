export interface SimpleVisitDTO {
  id: number;
  visitedAt: string;
  restaurantId: number;
}

export interface SimpleRestaurantDTO {
  id: number;
  name: string;
  address: string;
  city: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantWithVisitsDTO extends SimpleRestaurantDTO {
  visits: SimpleVisitDTO[];
}

export type RestaurantListItemDTO = RestaurantWithVisitsDTO | SimpleRestaurantDTO;

export async function getAllRestaurants(): Promise<RestaurantListItemDTO[]> {
  const response = await fetch("/api/restaurants/GetAllRestaurants", {
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
