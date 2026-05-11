import { redirect } from "next/navigation";
import { getServerSession } from "@/src/lib/auth/server";
import VisitPageClient from "@/src/components/visits/VisitPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VisitPage({ params }: PageProps) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  return <VisitPageClient id={id} currentUserId={session.user.id} />;
}
