import clsx from "clsx";
import BadgeButton from "@/src/components/button/BadgeButton";
import ScoreBadge from "@/src/components/score/ScoreBadge";
import Tag from "@/src/components/tag/Tag";

interface RestaurantRankingCardProps {
    position?: number | string;
    icon?: string;
    name: string;
    address: string;
    city: string;
    date: string;
    score?: number | null;
    showScoreText?: boolean;
    tags?: string[];
    onClick?: () => void;
    className?: string;
}

export default function RestaurantRankingCard({
                                                  position,
                                                  icon,
                                                  name,
                                                  address,
                                                  city,
                                                  date,
                                                  score,
                                                  showScoreText = true,
                                                  tags = [],
                                                  onClick,
                                                  className,
                                              }: RestaurantRankingCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                "inline-flex w-96 flex-col items-center justify-start gap-4 overflow-hidden rounded-2xl bg-slate-100 px-4 py-2.5 text-left outline outline-1 outline-offset-[-1px] outline-[#CFEEED] transition hover:bg-slate-50 active:scale-[0.99]",
                className
            )}
        >
            <div className="inline-flex w-80 items-center justify-between">
                <div className="flex w-60 items-center justify-start gap-2">
                    <div className="inline-flex w-9 flex-col items-start justify-start gap-2.5 self-stretch">
                        <BadgeButton value={position} icon={icon} className="self-stretch" />
                    </div>

                    <div className="inline-flex w-52 flex-col items-start justify-start gap-0.5 self-stretch overflow-hidden">
                        <div className="self-stretch text-base font-black text-black">
                            {name}
                        </div>

                        <div className="flex self-stretch flex-col items-start justify-start gap-0.5 pl-1">
                            <div className="text-center text-xs font-bold text-gray-500">
                                {address}
                            </div>

                            <div className="self-stretch text-xs font-bold text-gray-500">
                                {city}
                            </div>

                            <div className="h-3 w-52 text-xs font-black text-[#07BAB5]">
                                {date}
                            </div>
                        </div>
                    </div>
                </div>

                <ScoreBadge score={score} showText={showScoreText} />
            </div>

            {tags.length > 0 && (
                <div className="inline-flex w-full flex-wrap content-start items-start justify-end gap-2 self-stretch">
                    {tags.map((tag, index) => (
                        <Tag key={`${tag}-${index}`} text={tag} />
                    ))}
                </div>
            )}
        </button>
    );
}