"use client";

import Link from "next/link";

export default function AccountActionsButton() {
  return (
    <Link
      href="/account"
      className="inline-flex items-center justify-center rounded-[20px] bg-[#F4FAFB] px-4 py-2 text-[10px] font-black tracking-wider text-[#07BAB5] outline outline-1 outline-offset-[-1px] outline-[#CFEEED]"
    >
      CUENTA
    </Link>
  );
}
