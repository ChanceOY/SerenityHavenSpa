import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Sparkles, UsersRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { formatMoney, services } from "@/lib/services/catalog";
import { staffMembers } from "@/lib/staff/staff";

const featuredNames = ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Massage", "Soli Massage", "Moon Walk"];
const categoryOverview = ["Massage", "Couples Massage", "Nails", "Facials", "Body Treatments", "Waxing"];

export default function HomePage() {
  const featured = featuredNames
    .map((name) => services.find((service) => service.name === name))
    .filter((service) => service !== undefined);

  return (
    <>
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#221f1a] text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src="/media/serenity-haven-spa-tour.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Serenity Haven Spa interior video"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/25 to-[#221f1a]/80" />
        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <Image
            src="/brand/serenity-haven-logo.jpeg"
            alt="Serenity Haven Spa logo"
            width={86}
            height={86}
            className="mb-7 h-20 w-20 rounded-full object-cover shadow-2xl"
            priority
          />
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#d7dfcf]">Serenity Haven Spa</p>
          <h1 className="serif max-w-3xl text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
            Unhurried care for body, mind and skin.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#efe4d4] sm:text-lg">
            Book an in-spa appointment or request a home service with the Serenity Haven team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book?location=SPA" variant="light">
              Book an Appointment
            </ButtonLink>
            <ButtonLink href="/book?location=HOME" variant="secondary">
              Book a Home Service
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9f6f52]">The Serenity Experience</p>
          <h2 className="serif mt-3 text-4xl font-semibold text-[#583d2f] sm:text-5xl">Warm rituals, thoughtful touch, real choice.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["In-spa calm", Sparkles],
            ["Home services", Home],
            ["Therapist preference", UsersRound],
          ].map(([label, Icon]) => (
            <div key={String(label)} className="border-l border-[#583d2f]/20 pl-5">
              <Icon className="mb-5 text-[#62705a]" size={28} aria-hidden="true" />
              <p className="font-semibold text-[#583d2f]">{String(label)}</p>
              <p className="mt-2 text-sm leading-6 text-[#5f554d]">Booking requests are reviewed by staff before confirmation.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#efe4d4] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="serif text-4xl font-semibold text-[#583d2f]">Explore Services</h2>
            <Link href="/services" className="hidden items-center gap-2 text-sm font-semibold text-[#583d2f] sm:flex">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryOverview.map((category) => (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="group flex min-h-28 items-end justify-between rounded-lg bg-[#fbf7f0] p-5 text-[#583d2f] transition hover:bg-white"
              >
                <span className="serif text-2xl font-semibold">{category}</span>
                <ArrowRight className="transition group-hover:translate-x-1" size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="serif text-4xl font-semibold text-[#583d2f]">Featured Treatments</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {featured.map((service) => {
            const lowest = Math.min(...service.variants.map((variant) => variant.pricePesewas));
            return (
              <article key={service.id} className="flex h-full flex-col rounded-lg border border-[#583d2f]/10 bg-white p-5">
                <p className="min-h-10 text-xs font-semibold uppercase tracking-[0.18em] text-[#62705a]">{service.category}</p>
                <h3 className="serif mt-3 min-h-20 text-2xl font-semibold leading-tight text-[#583d2f]">{service.name}</h3>
                <p className="mt-auto pt-5 text-sm text-[#5f554d]">From {formatMoney(lowest)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#221f1a] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d7dfcf]">Home Service</p>
            <h2 className="serif mt-3 text-4xl font-semibold">Spa care requested for your space.</h2>
          </div>
          <div>
            <p className="text-base leading-7 text-[#efe4d4]">
              Home service bookings collect your area, address, landmark and notes. Transportation fees are confirmed manually by
              Serenity Haven staff before therapist dispatch.
            </p>
            <div className="mt-6">
              <ButtonLink href="/book?location=HOME" variant="light">
                Request Home Service
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="serif text-4xl font-semibold text-[#583d2f]">Meet the Team</h2>
          <Link href="/team" className="text-sm font-semibold text-[#583d2f] underline underline-offset-4">
            View team
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {staffMembers.slice(0, 5).map((member) => (
            <article key={member.id}>
              <Image
                src={member.profileImage}
                alt={`${member.displayName}, Spa Therapist`}
                width={240}
                height={260}
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
              <h3 className="mt-3 font-semibold text-[#583d2f]">{member.displayName}</h3>
              <p className="text-sm text-[#5f554d]">{member.roleLabel}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-[#d7dfcf] px-6 py-12 text-center text-[#583d2f]">
          <h2 className="serif text-4xl font-semibold">Ready for your Serenity Haven visit?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6">
            Submit a booking request with your preferred date, time and therapist. Staff will review and confirm.
          </p>
          <div className="mt-7">
            <ButtonLink href="/book">Book Now</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
