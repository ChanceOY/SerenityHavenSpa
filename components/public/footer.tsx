import Image from "next/image";
import Link from "next/link";
import { AtSign, ExternalLink, MapPin, Phone } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#583d2f]/10 bg-[#221f1a] text-[#fbf7f0]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Image
            src="/brand/serenity-haven-logo.jpeg"
            alt="Serenity Haven Spa logo"
            width={64}
            height={64}
            className="mb-4 h-16 w-16 rounded-full object-cover"
          />
          <p className="serif text-2xl">Serenity Haven Spa</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#efe4d4]">
            Warm spa rituals and thoughtful wellness care for in-spa visits and home service requests.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7dfcf]">Visit</h2>
          <p className="mt-3 flex gap-2 text-sm leading-6 text-[#efe4d4]">
            <MapPin className="mt-1 shrink-0" size={15} aria-hidden="true" />
            Oyarifa, opposite Oyarifa Crossing
          </p>
          <a href="tel:+233541639802" className="mt-2 flex gap-2 text-sm leading-6 text-[#efe4d4] hover:text-white">
            <Phone className="mt-1 shrink-0" size={15} aria-hidden="true" />
            +233 54 163 9802
          </a>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7dfcf]">Connect</h2>
          <Link
            href="https://www.instagram.com/serenity.havenspa/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex gap-2 text-sm leading-6 text-[#efe4d4] hover:text-white"
          >
            <AtSign className="mt-1 shrink-0" size={15} aria-hidden="true" />
            @serenity.havenspa
          </Link>
          <Link
            href="https://web.facebook.com/serenityheavenspagh/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex gap-2 text-sm leading-6 text-[#efe4d4] hover:text-white"
          >
            <ExternalLink className="mt-1 shrink-0" size={15} aria-hidden="true" />
            Serenity Haven Spa GH
          </Link>
        </div>
      </div>
    </footer>
  );
}
