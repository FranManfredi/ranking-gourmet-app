import clsx from "clsx";

type TagType =
    | "BODEGÓN"
    | "CARNES"
    | "CERVECERÍA"
    | "DE AUTOR"
    | "PASTAS"
    | "PESCADOS"
    | "PICADAS"
    | "PIZZAS"
    | "TAPAS"
    | "ARABE"
    | "CHINA"
    | "COREANA"
    | "ESPAÑOLA"
    | "FRANCESA"
    | "ITALIANA"
    | "JAPONESA"
    | "MEXICANA"
    | "DEFAULT";

interface TagProps {
    text: string;
    className?: string;
}

const tagStyles = {
    BODEGÓN: "bg-amber-200 text-amber-900",
    CARNES: "bg-red-200 text-red-900",
    CERVECERÍA: "bg-yellow-200 text-yellow-900",
    "DE AUTOR": "bg-purple-200 text-purple-900",
    PASTAS: "bg-orange-200 text-orange-900",
    PESCADOS: "bg-sky-200 text-sky-900",
    PICADAS: "bg-lime-200 text-lime-900",
    PIZZAS: "bg-rose-200 text-rose-900",
    TAPAS: "bg-teal-200 text-teal-900",
    ARABE: "bg-stone-200 text-stone-900",
    CHINA: "bg-red-100 text-red-800",
    COREANA: "bg-fuchsia-200 text-fuchsia-900",
    ESPAÑOLA: "bg-yellow-100 text-yellow-800",
    FRANCESA: "bg-indigo-200 text-indigo-900",
    ITALIANA: "bg-green-200 text-green-900",
    JAPONESA: "bg-pink-200 text-pink-900",
    MEXICANA: "bg-emerald-200 text-emerald-900",
    DEFAULT: "bg-gray-100 text-gray-500",
} as const;

export default function Tag({ text, className }: TagProps) {
    const normalizedText = text.toUpperCase() as TagType;
    const styles = tagStyles[normalizedText] ?? tagStyles.DEFAULT;

    return (
        <div
            className={clsx(
                "inline-flex h-5 items-center justify-center gap-2.5 overflow-hidden rounded-3xl px-2 py-0.5 outline outline-1 outline-offset-[-1px] outline-[#CFEEED]",
                styles,
                className
            )}
        >
      <span className="text-center text-[10px] font-bold">
        {text.toUpperCase()}
      </span>
        </div>
    );
}