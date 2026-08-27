"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import RestaurantTopBar from "@/src/components/restaurants/RestaurantTopBar";
import ReviewerCard, { ReviewerCardSection } from "@/src/components/card/ReviewerCard";
import SmallIconTextButton from "@/src/components/button/SmallIconTextButton";
import VisitFormModal from "@/src/components/modal/VisitFormModal";
import { getVisitAverageScore } from "@/src/lib/ratings";
import { ReviewerDTO, getAllReviewers } from "@/src/lib/reviewers/client";
import { deleteReview, ReviewDTO } from "@/src/lib/reviews/client";
import { deleteVisit, getVisitById, SimpleVisitDTO, VisitWithDetailsDTO } from "@/src/lib/visits/client";

interface VisitPageClientProps {
  id: string;
  currentUserId: string;
}

interface VisitReviewCardData {
  id: number;
  reviewerId: number;
  reviewerName: string;
  reviewerSurname: string;
  score: number;
  sections: ReviewerCardSection[];
  isCurrentUser: boolean;
}

const REVIEW_SECTION_CONFIG = [
  { key: "foodRating", title: "COMIDA", subtitle: "SABOR Y PRESENTACION" },
  { key: "beverageRating", title: "BEBIDAS", subtitle: "CARTA Y COCTELERIA" },
  { key: "serviceRating", title: "SERVICIO", subtitle: "ATENCION Y RAPIDEZ" },
  { key: "valueRating", title: "VALOR PERCIBIBO", subtitle: "RELACION PRECIO/CALIDAD" },
  { key: "ambianceRating", title: "AMBIENTE", subtitle: "CLIMA Y DECORACION" },
] as const;

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

function getReviewerInitials(name: string, surname: string) {
  return `${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase() || "??";
}

function averageScore(review: ReviewDTO) {
  const scores = [
    review.foodRating,
    review.beverageRating,
    review.serviceRating,
    review.valueRating,
    review.ambianceRating,
  ];

  return scores.reduce((total, value) => total + value, 0) / scores.length;
}

function buildReviewSections(review: ReviewDTO): ReviewerCardSection[] {
  return REVIEW_SECTION_CONFIG.map((section) => ({
    id: section.key,
    title: section.title,
    subtitle: section.subtitle,
    score: review[section.key],
  }));
}

function buildVisitReviewCards(
  reviews: ReviewDTO[],
  reviewers: ReviewerDTO[],
  currentUserId: string
): VisitReviewCardData[] {
  return reviews.map((review) => {
    const reviewer = reviewers.find((item) => item.id === review.reviewerId);

    return {
      id: review.id,
      reviewerId: review.reviewerId,
      reviewerName: reviewer?.name?.toUpperCase() ?? "REVIEWER",
      reviewerSurname: reviewer?.surname?.toUpperCase() ?? `${review.reviewerId}`,
      score: averageScore(review),
      sections: buildReviewSections(review),
      isCurrentUser: reviewer?.userId === currentUserId,
    };
  });
}

export default function VisitPageClient({ id, currentUserId }: VisitPageClientProps) {
  const router = useRouter();
  const [visit, setVisit] = useState<VisitWithDetailsDTO | null>(null);
  const [reviews, setReviews] = useState<VisitReviewCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openReviewIds, setOpenReviewIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);

  useEffect(() => {
    const loadVisit = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const visitData = await getVisitById(id);
        const reviewersData = await getAllReviewers();

        setVisit(visitData);
        setReviews(buildVisitReviewCards(visitData.reviews, reviewersData, currentUserId));
      } catch (loadError) {
        console.error("Error loading visit", loadError);
        setError("No pudimos cargar la visita.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadVisit();
  }, [currentUserId, id]);

  const myReview = useMemo(
    () => reviews.find((review) => review.isCurrentUser) ?? null,
    [reviews]
  );

  const toggleReview = (reviewId: number) => {
    setOpenReviewIds((currentOpenReviewIds) =>
      currentOpenReviewIds.includes(reviewId)
        ? currentOpenReviewIds.filter((currentId) => currentId !== reviewId)
        : [...currentOpenReviewIds, reviewId]
    );
  };

  const handleDeleteVisit = async () => {
    if (!visit || isDeleting) {
      return;
    }

    const shouldDelete = window.confirm(
      `¿Eliminar la visita del ${formatVisitDate(visit.visitedAt)} en "${visit.restaurant.name}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await Promise.all(visit.reviews.map((review) => deleteReview(review.id)));
      await deleteVisit(visit.id);
      router.push(`/restaurants/${visit.restaurant.id}`);
    } catch (deleteError) {
      console.error("Error deleting visit", deleteError);
      setError("No pudimos eliminar la visita.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisitSaved = (updatedVisit: SimpleVisitDTO) => {
    setVisit((currentVisit) =>
      currentVisit
        ? {
            ...currentVisit,
            ...updatedVisit,
          }
        : null
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-4 py-6">
        <p className="text-sm font-semibold text-[#07BAB5]">Cargando visita...</p>
      </main>
    );
  }

  if (!visit) {
    return (
      <main className="min-h-screen bg-white px-4 py-6">
        <p className="text-sm font-semibold text-red-500">
          {error ?? "No encontramos la visita."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-10">
      <RestaurantTopBar
        name={visit.restaurant.name}
        address={visit.restaurant.address}
        city={visit.restaurant.city}
        score={getVisitAverageScore(visit.reviews)}
        backHref={`/restaurants/${visit.restaurant.id}`}
      />

      <div className="flex flex-col items-center justify-center gap-4 pt-4">
        <div className="inline-flex w-96 items-center justify-between px-2">
          <SmallIconTextButton
            label="ORDEN"
            icon="/sort.svg"
            onClick={() => console.log("orden reviews")}
            className="bg-slate-100 px-3 outline-[#CFEEED]"
          />

          <div className="inline-flex h-8 items-center justify-start gap-2.5 rounded-xl bg-white pl-4 pr-2 shadow-[inset_0px_4px_6.6px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#07BAB5]" aria-hidden="true" />
            <div className="w-20 text-center text-xs font-black text-black">
              {formatVisitDate(visit.visitedAt)}
            </div>
          </div>
        </div>

        {error && (
          <div className="w-96 px-2">
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </p>
          </div>
        )}

        <div className="flex w-96 flex-col items-start justify-start gap-2.5">
          {!myReview && (
            <button
              type="button"
              onClick={() => router.push(`/visits/${visit.id}/review`)}
              className="inline-flex h-11 w-96 items-center justify-start gap-4 overflow-hidden rounded-2xl bg-[#F4FAFB] px-5 py-4 outline outline-1 outline-offset-[-1px] outline-[#CFEEED]"
            >
              <Plus className="h-6 w-6 shrink-0 text-[#07BAB5]" aria-hidden="true" />
              <span className="justify-center text-base font-black tracking-[2.56px] text-[#07BAB5]">
                AGREGAR EVALUACION
              </span>
            </button>
          )}

          {reviews.map((review) => (
            <ReviewerCard
              key={review.id}
              initials={getReviewerInitials(review.reviewerName, review.reviewerSurname)}
              name={review.reviewerName}
              surname={review.reviewerSurname}
              score={review.score}
              sections={review.sections}
              variant={openReviewIds.includes(review.id) ? "open" : "close"}
              onClick={() => toggleReview(review.id)}
              onEditScore={
                review.isCurrentUser
                  ? () => router.push(`/visits/${visit.id}/review`)
                  : undefined
              }
            />
          ))}
        </div>

        <div className="inline-flex items-center justify-start gap-4">
          <button
            type="button"
            onClick={() => setIsEditVisitModalOpen(true)}
            className="inline-flex w-44 items-center justify-center gap-4 overflow-hidden rounded-2xl bg-[#F4FAFB] px-5 py-4 text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]"
          >
            <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="w-24 text-center text-[10px] font-black tracking-wider">
              EDITAR
              <br />
              VISITA
            </span>
          </button>

          <button
            type="button"
            onClick={() => void handleDeleteVisit()}
            disabled={isDeleting}
            className="inline-flex w-44 items-center justify-center gap-4 overflow-hidden rounded-2xl bg-[#FFDFDF] px-5 py-4 text-[#FF0000] outline outline-1 outline-offset-[-1px] outline-[#FF7171] disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="w-24 text-center text-[10px] font-black tracking-wider">
              {isDeleting ? (
                "ELIMINANDO..."
              ) : (
                <>
                  ELIMINAR
                  <br />
                  VISITA
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      <VisitFormModal
        open={isEditVisitModalOpen}
        restaurantId={visit.restaurant.id}
        visit={visit}
        onSaved={handleVisitSaved}
        onClose={() => setIsEditVisitModalOpen(false)}
      />
    </main>
  );
}
