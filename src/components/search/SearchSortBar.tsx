"use client";

import clsx from "clsx";

interface SearchSortBarProps {
    value?: string;
    placeholder?: string;
    sortLabel?: string;
    searchIcon?: string;
    sortIcon?: string;
    onChange?: (value: string) => void;
    onSortClick?: () => void;
    className?: string;
}

export default function SearchSortBar({
                                          value,
                                          placeholder = "Some Text",
                                          sortLabel = "ORDEN",
                                          searchIcon = "/search.svg",
                                          sortIcon,
                                          onChange,
                                          onSortClick,
                                          className,
                                      }: SearchSortBarProps) {
    return (
        <div
            className={clsx(
                "inline-flex h-12 w-full items-center justify-start gap-2.5 overflow-hidden bg-white px-1",
                className
            )}
        >
            <div className="flex h-10 flex-1 items-center justify-between rounded-2xl bg-[#F4FAFB] px-2.5 py-1.5 outline outline-1 outline-offset-[-0.5px] outline-[#CFEEED]">
                <input
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 bg-transparent text-base font-normal leading-6 text-[#07BAB5] placeholder:text-[#07BAB5] focus:outline-none"
                />

                <span
                    className="h-6 w-6 shrink-0 bg-[#07BAB5] opacity-60"
                    aria-hidden="true"
                    style={{
                        WebkitMaskImage: `url(${searchIcon})`,
                        maskImage: `url(${searchIcon})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                    }}
                />
            </div>

            <button
                type="button"
                onClick={onSortClick}
                className="flex h-9 items-center justify-center gap-4 overflow-hidden rounded-[20px] bg-[#EDF7F5] px-3 py-2 text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]"
            >
                {sortIcon && (
                    <span
                        className="h-4 w-3.5 bg-current"
                        aria-hidden="true"
                        style={{
                            WebkitMaskImage: `url(${sortIcon})`,
                            maskImage: `url(${sortIcon})`,
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
          {sortLabel}
        </span>
            </button>
        </div>
    );
}