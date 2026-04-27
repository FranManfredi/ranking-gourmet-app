import { redirect } from "next/navigation";
import { LoginForm } from "@/src/components/auth/login-form";
import { getServerSession } from "@/src/lib/auth/server";

export default async function LogIn() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <LoginForm />
      </div>
    </div>
  );
}
