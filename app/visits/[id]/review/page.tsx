import { redirect } from "next/navigation";
import { getServerSession } from "@/src/lib/auth/server";
import ReviewFormPageClient from "@/src/components/reviews/ReviewFormPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VisitReviewPage({ params }: PageProps) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  return <ReviewFormPageClient visitId={id} currentUserId={session.user.id} />;
}
