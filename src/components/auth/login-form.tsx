"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth/client";

interface FormStatus {
  status: "idle" | "error" | "success";
  message?: string;
}

export function LoginForm() {
  const router = useRouter();
  const { error: sessionError } = authClient.useSession();

  const [status, setStatus] = useState<FormStatus>({ status: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("rememberMe") === "on";

    if (!email || !password) {
      setStatus({ status: "error", message: "Completá tu email y contraseña." });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ status: "idle" });

      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/home",
        rememberMe,
      });

      if (result.error) {
        setStatus({
          status: "error",
          message:
              result.error.message ??
              "No pudimos validar las credenciales. Revisá los datos e intentá nuevamente.",
        });
        return;
      }

      setStatus({ status: "success", message: "Inicio de sesión correcto." });
      form.reset();
      authClient.$store.notify("$sessionSignal");
      router.replace("/home");
      router.refresh();
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setStatus({
        status: "error",
        message: "Ocurrió un error inesperado. Intentá nuevamente en unos segundos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-lg backdrop-blur">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
          Ranking Gourmet
        </p>
        <h2 className="text-3xl font-semibold text-zinc-900">Iniciá sesión</h2>
        <p className="text-sm text-zinc-500">
          Accedé al panel con tu usuario registrado en Better Auth.
        </p>
      </header>

      {sessionError && (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No pudimos recuperar tu sesión actual. {sessionError.message}
        </p>
      )}

      {status.status === "error" && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {status.message}
        </p>
      )}

      {status.status === "success" && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {status.message}
        </p>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="tucuenta@ranking.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="••••••••"
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-zinc-600">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            className="h-[18px] w-[18px] rounded border border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            defaultChecked
          />
          Recordarme en este dispositivo
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </section>
  );
}
