import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Home Service", "/home-service"],
  ["Our Team", "/team"],
  ["Contact", "/contact"],
] as const;

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#583d2f]/10 bg-[#fbf7f0]/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/serenity-haven-logo.jpeg"
            alt="Serenity Haven Spa logo"
            width={46}
            height={46}
            className="h-11 w-11 rounded-full object-cover"
            priority
          />
          <span className="serif text-xl font-semibold text-[#583d2f]">Serenity Haven</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-[#583d2f] md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-[#9f6f52]">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/book"
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#583d2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3f2b22]"
        >
          <CalendarDays size={16} aria-hidden="true" />
          Book Now
        </Link>
      </div>
    </header>
  );
}
