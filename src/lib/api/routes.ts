export const API_ROUTES = {
  auth: {
    localBase: "/api/auth",
  },
  restaurants: {
    localGetAll: "/api/restaurants/GetAllRestaurants",
    backendGetAll: "/api/restaurants/GetAllRestaurants",
  },
} as const;
