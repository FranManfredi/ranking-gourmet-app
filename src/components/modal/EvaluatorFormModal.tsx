"use client";

import { useEffect } from "react";

interface EvaluatorFormModalProps {
    open: boolean;
    onClose: () => void;
}

export default function EvaluatorFormModal({ open, onClose }: EvaluatorFormModalProps) {
    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [open]);

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
                    onSubmit={(e) => {
                        e.preventDefault();

                        const formData = new FormData(e.currentTarget);

                        const data = {
                            name: String(formData.get("name") ?? ""),
                            surname: String(formData.get("surname") ?? ""),
                            email: String(formData.get("email") ?? ""),
                            password: String(formData.get("password") ?? ""),
                        };

                        console.log(data);
                        onClose();
                    }}
                >
                    <input
                        name="name"
                        placeholder="Nombre"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="surname"
                        placeholder="Apellido"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Mail"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl bg-gray-100 px-4 py-2 font-bold text-gray-500"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="rounded-2xl bg-[#07BAB5] px-4 py-2 font-bold text-white"
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}