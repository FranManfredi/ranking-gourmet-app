import ScoreBadge from "@/src/components/score/ScoreBadge";

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
    return (
      <svg viewBox="0 0 20 20" className="absolute left-0 top-0 h-5 w-5 fill-[#07BAB5]" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.75 1.875a.625.625 0 0 1 .625.625V8.75a1.875 1.875 0 1 1-1.25 0V2.5a.625.625 0 0 1 .625-.625Zm4.5 0a.625.625 0 0 1 .625.625v6.358l1.692 1.41a.625.625 0 1 1-.8.96l-1.917-1.597a.625.625 0 0 1-.225-.48V2.5a.625.625 0 0 1 .625-.625ZM4.167 2.5a.625.625 0 0 1 .625.625v3.958a2.708 2.708 0 0 0 5.416 0V3.125a.625.625 0 1 1 1.25 0v3.958a3.96 3.96 0 0 1-2.708 3.756v6.661a.625.625 0 1 1-1.25 0v-6.66A3.96 3.96 0 0 1 3.542 7.082V3.125a.625.625 0 0 1 .625-.625Z" />
      </svg>
    );
  }

  if (sectionId === "beverageRating") {
    return (
      <svg viewBox="0 0 20 20" className="absolute left-0 top-0 h-5 w-5 fill-[#07BAB5]" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 2.5a.625.625 0 0 0-.623.673l.83 9.132A2.5 2.5 0 0 0 7.695 14.5h.43v3a.625.625 0 1 0 1.25 0v-3h.43a2.5 2.5 0 0 0 2.488-2.195l.83-9.132A.625.625 0 0 0 12.5 2.5H5Zm.687 1.25h6.626l-.773 8.492a1.25 1.25 0 0 1-1.244 1.008h-2.59a1.25 1.25 0 0 1-1.244-1.008L5.687 3.75Z" />
      </svg>
    );
  }

  if (sectionId === "serviceRating") {
    return (
      <svg viewBox="0 0 20 20" className="absolute left-0 top-0 h-5 w-5 fill-[#07BAB5]" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2.083a3.542 3.542 0 0 0-3.542 3.542v1.326A2.917 2.917 0 0 0 4.167 9.792v1.875c0 .345.28.625.625.625h1.041v2.916c0 .69.56 1.25 1.25 1.25h5.834c.69 0 1.25-.56 1.25-1.25v-2.916h1.041a.625.625 0 0 0 .625-.625V9.792a2.917 2.917 0 0 0-2.291-2.84V5.625A3.542 3.542 0 0 0 10 2.083Zm2.292 4.584v1.041H7.708V5.625a2.292 2.292 0 1 1 4.584 0v1.042Zm2.291 4.375H5.417V9.792c0-.92.747-1.667 1.666-1.667h5.834c.92 0 1.666.746 1.666 1.667v1.25Z" />
      </svg>
    );
  }

  if (sectionId === "valueRating") {
    return (
      <svg viewBox="0 0 20 20" className="absolute left-0 top-0 h-5 w-5 fill-[#07BAB5]" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2.083a.625.625 0 0 1 .625.625v.904c1.313.165 2.5.986 2.5 2.43a.625.625 0 1 1-1.25 0c0-.776-.823-1.25-1.875-1.25-1.052 0-1.875.474-1.875 1.25 0 .694.536 1.018 2.12 1.384 1.75.403 3.296.98 3.296 2.991 0 1.445-1.188 2.266-2.5 2.43v.903a.625.625 0 1 1-1.25 0v-.903c-1.313-.164-2.5-.985-2.5-2.43a.625.625 0 1 1 1.25 0c0 .776.823 1.25 1.875 1.25 1.052 0 1.875-.474 1.875-1.25 0-.762-.653-1.09-2.292-1.468-1.636-.378-3.125-.975-3.125-2.907 0-1.444 1.187-2.265 2.5-2.43v-.904A.625.625 0 0 1 10 2.083Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className="absolute left-0 top-0 h-5 w-5 fill-[#07BAB5]" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2.083c2.212 0 4.167 1.88 4.167 4.27 0 1.746-.96 3.43-2.913 5.578l-.803.87a.625.625 0 0 1-.902 0l-.803-.87C6.792 9.783 5.833 8.1 5.833 6.354c0-2.39 1.955-4.27 4.167-4.27Zm0 1.25c-1.45 0-2.917 1.281-2.917 3.02 0 1.283.755 2.667 2.6 4.73l.317.35.317-.35c1.845-2.063 2.6-3.447 2.6-4.73 0-1.739-1.467-3.02-2.917-3.02Zm0 1.459a1.563 1.563 0 1 1 0 3.125 1.563 1.563 0 0 1 0-3.125Z" />
    </svg>
  );
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
          <span className="inline-flex h-4 w-4 items-center justify-center text-[#07BAB5]" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-current" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.5 6 8 10.5 12.5 6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
        </div>

        <div className="flex self-stretch flex-col items-start justify-center gap-3">
          {sections.map((section) => (
            <div key={section.id} className="flex w-full flex-col gap-2 rounded-2xl bg-white/60 p-2">
              <div className="inline-flex self-stretch items-center justify-between">
                <div className="inline-flex items-center justify-start gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[inset_0px_4px_8.3px_0px_rgba(0,0,0,0.25)]">
                    <span className="relative h-5 w-5 overflow-hidden" aria-hidden="true">
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
