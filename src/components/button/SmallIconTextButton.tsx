"use client";

import clsx from "clsx";
import { ArrowUpDown, CalendarDays, Plus, UserPlus } from "lucide-react";

interface IconTextButtonProps {
    label: string;
    icon?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    ariaLabel?: string;
}

function renderIcon(icon?: string) {
    if (!icon) {
        return null;
    }

    if (icon.includes("calendar")) {
        return <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }

    if (icon.includes("sort")) {
        return <ArrowUpDown className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }

    if (icon.includes("person-add")) {
        return <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }

    return <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />;
}

export default function SmallIconTextButton({
                                           label,
                                           icon,
                                           onClick,
                                           className,
                                       type = "button",
                                       ariaLabel,
                                   }: IconTextButtonProps) {
    return (
        <button
            type={type}
    onClick={onClick}
    aria-label={ariaLabel ?? label}
    className={clsx(
        "flex h-9 items-center justify-center gap-4 overflow-hidden rounded-[20px] bg-[#EDF7F5] px-3 py-2 text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]",
        className
)}
>
    {renderIcon(icon)}

    <span className="text-center text-[10px] font-black tracking-wider">
        {label}
        </span>
        </button>
);
}
