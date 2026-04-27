"use client";

import clsx from "clsx";

interface IconTextButtonProps {
    label: string;
    icon?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    ariaLabel?: string;
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
    {icon && (
        <span
            className="block h-4 w-3.5 shrink-0 bg-current"
        aria-hidden="true"
        style={{
        WebkitMaskImage: `url(${icon})`,
            maskImage: `url(${icon})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
    }}
        />
    )}

    <span className="text-center text-[10px] font-black tracking-wider">
        {label}
        </span>
        </button>
);
}