import { ReviewDTO } from "@/src/lib/reviews/client";
import { VisitWithDetailsDTO } from "@/src/lib/visits/client";

export function getReviewAverageScore(review: ReviewDTO): number {
  const scores = [
    review.foodRating,
    review.beverageRating,
    review.serviceRating,
    review.valueRating,
    review.ambianceRating,
  ];

  return scores.reduce((total, value) => total + value, 0) / scores.length;
}

export function getVisitAverageScore(reviews: ReviewDTO[]): number | null {
  if (!reviews.length) {
    return null;
  }

  const total = reviews.reduce((sum, review) => sum + getReviewAverageScore(review), 0);
  return total / reviews.length;
}

export function getRestaurantAverageScore(visits: VisitWithDetailsDTO[]): number | null {
  const visitScores = visits
    .map((visit) => getVisitAverageScore(visit.reviews))
    .filter((score): score is number => score !== null);

  if (!visitScores.length) {
    return null;
  }

  const total = visitScores.reduce((sum, score) => sum + score, 0);
  return total / visitScores.length;
}
