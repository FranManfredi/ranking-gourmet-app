"use client";

import { useEffect, useMemo, useState } from "react";
import SearchSortBar from "@/src/components/search/SearchSortBar";
import RestaurantRankingCard from "@/src/components/card/RestaurantRankingCard";
import { getAllRestaurants, RestaurantListItemDTO } from "@/src/lib/restaurants/client";
import { useRouter } from "next/navigation";

export default function SearchSortBarWrapper() {
    const [restaurants, setRestaurants] = useState<RestaurantListItemDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getAllRestaurants();
                setRestaurants(data);
            } catch (loadError) {
                console.error("Error loading restaurants", loadError);
                setError("No pudimos cargar los restaurantes.");
            } finally {
                setIsLoading(false);
            }
        };

        void loadRestaurants();
    }, []);

    const filteredRestaurants = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const bySearch = normalizedSearch.length
            ? restaurants.filter((restaurant) => {
                const haystack = [
                    restaurant.name,
                    restaurant.address,
                    restaurant.city,
                    ...restaurant.tags,
                ]
                    .join(" ")
                    .toLowerCase();
                return haystack.includes(normalizedSearch);
            })
            : restaurants;

        return [...bySearch].sort((a, b) => {
            const left = a.name.toLowerCase();
            const right = b.name.toLowerCase();
            if (left === right) {
                return 0;
            }
            const compareValue = left < right ? -1 : 1;
            return sortAsc ? compareValue : -compareValue;
        });
    }, [restaurants, searchTerm, sortAsc]);

    return (
        <div className="w-full">
            <div className="sticky top-0 z-50 w-full bg-white py-3">
                <SearchSortBar
                    value={searchTerm}
                    placeholder="Buscar restaurante"
                    searchIcon="/search.svg"
                    sortIcon="/sort.svg"
                    sortLabel={sortAsc ? "A-Z" : "Z-A"}
                    onChange={setSearchTerm}
                    onSortClick={() => setSortAsc((current) => !current)}
                />
            </div>

            <div className="flex w-full flex-col items-center gap-3 pb-6">
                {isLoading && (
                    <p className="text-sm font-semibold text-[#07BAB5]">Cargando restaurantes...</p>
                )}

                {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

                {!isLoading && !error && filteredRestaurants.length === 0 && (
                    <p className="text-sm font-semibold text-slate-500">No hay restaurantes para mostrar.</p>
                )}

                {!isLoading &&
                    !error &&
                    filteredRestaurants.map((restaurant, index) => (
                        <RestaurantRankingCard
                            onClick={() => router.push(`/restaurants/${restaurant.id}`)}
                            key={restaurant.id}
                            position={index + 1}
                            name={restaurant.name}
                            address={restaurant.address}
                            city={restaurant.city}
                            date={new Date(restaurant.updatedAt).toLocaleDateString("es-AR")}
                            score={null}
                            tags={restaurant.tags}
                        />
                    ))}
            </div>
        </div>
    );
}
