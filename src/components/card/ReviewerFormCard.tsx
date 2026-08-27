import ScoreBadge from "@/src/components/score/ScoreBadge";
import { BadgeDollarSign, ChevronDown, MapPin, Martini, Utensils, ConciergeBell } from "lucide-react";

export interface ReviewerFormSection {
  id: string;
  title: string;
  subtitle: string;
  score: number;
}

interface ReviewerFormCardProps {
  initials: string;
  name: string;
  surname: string;
  sections: ReviewerFormSection[];
  onSectionChange: (sectionId: string, value: number) => void;
}

function SectionIcon({ sectionId }: { sectionId: string }) {
  if (sectionId === "foodRating") {
    return <Utensils className="h-5 w-5 text-[#07BAB5]" aria-hidden="true" />;
  }

  if (sectionId === "beverageRating") {
    return <Martini className="h-5 w-5 text-[#07BAB5]" aria-hidden="true" />;
  }

  if (sectionId === "serviceRating") {
    return <ConciergeBell className="h-5 w-5 text-[#07BAB5]" aria-hidden="true" />;
  }

  if (sectionId === "valueRating") {
    return <BadgeDollarSign className="h-5 w-5 text-[#07BAB5]" aria-hidden="true" />;
  }

  return <MapPin className="h-5 w-5 text-[#07BAB5]" aria-hidden="true" />;
}

function averageScore(sections: ReviewerFormSection[]) {
  if (!sections.length) {
    return null;
  }

  return sections.reduce((total, section) => total + section.score, 0) / sections.length;
}

export default function ReviewerFormCard({
  initials,
  name,
  surname,
  sections,
  onSectionChange,
}: ReviewerFormCardProps) {
  return (
    <div className="inline-flex w-96 flex-col items-center justify-center gap-2.5">
      <div className="inline-flex self-stretch flex-col items-center justify-start gap-2.5 overflow-hidden rounded-2xl bg-slate-100 px-4 py-2.5 text-left outline outline-1 outline-offset-[-1px] outline-[#CFEEED]">
        <div className="inline-flex w-full items-center justify-between">
          <div className="flex h-12 w-52 items-center justify-start gap-2">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#07BAB5] p-2.5">
              <span className="text-center text-2xl font-black text-white">{initials}</span>
            </div>

            <div className="inline-flex h-12 w-36 flex-col items-center justify-center overflow-hidden py-1">
              <div className="self-stretch text-base font-bold text-black">{name}</div>
              <div className="inline-flex self-stretch flex-wrap items-center justify-start gap-1">
                <div className="text-center text-xs font-bold text-black">{surname}</div>
              </div>
            </div>
          </div>

          <ScoreBadge score={averageScore(sections)} showText={true} />
          <ChevronDown className="h-4 w-4 text-[#07BAB5]" aria-hidden="true" />
        </div>

        <div className="flex self-stretch flex-col items-start justify-center gap-3">
          {sections.map((section) => (
            <div key={section.id} className="flex w-full flex-col gap-2 rounded-2xl bg-white/60 p-2">
              <div className="inline-flex self-stretch items-center justify-between">
                <div className="inline-flex items-center justify-start gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[inset_0px_4px_8.3px_0px_rgba(0,0,0,0.25)]">
                    <span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
                      <SectionIcon sectionId={section.id} />
                    </span>
                  </div>

                  <div className="inline-flex flex-col items-start justify-start">
                    <div className="self-stretch text-sm font-bold text-black">{section.title}</div>
                    <div className="self-stretch text-[10px] font-normal text-black">{section.subtitle}</div>
                  </div>
                </div>

                <ScoreBadge score={section.score} showText={false} />
              </div>

              <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] font-black text-[#07BAB5]">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={section.score}
                  onChange={(event) => onSectionChange(section.id, Number(event.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#CFEEED] accent-[#07BAB5]"
                />
                <span className="text-[10px] font-black text-[#07BAB5]">10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
