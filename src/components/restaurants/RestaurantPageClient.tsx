"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantTopBar from "@/src/components/restaurants/RestaurantTopBar";
import {
  deleteRestaurant,
  getRestaurantById,
  SimpleRestaurantDTO,
} from "@/src/lib/restaurants/client";
import { getRestaurantAverageScore, getVisitAverageScore } from "@/src/lib/ratings";
import { getVisitsByRestaurantId, VisitWithDetailsDTO } from "@/src/lib/visits/client";
import SmallIconTextButton from "@/src/components/button/SmallIconTextButton";
import VisitFormModal from "@/src/components/modal/VisitFormModal";
import RestaurantFormModal from "@/src/components/modal/RestaurantFormModal";
import VisitRankingCard from "@/src/components/card/VisitRankingCard";

interface RestaurantPageClientProps {
  id: string;
}

function formatVisitDate(dateValue: string) {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsedDate);
}

export default function RestaurantPageClient({ id }: RestaurantPageClientProps) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<SimpleRestaurantDTO | null>(null);
  const [visits, setVisits] = useState<VisitWithDetailsDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [restaurantData, visitsData] = await Promise.all([
          getRestaurantById(id),
          getVisitsByRestaurantId(id),
        ]);
        setRestaurant(restaurantData);
        setVisits(visitsData);
      } catch (loadError) {
        console.error("Error loading restaurant", loadError);
        setError("No pudimos cargar el restaurante.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadRestaurant();
  }, [id]);

  const sortedVisits = useMemo(() => {
    return [...visits].sort((leftVisit, rightVisit) => {
      const leftDate = new Date(leftVisit.visitedAt).getTime();
      const rightDate = new Date(rightVisit.visitedAt).getTime();

      if (Number.isNaN(leftDate) || Number.isNaN(rightDate)) {
        return sortAsc
          ? leftVisit.visitedAt.localeCompare(rightVisit.visitedAt)
          : rightVisit.visitedAt.localeCompare(leftVisit.visitedAt);
      }

      return sortAsc ? leftDate - rightDate : rightDate - leftDate;
    });
  }, [sortAsc, visits]);

  const handleRestaurantSaved = (updatedRestaurant: SimpleRestaurantDTO) => {
    setRestaurant((currentRestaurant) => {
      if (!currentRestaurant) {
        return null;
      }

      return {
        ...currentRestaurant,
        ...updatedRestaurant,
      };
    });
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurant || isDeleting) {
      return;
    }

    const shouldDelete = window.confirm(
      `¿Eliminar el restaurante "${restaurant.name}"? Esta acción no se puede deshacer.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await deleteRestaurant(restaurant.id);
      router.push("/home");
    } catch (deleteError) {
      console.error("Error deleting restaurant", deleteError);
      setError("No pudimos eliminar el restaurante.");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <>
      <main className="min-h-screen bg-white">
        <RestaurantTopBar
          name={restaurant.name}
          address={restaurant.address}
          city={restaurant.city}
          score={getRestaurantAverageScore(visits)}
          backHref="/home"
        />

        <div className="flex w-full items-center justify-between px-2 py-3">
          <SmallIconTextButton
            label="AGREGAR VISITA"
            icon="/calendar.svg"
            onClick={() => setIsVisitModalOpen(true)}
            className="gap-1 bg-slate-100 px-2 outline-[#CFEEED]"
          />

          <SmallIconTextButton
            label={sortAsc ? "ANTIGUAS" : "RECIENTES"}
            icon="/sort.svg"
            onClick={() => setSortAsc((current) => !current)}
            className="bg-slate-100 px-3 outline-[#CFEEED]"
          />
        </div>

        {error && (
          <div className="px-4 pb-3">
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </p>
          </div>
        )}

        <div className="flex w-full flex-col items-center gap-3 px-2 pb-6">
          {sortedVisits.length === 0 && (
            <p className="w-full rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500 outline outline-1 outline-[#CFEEED]">
              Todavía no hay visitas cargadas para este restaurante.
            </p>
          )}

          {sortedVisits.map((visit, index) => (
            <VisitRankingCard
              key={visit.id}
              position={index + 1}
              date={formatVisitDate(visit.visitedAt)}
              score={getVisitAverageScore(visit.reviews)}
              onClick={() => router.push(`/visits/${visit.id}`)}
            />
          ))}

          <div className="inline-flex justify-start items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsRestaurantModalOpen(true)}
              className="inline-flex w-44 items-center justify-center gap-4 overflow-hidden rounded-2xl bg-[#F4FAFB] px-5 py-4 text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]"
            >
              <span className="relative h-4 w-4 overflow-hidden" aria-hidden="true">
                <svg
                  viewBox="0 0 16 16"
                  className="absolute left-0 top-0 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M11.813 1.72a1.75 1.75 0 0 1 2.474 2.474l-7.24 7.24a2 2 0 0 1-.848.5l-2.68.765a.75.75 0 0 1-.927-.927l.765-2.68a2 2 0 0 1 .5-.848l7.24-7.24Zm1.414 1.06a.25.25 0 0 0-.354 0l-1.02 1.02 1.414 1.414 1.02-1.02a.25.25 0 0 0 0-.354L13.227 2.78ZM12.207 6.273l-1.414-1.414-5.94 5.94a.5.5 0 0 0-.126.212l-.414 1.45 1.45-.414a.5.5 0 0 0 .212-.126l5.94-5.94Z"
                  />
                </svg>
              </span>
              <span className="w-24 text-center text-[10px] font-black tracking-wider">
                EDITAR RESTAURANTE
              </span>
            </button>

            <button
              type="button"
              onClick={() => void handleDeleteRestaurant()}
              disabled={isDeleting}
              className="inline-flex w-44 items-center justify-center gap-4 overflow-hidden rounded-2xl bg-[#FFDFDF] px-5 py-4 text-[#FF0000] outline outline-1 outline-offset-[-1px] outline-[#FF7171] disabled:opacity-60"
            >
              <span className="relative h-4 w-4 overflow-hidden" aria-hidden="true">
                <svg
                  viewBox="0 0 16 16"
                  className="absolute left-0 top-0 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M5.5 2.5A1.5 1.5 0 0 1 7 1h2a1.5 1.5 0 0 1 1.5 1.5V3H13a.75.75 0 0 1 0 1.5h-.563l-.61 8.138A2 2 0 0 1 9.833 14.5H6.167a2 2 0 0 1-1.994-1.862L3.563 4.5H3A.75.75 0 0 1 3 3h2.5v-.5ZM9 2.5h-2V3h2v-.5ZM5.677 12.526a.5.5 0 0 0 .49.474h3.666a.5.5 0 0 0 .49-.474L10.93 4.5H5.07l.607 8.026ZM6.75 6.25A.75.75 0 0 1 7.5 7v3a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75Zm2.5 0A.75.75 0 0 1 10 7v3a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75Z"
                  />
                </svg>
              </span>
              <span className="w-24 text-center text-[10px] font-black tracking-wider">
                {isDeleting ? "ELIMINANDO..." : "ELIMINAR RESTAURANTE"}
              </span>
            </button>
          </div>
        </div>
      </main>

      <VisitFormModal
        open={isVisitModalOpen}
        restaurantId={restaurant.id}
        onClose={() => setIsVisitModalOpen(false)}
      />

      <RestaurantFormModal
        open={isRestaurantModalOpen}
        restaurant={restaurant}
        onSaved={handleRestaurantSaved}
        onClose={() => setIsRestaurantModalOpen(false)}
      />
    </>
  );
}
