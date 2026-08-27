import { redirect } from "next/navigation";
import AccountPageClient from "@/src/components/auth/AccountPageClient";
import { getServerSession } from "@/src/lib/auth/server";

export default async function AccountPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  return <AccountPageClient />;
}
