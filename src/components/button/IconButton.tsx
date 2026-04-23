import clsx from "clsx";

type ButtonVariant = "default" | "delete" | "confirm";

interface CategoryButtonProps {
    label: string;
    icon: string;
    variant?: ButtonVariant;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

const variantStyles: Record<
    ButtonVariant,
    {
        button: string;
        text: string;
    }
> = {
    default: {
        button: "bg-[#F4FAFB] outline-[#CFEEED]",
        text: "text-[#07BAB5]",
    },
    delete: {
        button: "bg-[#FFDFDF] outline-[#FF7171]",
        text: "text-[#FF0000]",
    },
    confirm: {
        button: "bg-[#B3FFBF] outline-[#00D720]",
        text: "text-[#00D720]",
    },
};

export default function IconButton({
                                           label,
                                           icon,
                                           variant = "default",
                                           onClick,
                                           className,
                                           type = "button",
                                       }: CategoryButtonProps) {
    const styles = variantStyles[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            className={clsx(
                "inline-flex w-44 items-center justify-center gap-4 overflow-hidden rounded-2xl px-5 py-4 outline outline-1 outline-offset-[-1px] active:scale-[0.95]",
                styles.button,
                styles.text,
                className
            )}
        >
      <span
          className="h-4 w-4 shrink-0 bg-current"
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

            <span className="text-center text-[10px] font-black tracking-wider">
        {label}
      </span>
        </button>
    );
}