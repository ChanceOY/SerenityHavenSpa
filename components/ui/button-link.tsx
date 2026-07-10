import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
        variant === "primary" && "bg-[#583d2f] text-white hover:bg-[#3f2b22]",
        variant === "secondary" && "border border-[#583d2f]/25 bg-white/65 text-[#583d2f] hover:bg-white",
        variant === "light" && "bg-white text-[#583d2f] hover:bg-[#fbf7f0]",
      )}
    >
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
