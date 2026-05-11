"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Tag from "@/src/components/tag/Tag";
import {
    createRestaurant,
    SimpleRestaurantDTO,
    updateRestaurant,
} from "@/src/lib/restaurants/client";

interface RestaurantFormModalProps {
    open: boolean;
    onClose: () => void;
    restaurant?: SimpleRestaurantDTO | null;
    onSaved?: (restaurant: SimpleRestaurantDTO) => void;
}

export default function RestaurantFormModal({
                                                open,
                                                onClose,
                                                restaurant,
                                                onSaved,
                                            }: RestaurantFormModalProps) {
    const router = useRouter();
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [, startTransition] = useTransition();
    const isEditing = Boolean(restaurant);

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        setTags(restaurant?.tags ?? []);
        setTagInput("");
        setError(null);
        setIsSubmitting(false);
    }, [open, restaurant]);

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
                    {isEditing ? "Editar restaurante" : "Agregar restaurante"}
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
                            const savedRestaurant = isEditing && restaurant
                                ? await updateRestaurant(restaurant.id, data)
                                : await createRestaurant(data);
                            onSaved?.(savedRestaurant);
                            handleClose();

                            if (!isEditing) {
                                startTransition(() => {
                                    router.push(`/restaurants/${savedRestaurant.id}`);
                                });
                            }
                        } catch (submitError) {
                            console.error(
                                isEditing ? "Error updating restaurant" : "Error creating restaurant",
                                submitError
                            );
                            setError(
                                isEditing
                                    ? "No pudimos actualizar el restaurante."
                                    : "No pudimos crear el restaurante."
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
                        defaultValue={restaurant?.name ?? ""}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="address"
                        placeholder="Dirección"
                        required
                        defaultValue={restaurant?.address ?? ""}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
                    />

                    <input
                        name="city"
                        placeholder="Ciudad"
                        defaultValue={restaurant?.city ?? "MAR DEL PLATA"}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
                    />

                    {error && (
                        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
                            {error}
                        </p>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-zinc-900">Tags</label>

                        <div className="flex gap-2">
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Agregar tag"
                                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-[#07BAB5]"
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
