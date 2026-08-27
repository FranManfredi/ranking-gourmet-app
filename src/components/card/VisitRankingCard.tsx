import clsx from "clsx";
import BadgeButton from "@/src/components/button/BadgeButton";
import ScoreBadge from "@/src/components/score/ScoreBadge";
import { CalendarDays } from "lucide-react";

interface VisitRankingCardProps {
    position?: number | string;
    date: string;
    score?: number | null;
    label?: string;
    icon?: string;
    onClick?: () => void;
    className?: string;
}

export default function VisitRankingCard({
                                             position,
                                             date,
                                             score,
                                             onClick,
                                             className,
                                         }: VisitRankingCardProps) {
    const badgeValue = score == null ? "-" : (position ?? "-");

    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                "inline-flex h-20 w-96 items-center justify-between overflow-hidden rounded-2xl bg-slate-100 px-4 py-2.5 pr-6 text-left outline outline-1 outline-offset-[-1px] outline-[#CFEEED]",
                className
            )}
        >
            <div className="flex w-60 items-center justify-start gap-2">
                <BadgeButton value={badgeValue} className="self-stretch" />
                <div className="flex self-stretch items-center justify-start gap-2.5 pl-4 pr-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-[#07BAB5]" aria-hidden="true" />
                    <div className="flex w-20 flex-col items-center text-center font-black text-[#07BAB5]">
                        <span className="text-[10px] tracking-wider">VISITA</span>
                        <span className="text-xs">{date}</span>
                    </div>
                </div>
            </div>

            <ScoreBadge score={score} showText={true}/>
        </button>
    );
}
