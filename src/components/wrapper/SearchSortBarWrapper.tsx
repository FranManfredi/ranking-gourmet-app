"use client";

import { useEffect, useMemo, useState } from "react";
import SearchSortBar from "@/src/components/search/SearchSortBar";
import RestaurantRankingCard from "@/src/components/card/RestaurantRankingCard";
import { getAllRestaurants, RestaurantListItemDTO } from "@/src/lib/restaurants/client";
import { getRestaurantAverageScore } from "@/src/lib/ratings";
import { getAllVisits, VisitWithDetailsDTO } from "@/src/lib/visits/client";
import { useRouter } from "next/navigation";
import {
    DEFAULT_SORT_MODE,
    getSortOption,
    getStoredDefaultSortMode,
    isSortMode,
    SORT_OPTIONS,
    SORT_PREFERENCE_CHANGED_EVENT,
    SORT_PREFERENCE_STORAGE_KEY,
    SortMode,
} from "@/src/lib/sort-preferences";

export default function SearchSortBarWrapper() {
    const [restaurants, setRestaurants] = useState<RestaurantListItemDTO[]>([]);
    const [visits, setVisits] = useState<VisitWithDetailsDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>(DEFAULT_SORT_MODE);
    const router = useRouter();

    useEffect(() => {
        setSortMode(getStoredDefaultSortMode());

        const handlePreferenceChange = (event: Event) => {
            const sortPreference = (event as CustomEvent<string>).detail;
            if (isSortMode(sortPreference)) {
                setSortMode(sortPreference);
            }
        };

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === SORT_PREFERENCE_STORAGE_KEY && event.newValue && isSortMode(event.newValue)) {
                setSortMode(event.newValue);
            }
        };

        window.addEventListener(SORT_PREFERENCE_CHANGED_EVENT, handlePreferenceChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener(SORT_PREFERENCE_CHANGED_EVENT, handlePreferenceChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [restaurantsData, visitsData] = await Promise.all([
                    getAllRestaurants(),
                    getAllVisits(),
                ]);
                setRestaurants(restaurantsData);
                setVisits(visitsData);
            } catch (loadError) {
                console.error("Error loading restaurants", loadError);
                setError("No pudimos cargar los restaurantes.");
            } finally {
                setIsLoading(false);
            }
        };

        void loadRestaurants();
    }, []);

    const restaurantMetrics = useMemo(() => {
        return new Map(
            restaurants.map((restaurant) => {
                const restaurantVisits = visits.filter((visit) => visit.restaurantId === restaurant.id);
                const score = getRestaurantAverageScore(restaurantVisits);
                const latestVisitTimestamp = restaurantVisits.reduce<number | null>((latest, visit) => {
                    const timestamp = new Date(visit.visitedAt).getTime();
                    if (Number.isNaN(timestamp)) {
                        return latest;
                    }

                    if (latest === null || timestamp > latest) {
                        return timestamp;
                    }

                    return latest;
                }, null);

                return [
                    restaurant.id,
                    {
                        score,
                        latestVisitTimestamp,
                        latestVisitLabel: latestVisitTimestamp
                            ? new Date(latestVisitTimestamp).toLocaleDateString("es-AR")
                            : new Date(restaurant.updatedAt).toLocaleDateString("es-AR"),
                    },
                ];
            })
        );
    }, [restaurants, visits]);

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
            const leftMetrics = restaurantMetrics.get(a.id);
            const rightMetrics = restaurantMetrics.get(b.id);

            if (sortMode === "name-asc" || sortMode === "name-desc") {
                const left = a.name.toLowerCase();
                const right = b.name.toLowerCase();
                if (left === right) {
                    return 0;
                }

                const compareValue = left < right ? -1 : 1;
                return sortMode === "name-asc" ? compareValue : -compareValue;
            }

            if (sortMode === "visit-recent" || sortMode === "visit-oldest") {
                const leftVisit = leftMetrics?.latestVisitTimestamp ?? Number.NEGATIVE_INFINITY;
                const rightVisit = rightMetrics?.latestVisitTimestamp ?? Number.NEGATIVE_INFINITY;

                if (leftVisit === rightVisit) {
                    return a.name.localeCompare(b.name, "es");
                }

                return sortMode === "visit-recent"
                    ? rightVisit - leftVisit
                    : leftVisit - rightVisit;
            }

            const leftScore = leftMetrics?.score ?? Number.NEGATIVE_INFINITY;
            const rightScore = rightMetrics?.score ?? Number.NEGATIVE_INFINITY;

            if (leftScore === rightScore) {
                return a.name.localeCompare(b.name, "es");
            }

            return sortMode === "score-desc"
                ? rightScore - leftScore
                : leftScore - rightScore;
        });
    }, [restaurantMetrics, restaurants, searchTerm, sortMode]);

    return (
        <div className="w-full">
            <div className="sticky top-0 z-50 w-full bg-white py-3">
                <SearchSortBar
                    value={searchTerm}
                    placeholder="Buscar restaurante"
                    searchIcon="/search.svg"
                    sortIcon="/sort.svg"
                    sortLabel={getSortOption(sortMode).shortLabel}
                    sortValue={sortMode}
                    sortOptions={SORT_OPTIONS}
                    onSearchChange={setSearchTerm}
                    onSortChange={setSortMode}
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
                            date={restaurantMetrics.get(restaurant.id)?.latestVisitLabel
                                ?? new Date(restaurant.updatedAt).toLocaleDateString("es-AR")}
                            score={restaurantMetrics.get(restaurant.id)?.score ?? null}
                            tags={restaurant.tags}
                        />
                    ))}
            </div>
        </div>
    );
}
