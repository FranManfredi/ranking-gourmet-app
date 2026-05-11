import Logo from "@/src/components/logo/logo";
import AccountActionsButton from "@/src/components/auth/account-actions-button";
import SearchSortBarWrapper from "@/src/components/wrapper/SearchSortBarWrapper";
import RestaurantsAndEvaluatorButtonWrapper from "@/src/components/wrapper/RestaurantsAndEvaluatorButtonWrapper";
import { redirect } from "next/navigation";
import { getServerSession, isAdminSession } from "@/src/lib/auth/server";

export default async function HomePage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  const isAdmin = isAdminSession(session);

  return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-[#FFFFFF] pt-[10px]">
          <div className="flex w-full justify-end px-4 pt-2">
              <AccountActionsButton />
          </div>
          <Logo/>
          <div className="text-center justify-start text-black text-3xl font-black leading-8">
              RANKING GOURMET
              <br/>
          </div>
          <div className="h-5"/>
          <RestaurantsAndEvaluatorButtonWrapper isAdmin={isAdmin} />
          <SearchSortBarWrapper />
      </main>
  );
}
