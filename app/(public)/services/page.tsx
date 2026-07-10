import Link from "next/link";
import { serviceCategories, services, formatMoney, formatPublicVariantLabel } from "@/lib/services/catalog";
import type { ServiceCategoryName } from "@/lib/types";

const allServicesFilter = "All Services";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category === allServicesFilter || !params.category
    ? allServicesFilter
    : serviceCategories.includes(params.category as ServiceCategoryName)
    ? (params.category as ServiceCategoryName)
    : allServicesFilter;
  const visibleServices = selectedCategory === allServicesFilter ? services : services.filter((service) => service.category === selectedCategory);
  const filters = [allServicesFilter, ...serviceCategories] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9f6f52]">Services</p>
        <h1 className="serif mt-3 text-5xl font-semibold text-[#583d2f]">Real Serenity Haven treatments and prices.</h1>
      </div>
      <div className="scrollbar-none -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {filters.map((category) => (
          <Link
            key={category}
            href={category === allServicesFilter ? "/services" : `/services?category=${encodeURIComponent(category)}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              selectedCategory === category ? "bg-[#583d2f] text-white" : "bg-white text-[#583d2f]"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {visibleServices.map((service) => (
          <article key={service.id} className="rounded-lg border border-[#583d2f]/10 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="serif text-3xl font-semibold text-[#583d2f]">{service.name}</h2>
                {service.description ? <p className="mt-2 text-sm text-[#5f554d]">{service.description}</p> : null}
              </div>
              <Link
                href={`/book?location=${service.variants.some((variant) => variant.locationType === "SPA") ? "SPA" : "HOME"}&service=${service.id}`}
                className="rounded-full bg-[#d7dfcf] px-4 py-2 text-sm font-semibold text-[#583d2f]"
              >
                Book
              </Link>
            </div>
            <div className="mt-5 grid gap-2">
              {service.variants.map((variant) => (
                <div key={variant.id} className="flex items-center justify-between rounded-md bg-[#fbf7f0] px-4 py-3 text-sm">
                  <span className="font-medium text-[#583d2f]">
                    {[variant.locationType === "SPA" ? "Spa" : "Home", formatPublicVariantLabel(variant.durationMinutes)].filter(Boolean).join(" / ")}
                  </span>
                  <span className="font-semibold text-[#221f1a]">{formatMoney(variant.pricePesewas)}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
