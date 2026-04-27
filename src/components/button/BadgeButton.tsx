import clsx from "clsx";

interface BadgeButtonProps {
    value?: string | number;
    icon?: string;
    className?: string;
}

export default function BadgeButton({ value, icon, className }: BadgeButtonProps) {
    return (
        <div
            className={clsx(
                "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white text-[#07BAB5] shadow-[inset_0px_4px_8.3px_0px_rgba(0,0,0,0.25)]",
                className
            )}
        >
            {icon ? (
                <span
                    className="block h-4 w-4 shrink-0 bg-current"
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
            ) : (
                <span className="flex h-full w-full items-center justify-center text-center text-base font-black leading-none">
          {value}
        </span>
            )}
        </div>
    );
}