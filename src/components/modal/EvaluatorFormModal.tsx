"use client";

import { useEffect, useState } from "react";

interface EvaluatorFormModalProps {
    open: boolean;
    onClose: () => void;
}

export default function EvaluatorFormModal({ open, onClose }: EvaluatorFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        setIsSubmitting(false);
        setError(null);
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
                <h2 className="mb-4 text-xl font-bold text-black">
                    Agregar evaluador
                </h2>

                <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const formData = new FormData(e.currentTarget);

                        const data = {
                            name: String(formData.get("name") ?? ""),
                            surname: String(formData.get("surname") ?? ""),
                            email: String(formData.get("email") ?? ""),
                            password: String(formData.get("password") ?? ""),
                        };

                        try {
                            setIsSubmitting(true);
                            setError(null);

                            const response = await fetch("/api/evaluators", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data),
                            });

                            if (!response.ok) {
                                const payload = (await response.json().catch(() => null)) as
                                    | { message?: string }
                                    | null;
                                throw new Error(
                                    payload?.message ?? "No pudimos crear el evaluador."
                                );
                            }

                            handleClose();
                        } catch (submitError) {
                            console.error("Error creating evaluator", submitError);
                            setError(
                                submitError instanceof Error
                                    ? submitError.message
                                    : "No pudimos crear el evaluador."
                            );
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                >
                    <input
                        name="name"
                        placeholder="Nombre"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="surname"
                        placeholder="Apellido"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Mail"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
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
                            {isSubmitting ? "Agregando..." : "Agregar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
