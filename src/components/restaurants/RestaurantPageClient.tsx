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
import { Pencil, Trash2 } from "lucide-react";

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
              <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
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
              <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
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
