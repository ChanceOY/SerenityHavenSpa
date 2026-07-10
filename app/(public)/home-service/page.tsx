import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { formatMoney, formatPublicVariantLabel, servicesForLocation } from "@/lib/services/catalog";

export default function HomeServicePage() {
  const homeServices = servicesForLocation("HOME");

  return (
    <div>
      <section className="bg-[#221f1a] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d7dfcf]">Home Service</p>
          <h1 className="serif mt-3 max-w-3xl text-5xl font-semibold">Request Serenity Haven care at home.</h1>
          <p className="mt-5 max-w-2xl leading-7 text-[#efe4d4]">
            Transportation fees vary by area and are confirmed manually. The full transport fee must be paid before therapist dispatch.
          </p>
          <div className="mt-8">
            <ButtonLink href="/book?location=HOME" variant="light">
              Request Home Service
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="serif text-4xl font-semibold text-[#583d2f]">Home Service Menu</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {homeServices.map((service) => (
            <article key={service.id} className="flex h-full flex-col rounded-lg bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="serif text-2xl font-semibold text-[#583d2f]">{service.name}</h3>
                  <p className="mt-1 text-sm text-[#5f554d]">{service.category}</p>
                </div>
                <Link href={`/book?location=HOME&service=${service.id}`} className="shrink-0 rounded-full bg-[#d7dfcf] px-4 py-2 text-sm font-semibold text-[#583d2f]">
                  Book
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {service.variants.map((variant) => (
                  <div key={variant.id} className="flex justify-between gap-4 rounded-md bg-[#fbf7f0] px-4 py-3 text-sm">
                    <span>{formatPublicVariantLabel(variant.durationMinutes)}</span>
                    <strong>{formatMoney(variant.pricePesewas)}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
