"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { CalendarClock, Search } from "lucide-react";
import type { ServiceVariantOption } from "@/lib/services/data";

type BookableStaffOption = {
  id: string;
  display_name: string;
};

type AppointmentMode = "walk-in-now" | "schedule-later";

export function ManualAppointmentForm({
  variants,
  staffMembers,
  action,
}: {
  variants: ServiceVariantOption[];
  staffMembers: BookableStaffOption[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const now = getAccraDateTimeParts();
  const [mode, setMode] = useState<AppointmentMode>("walk-in-now");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? null;
  const staffVisible = Boolean(selectedVariant);
  const selectedIsNail = selectedVariant?.categoryName === "Nails";

  return (
    <form action={action} className="mt-6 grid gap-5 lg:grid-cols-2">
      <section className="rounded-lg bg-white p-5">
        <h2 className="font-semibold text-[#583d2f]">Customer</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="customerName" className="rounded-md border px-4 py-3" placeholder="Customer name" required />
          <input name="customerPhone" className="rounded-md border px-4 py-3" placeholder="Phone" required />
          <input name="customerEmail" className="rounded-md border px-4 py-3 sm:col-span-2" placeholder="Email, optional" />
        </div>
      </section>

      <section className="rounded-lg bg-white p-5">
        <h2 className="font-semibold text-[#583d2f]">Appointment Timing</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className={`rounded-lg border p-4 text-sm ${mode === "walk-in-now" ? "border-[#583d2f] bg-[#d7dfcf]" : "border-[#583d2f]/10 bg-[#fbf7f0]"}`}>
            <input
              type="radio"
              name="appointmentMode"
              value="walk-in-now"
              checked={mode === "walk-in-now"}
              onChange={() => setMode("walk-in-now")}
              className="mr-2"
            />
            Walk-in now
          </label>
          <label className={`rounded-lg border p-4 text-sm ${mode === "schedule-later" ? "border-[#583d2f] bg-[#d7dfcf]" : "border-[#583d2f]/10 bg-[#fbf7f0]"}`}>
            <input
              type="radio"
              name="appointmentMode"
              value="schedule-later"
              checked={mode === "schedule-later"}
              onChange={() => setMode("schedule-later")}
              className="mr-2"
            />
            Schedule for later
          </label>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-[#583d2f]">
            Appointment date
            <input
              name="appointmentDate"
              type="date"
              defaultValue={now.date}
              required={mode === "schedule-later"}
              disabled={mode === "walk-in-now"}
              className="mt-2 w-full rounded-md border px-4 py-3 disabled:bg-[#fbf7f0] disabled:text-[#5f554d]"
            />
          </label>
          <label className="block text-sm font-semibold text-[#583d2f]">
            Appointment time
            <input
              name="appointmentTime"
              type="time"
              defaultValue={now.time}
              required={mode === "schedule-later"}
              disabled={mode === "walk-in-now"}
              className="mt-2 w-full rounded-md border px-4 py-3 disabled:bg-[#fbf7f0] disabled:text-[#5f554d]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg bg-white p-5 lg:col-span-2">
        <h2 className="font-semibold text-[#583d2f]">Services and Staff</h2>
        <ServiceVariantCombobox variants={variants} selectedVariantId={selectedVariantId} onSelect={setSelectedVariantId} />
        <input type="hidden" name="serviceVariantId" value={selectedVariantId} />

        <div className="mt-5 rounded-lg bg-[#fbf7f0] p-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#583d2f]">
            <CalendarClock size={16} aria-hidden="true" />
            Therapist Assignment
          </h3>
          {!staffVisible ? <p className="mt-2 text-sm text-[#5f554d]">Select a service to see eligible staff.</p> : null}
          {selectedIsNail ? <p className="mt-2 text-sm text-[#5f554d]">No nail technician has been added yet. This appointment can be created unassigned.</p> : null}
          {staffVisible && !selectedIsNail ? (
            <>
              <p className="mt-2 text-sm text-[#5f554d]">Assignment is optional, but recommended for non-nail services.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {staffMembers.map((staff) => (
                  <label key={staff.id} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm">
                    <input name="staffIds" type="checkbox" value={staff.id} />
                    {staff.display_name}
                  </label>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <button className="mt-5 rounded-full bg-[#583d2f] px-5 py-3 text-sm font-semibold text-white">Create Appointment</button>
      </section>
    </form>
  );
}

function ServiceVariantCombobox({
  variants,
  selectedVariantId,
  onSelect,
}: {
  variants: ServiceVariantOption[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
}) {
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? null;
  const [query, setQuery] = useState(selectedVariant ? optionLabel(selectedVariant) : "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredVariants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery || (selectedVariant && query === optionLabel(selectedVariant))) {
      return variants;
    }

    return variants.filter((variant) => optionSearchText(variant).includes(normalizedQuery));
  }, [query, selectedVariant, variants]);

  function chooseVariant(variant: ServiceVariantOption) {
    onSelect(variant.id);
    setQuery(optionLabel(variant));
    setIsOpen(false);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => Math.min(current + 1, filteredVariants.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && isOpen && filteredVariants[activeIndex]) {
      event.preventDefault();
      chooseVariant(filteredVariants[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative mt-4">
      <label className="block text-sm font-semibold text-[#583d2f]" htmlFor="service-search">
        Search service
      </label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5f554d]" size={16} aria-hidden="true" />
        <input
          id="service-search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="service-options"
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(0);
            if (selectedVariantId) {
              onSelect("");
            }
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-[#583d2f]/20 bg-[#fbf7f0] py-3 pl-10 pr-4"
          placeholder="Search by service, category, duration or price"
        />
      </div>
      {isOpen ? (
        <div id="service-options" role="listbox" className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-[#583d2f]/10 bg-white shadow-lg">
          {filteredVariants.map((variant, index) => (
            <button
              key={variant.id}
              type="button"
              role="option"
              aria-selected={variant.id === selectedVariantId}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => chooseVariant(variant)}
              className={`block w-full px-4 py-3 text-left text-sm ${index === activeIndex ? "bg-[#d7dfcf]" : "hover:bg-[#fbf7f0]"}`}
            >
              <span className="font-semibold text-[#583d2f]">{optionLabel(variant)}</span>
            </button>
          ))}
          {filteredVariants.length === 0 ? <p className="px-4 py-3 text-sm text-[#5f554d]">No matching services.</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function optionLabel(variant: ServiceVariantOption) {
  return [variant.serviceName, variant.categoryName, variant.durationMinutes ? `${variant.durationMinutes} min` : "", formatGhs(variant.pricePesewas)]
    .filter(Boolean)
    .join(" · ");
}

function optionSearchText(variant: ServiceVariantOption) {
  return [optionLabel(variant), String(variant.pricePesewas / 100), `ghs ${variant.pricePesewas / 100}`].join(" ").toLowerCase();
}

function formatGhs(pesewas: number) {
  return `GHS ${pesewas / 100}`;
}

function getAccraDateTimeParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}
