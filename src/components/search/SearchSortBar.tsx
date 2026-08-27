"use client";

import clsx from "clsx";
import { ArrowUpDown, Search } from "lucide-react";
import { SortMode } from "@/src/lib/sort-preferences";

interface SearchSortBarProps {
    value?: string;
    placeholder?: string;
    sortLabel?: string;
    searchIcon?: string;
    sortIcon?: string;
    sortValue: SortMode;
    sortOptions: Array<{ value: SortMode; label: string; shortLabel: string }>;
    onSearchChange?: (value: string) => void;
    onSortChange?: (value: SortMode) => void;
    className?: string;
}

export default function SearchSortBar({
                                          value,
                                          placeholder = "Some Text",
                                          sortLabel = "ORDEN",
                                          sortIcon,
                                          sortValue,
                                          sortOptions,
                                          onSearchChange,
                                          onSortChange,
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
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 bg-transparent text-base font-normal leading-6 text-[#07BAB5] placeholder:text-[#07BAB5] focus:outline-none"
                />

                <Search className="h-5 w-5 shrink-0 text-[#07BAB5] opacity-60" aria-hidden="true" />
            </div>

            <label className="relative flex h-9 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[20px] bg-[#EDF7F5] px-3 py-2 text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]">
                {sortIcon && <ArrowUpDown className="h-4 w-4 shrink-0" aria-hidden="true" />}

                <span className="min-w-12 text-center text-[10px] font-black tracking-wider">
                    {sortLabel}
                </span>

                <select
                    aria-label="Ordenar restaurantes"
                    value={sortValue}
                    onChange={(event) => onSortChange?.(event.target.value as SortMode)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
