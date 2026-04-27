"use client";

import { use, useEffect, useState } from "react";
import RestaurantTopBar from "@/src/components/restaurants/RestaurantTopBar";
import {
  getRestaurantById,
  SimpleRestaurantDTO,
} from "@/src/lib/restaurants/client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RestaurantPage({ params }: PageProps) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState<SimpleRestaurantDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (loadError) {
        console.error("Error loading restaurant", loadError);
        setError("No pudimos cargar el restaurante.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadRestaurant();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-4 py-6">
        <p className="text-sm font-semibold text-[#07BAB5]">Cargando restaurante...</p>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-white px-4 py-6">
        <p className="text-sm font-semibold text-red-500">
          {error ?? "No encontramos el restaurante."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <RestaurantTopBar
        name={restaurant.name}
        address={restaurant.address}
        city={restaurant.city}
        score={restaurant.score}
      />
    </main>
  );
}
