"use client";

import { useEffect, useState } from "react";
import Tag from "@/src/components/tag/Tag";
import { createRestaurant } from "@/src/lib/restaurants/client";

interface RestaurantFormModalProps {
    open: boolean;
    onClose: () => void;
}

export default function RestaurantFormModal({
                                                open,
                                                onClose,
                                            }: RestaurantFormModalProps) {
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
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
        setTags([]);
        setTagInput("");
        setError(null);
        setIsSubmitting(false);
        onClose();
    };

    const addTag = () => {
        const normalizedTag = tagInput.trim().toUpperCase();

        if (!normalizedTag) return;
        if (tags.includes(normalizedTag)) {
            setTagInput("");
            return;
        }

        setTags((prev) => [...prev, normalizedTag]);
        setTagInput("");
    };

    const removeTag = (tagToRemove: string) => {
        setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
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
                    Agregar restaurante
                </h2>

                <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const formData = new FormData(e.currentTarget);

                        const data = {
                            name: String(formData.get("name") ?? ""),
                            address: String(formData.get("address") ?? ""),
                            city: String(formData.get("city") ?? ""),
                            tags,
                        };

                        try {
                            setIsSubmitting(true);
                            setError(null);
                            await createRestaurant(data);
                            handleClose();
                        } catch (submitError) {
                            console.error("Error creating restaurant", submitError);
                            setError("No pudimos crear el restaurante.");
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                >
                    <input
                        name="name"
                        placeholder="Nombre"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="address"
                        placeholder="Dirección"
                        required
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="city"
                        placeholder="Ciudad"
                        defaultValue="MAR DEL PLATA"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                    />

                    {error && (
                        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
                            {error}
                        </p>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-zinc-700">Tags</label>

                        <div className="flex gap-2">
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Agregar tag"
                                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#07BAB5]"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />

                            <button
                                type="button"
                                onClick={addTag}
                                className="rounded-2xl bg-[#07BAB5] px-4 py-2 font-bold text-white"
                            >
                                Añadir
                            </button>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="rounded-full"
                                        title="Quitar tag"
                                    >
                                        <Tag text={tag} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-2xl bg-gray-100 px-4 py-2 font-bold text-gray-500"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-2xl bg-[#07BAB5] px-4 py-2 font-bold text-white"
                        >
                            {isSubmitting ? "Agregando..." : "Agregar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
