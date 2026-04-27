import { redirect } from "next/navigation";
import { getServerSession } from "@/src/lib/auth/server";
import RestaurantPageClient from "@/src/components/restaurants/RestaurantPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantPage({ params }: PageProps) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  return <RestaurantPageClient id={id} />;
}
