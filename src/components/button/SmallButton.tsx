"use client";

import clsx from "clsx";

interface SmallButtonProps {
    onClick?: () => void;
    className?: string;
    ariaLabel?: string;
}

export default function SmallButton({
                                        onClick,
                                        className,
                                        ariaLabel = "Botón",
                                    }: SmallButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className={clsx(
                "inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#07BAB5] p-2.5",
                className
            )}
        >
            <svg
                width="9"
                height="15"
                viewBox="0 0 9 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-[15px] w-[9px]"
            >
                <path
                    d="M7.04167 1L1 7.04167L7.04167 13.0833"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}