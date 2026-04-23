import Image from "next/image";

export default function Logo() {
    return (
        <div className="inline-flex h-20 w-20 items-center justify-center gap-2.5 overflow-hidden rounded-[34px] bg-[#07BAB5] p-2.5">
            <div className="relative h-12 w-12 overflow-hidden">
                <Image
                    src="/solar_chef-hat-line-duotone.svg"
                    alt="Logo Ranking Gourmet"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}