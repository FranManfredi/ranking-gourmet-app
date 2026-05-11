"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth/client";

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await authClient.signOut();
      authClient.$store.notify("$sessionSignal");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesion", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isSubmitting}
      className="inline-flex items-center justify-center rounded-[20px] bg-[#F4FAFB] px-4 py-2 text-[10px] font-black tracking-wider text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED] disabled:opacity-60"
    >
      {isSubmitting ? "SALIENDO..." : "LOG-OUT"}
    </button>
  );
}
