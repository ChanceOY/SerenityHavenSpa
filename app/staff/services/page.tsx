import { AlertTriangle } from "lucide-react";
import { formatDuration, formatMoney, services } from "@/lib/services/catalog";

export default function StaffServicesPage() {
  return (
    <div>
      <h1 className="serif text-4xl font-semibold text-[#583d2f]">Service Management</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {services.map((service) => (
          <article key={service.id} className="rounded-lg bg-white p-5">
            <h2 className="serif text-2xl font-semibold text-[#583d2f]">{service.name}</h2>
            <p className="text-sm text-[#5f554d]">{service.category}</p>
            <div className="mt-4 space-y-2">
              {service.variants.map((variant) => (
                <div key={variant.id} className="rounded-md bg-[#fbf7f0] px-4 py-3 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {variant.locationType} / {formatDuration(variant.durationMinutes)}
                    </span>
                    <strong>{formatMoney(variant.pricePesewas)}</strong>
                  </div>
                  {variant.durationMinutes === null ? (
                    <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-amber-700">
                      <AlertTriangle size={14} /> Duration required for automatic availability.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
