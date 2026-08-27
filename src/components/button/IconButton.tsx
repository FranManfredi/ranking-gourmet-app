import clsx from "clsx";
import { Check, Pencil, Plus, Trash2, UserPlus } from "lucide-react";

type ButtonVariant = "default" | "delete" | "confirm";

interface CategoryButtonProps {
    label: string;
    icon: string;
    variant?: ButtonVariant;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

const variantStyles: Record<
    ButtonVariant,
    {
        button: string;
        text: string;
    }
> = {
    default: {
        button: "bg-[#F4FAFB] outline-[#CFEEED]",
        text: "text-[#07BAB5]",
    },
    delete: {
        button: "bg-[#FFDFDF] outline-[#FF7171]",
        text: "text-[#FF0000]",
    },
    confirm: {
        button: "bg-[#B3FFBF] outline-[#00D720]",
        text: "text-[#00D720]",
    },
};

function renderIcon(icon: string, variant: ButtonVariant) {
    if (variant === "delete" || icon.includes("trash")) {
        return <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }

    if (variant === "confirm" || icon.includes("check")) {
        return <Check className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }

    if (icon.includes("person-add")) {
        return <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }

    if (icon.includes("edit") || icon.includes("pencil")) {
        return <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }

    return <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />;
}

export default function IconButton({
    label,
    icon,
    variant = "default",
    onClick,
    className,
    type = "button",
}: CategoryButtonProps) {
    const styles = variantStyles[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            className={clsx(
                "inline-flex w-44 items-center justify-center gap-4 overflow-hidden rounded-2xl px-5 py-4 outline outline-1 outline-offset-[-1px] active:scale-[0.95]",
                styles.button,
                styles.text,
                className
            )}
        >
            {renderIcon(icon, variant)}

            <span className="text-center text-[10px] font-black tracking-wider">
                {label}
            </span>
        </button>
    );
}
