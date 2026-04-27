export const API_ROUTES = {
  auth: {
    localBase: "/api/auth",
  },
  restaurants: {
    localCreate: "/api/restaurants",
    backendCreate: "/api/restaurants",
    localDetail: (id: string | number) => `/api/restaurants/${id}`,
    backendDetail: (id: string | number) => `/api/restaurants/${id}`,
    localGetAll: "/api/restaurants/GetAllRestaurants",
    backendGetAll: "/api/restaurants/GetAllRestaurants",
  },
} as const;
