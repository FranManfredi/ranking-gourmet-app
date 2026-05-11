"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth/client";

export default function AccountActionsButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
    setIsLoggingOut(false);
    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      authClient.$store.notify("$sessionSignal");
      router.replace("/");
      router.refresh();
    } catch (logoutError) {
      console.error("Error al cerrar sesion", logoutError);
      setError("No pudimos cerrar la sesion.");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-[20px] bg-[#F4FAFB] px-4 py-2 text-[10px] font-black tracking-wider text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]"
      >
        CUENTA
      </button>

      {!open ? null : (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onTouchMove={(event) => event.preventDefault()}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
            onTouchMove={(event) => event.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-black">Cuenta</h2>

            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);
                const currentPassword = String(formData.get("currentPassword") ?? "");
                const newPassword = String(formData.get("newPassword") ?? "");

                try {
                  setIsChangingPassword(true);
                  setError(null);
                  setSuccess(null);

                  const result = await authClient.changePassword({
                    currentPassword,
                    newPassword,
                    revokeOtherSessions: true,
                  });

                  if (result.error) {
                    setError(result.error.message ?? "No pudimos cambiar la contraseña.");
                    return;
                  }

                  setSuccess("Contraseña actualizada correctamente.");
                  event.currentTarget.reset();
                } catch (changePasswordError) {
                  console.error("Error changing password", changePasswordError);
                  setError("No pudimos cambiar la contraseña.");
                } finally {
                  setIsChangingPassword(false);
                }
              }}
            >
              <input
                name="currentPassword"
                type="password"
                placeholder="Contraseña actual"
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
              />

              <input
                name="newPassword"
                type="password"
                placeholder="Nueva contraseña"
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
              />

              {error && (
                <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  {success}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-2xl bg-gray-100 px-4 py-2 font-bold text-zinc-700"
                >
                  Cerrar
                </button>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="rounded-2xl bg-[#07BAB5] px-4 py-2 font-bold text-white disabled:opacity-60"
                >
                  {isChangingPassword ? "Guardando..." : "Cambiar contraseña"}
                </button>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                  className="rounded-2xl bg-[#FFDFDF] px-4 py-2 font-bold text-[#FF0000] outline outline-1 outline-[#FF7171] disabled:opacity-60"
                >
                  {isLoggingOut ? "Saliendo..." : "Log-out"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
