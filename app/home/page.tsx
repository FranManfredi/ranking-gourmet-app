import Logo from "@/src/components/logo/logo";
import SearchSortBarWrapper from "@/src/components/wrapper/SearchSortBarWrapper";
import RestaurantsAndEvaluatorButtonWrapper from "@/src/components/wrapper/RestaurantsAndEvaluatorButtonWrapper";
import { redirect } from "next/navigation";
import { getServerSession } from "@/src/lib/auth/server";

export default async function HomePage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
      <main className="flex min-h-screen flex-col items-center gap-2 bg-[#FFFFFF] pt-[10px]">
          <Logo/>
          <div className="text-center justify-start text-black text-3xl font-black font-['Inter'] leading-8">
              RANKING GOURMET
              <br/>
          </div>
          <div className="h-5"/>
          <RestaurantsAndEvaluatorButtonWrapper />
          <SearchSortBarWrapper />
      </main>
  );
}

