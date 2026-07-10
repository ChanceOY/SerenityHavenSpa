import Link from "next/link";
import { AtSign, ExternalLink, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9f6f52]">Contact</p>
      <h1 className="serif mt-3 text-5xl font-semibold text-[#583d2f]">Visit or contact Serenity Haven Spa.</h1>
      <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-white p-5">
          <MapPin className="text-[#62705a]" size={22} aria-hidden="true" />
          <h2 className="mt-4 font-semibold text-[#583d2f]">Location</h2>
          <p className="mt-2 text-[#5f554d]">Oyarifa, opposite Oyarifa Crossing</p>
        </div>
        <div className="rounded-lg bg-white p-5">
          <Phone className="text-[#62705a]" size={22} aria-hidden="true" />
          <h2 className="mt-4 font-semibold text-[#583d2f]">Phone</h2>
          <a href="tel:+233541639802" className="mt-2 inline-block text-[#5f554d] hover:text-[#583d2f]">
            +233 54 163 9802
          </a>
        </div>
        <Link href="https://www.instagram.com/serenity.havenspa/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white p-5">
          <AtSign className="text-[#62705a]" size={22} aria-hidden="true" />
          <h2 className="mt-4 font-semibold text-[#583d2f]">Instagram</h2>
          <p className="mt-2 text-[#5f554d]">@serenity.havenspa</p>
        </Link>
        <Link href="https://web.facebook.com/serenityheavenspagh/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white p-5">
          <ExternalLink className="text-[#62705a]" size={22} aria-hidden="true" />
          <h2 className="mt-4 font-semibold text-[#583d2f]">Facebook</h2>
          <p className="mt-2 text-[#5f554d]">Serenity Haven Spa GH</p>
        </Link>
      </div>
      <div className="mt-8">
        <ButtonLink href="/book">Start a Booking Request</ButtonLink>
      </div>
    </div>
  );
}
