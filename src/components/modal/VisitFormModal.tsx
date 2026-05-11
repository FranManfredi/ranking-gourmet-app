"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createVisit, SimpleVisitDTO, updateVisit } from "@/src/lib/visits/client";

interface VisitFormModalProps {
  open: boolean;
  restaurantId: number;
  onClose: () => void;
  visit?: SimpleVisitDTO | null;
  onSaved?: (visit: SimpleVisitDTO) => void;
}

export default function VisitFormModal({
  open,
  restaurantId,
  onClose,
  visit,
  onSaved,
}: VisitFormModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isEditing = Boolean(visit);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  const handleClose = () => {
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onTouchMove={(e) => e.preventDefault()}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onTouchMove={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-xl font-bold text-black">
          {isEditing ? "Editar visita" : "Agregar visita"}
        </h2>
        <p className="mb-4 text-sm text-zinc-700">
          {isEditing
            ? "Podés cambiar el día de la visita."
            : "La fecha es opcional. Si la dejás vacía, se usa la fecha actual."}
        </p>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const visitedAt = String(formData.get("visitedAt") ?? "");

            try {
              setIsSubmitting(true);
              setError(null);

              const savedVisit = isEditing && visit
                ? await updateVisit(visit.id, {
                    visitedAt,
                  })
                : await createVisit({
                    restaurantId,
                    visitedAt,
                  });

              onSaved?.(savedVisit);
              handleClose();

              if (!isEditing) {
                startTransition(() => {
                  router.push(`/visits/${savedVisit.id}`);
                });
              }
            } catch (submitError) {
              console.error(
                isEditing ? "Error updating visit" : "Error creating visit",
                submitError
              );
              setError(
                isEditing
                  ? "No pudimos actualizar la visita."
                  : "No pudimos crear la visita."
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <input
            name="visitedAt"
            type="date"
            inputMode="none"
            defaultValue={visit?.visitedAt ? visit.visitedAt.slice(0, 10) : ""}
            onKeyDown={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 outline-none focus:border-[#07BAB5]"
          />

          {error && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-2xl bg-gray-100 px-4 py-2 font-bold text-zinc-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-[#07BAB5] px-4 py-2 font-bold text-white disabled:opacity-60"
            >
              {isSubmitting
                ? isEditing
                  ? "Guardando..."
                  : "Agregando..."
                : isEditing
                  ? "Guardar"
                  : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
