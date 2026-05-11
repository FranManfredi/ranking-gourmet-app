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
  visits: {
    localBase: "/api/visits",
    backendBase: "/api/visits",
    localCreate: "/api/visits",
    backendCreate: "/api/visits",
    localDetail: (id: string | number) => `/api/visits/${id}`,
    backendDetail: (id: string | number) => `/api/visits/${id}`,
    localByRestaurant: (id: string | number) => `/api/visits/restaurant/${id}`,
    backendByRestaurant: (id: string | number) => `/api/visits/restaurant/${id}`,
  },
  reviews: {
    localBase: "/api/reviews",
    backendBase: "/api/reviews",
    localDetail: (id: string | number) => `/api/reviews/${id}`,
    backendDetail: (id: string | number) => `/api/reviews/${id}`,
  },
  reviewers: {
    localBase: "/api/reviewers",
    backendBase: "/api/reviewers",
    localDetail: (id: string | number) => `/api/reviewers/${id}`,
    backendDetail: (id: string | number) => `/api/reviewers/${id}`,
  },
} as const;
