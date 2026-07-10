"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, MapPin, UserRound } from "lucide-react";
import { submitBookingRequest, type BookingActionState } from "@/app/(public)/book/actions";
import { calculateAvailability } from "@/lib/availability/availability";
import { sampleAppointments } from "@/lib/appointments/sample-data";
import { formatDuration, formatMoney, getServiceById, getVariantById, serviceCategories, servicesForLocation } from "@/lib/services/catalog";
import { getEligibleStaff, requiresStaffSelection, staffSelectionNote } from "@/lib/staff/staff";
import type { LocationType, ServiceCategoryName } from "@/lib/types";

const emptyAvailability: [] = [];
const allServicesCategory = "ALL";
const categoryOptions = [
  { id: allServicesCategory, label: "All Services" },
  ...serviceCategories.map((category) => ({ id: category, label: category })),
] as const;

type BookingCategory = ServiceCategoryName | typeof allServicesCategory | "";
type StepId = "location" | "category" | "service" | "duration" | "therapist" | "date" | "time" | "details" | "summary";

type BookingDraft = {
  locationType: LocationType;
  category: BookingCategory;
  serviceId: string;
  variantId: string;
  preferredStaffId: string;
  requestedDate: string;
  requestedTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  area: string;
  address: string;
  landmark: string;
  locationNotes: string;
};

const initialDraft: BookingDraft = {
  locationType: "SPA",
  category: "",
  serviceId: "",
  variantId: "",
  preferredStaffId: "no-preference",
  requestedDate: "",
  requestedTime: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  notes: "",
  area: "",
  address: "",
  landmark: "",
  locationNotes: "",
};

const stepLabels: Record<StepId, string> = {
  location: "Location",
  category: "Category",
  service: "Service",
  duration: "Duration",
  therapist: "Therapist",
  date: "Date",
  time: "Time",
  details: "Details",
  summary: "Summary",
};

export function BookingFlow({ initialLocation, initialServiceId }: { initialLocation?: LocationType; initialServiceId?: string }) {
  const initialService = initialServiceId ? getServiceById(initialServiceId) : undefined;
  const initialServiceIsValid = Boolean(
    initialService && (!initialLocation || initialService.variants.some((variant) => variant.locationType === initialLocation)),
  );
  const [locationLocked, setLocationLocked] = useState(Boolean(initialLocation));
  const [draft, setDraft] = useState<BookingDraft>({
    ...initialDraft,
    locationType: initialLocation ?? "SPA",
    category: initialServiceIsValid && initialService ? initialService.category : "",
    serviceId: initialServiceIsValid && initialService ? initialService.id : "",
  });
  const [step, setStep] = useState<StepId>(initialLocation ? (initialServiceIsValid ? "duration" : "category") : "location");
  const [result, setResult] = useState<BookingActionState | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedService = draft.serviceId ? getServiceById(draft.serviceId) : undefined;
  const selectedVariant = draft.variantId ? getVariantById(draft.variantId) : undefined;
  const availableServices = useMemo(() => {
    if (!draft.category) {
      return [];
    }

    const locationServices = servicesForLocation(draft.locationType);
    return draft.category === allServicesCategory ? locationServices : locationServices.filter((service) => service.category === draft.category);
  }, [draft.category, draft.locationType]);
  const eligibleStaff = selectedService ? getEligibleStaff(selectedService, draft.locationType) : [];
  const availability = selectedVariant
    ? calculateAvailability({
        staff: eligibleStaff,
        variant: selectedVariant,
        dateIso: draft.requestedDate || new Date().toISOString().slice(0, 10),
        availability: emptyAvailability,
        appointments: sampleAppointments,
      })
    : null;
  const baseSteps: StepId[] = locationLocked
    ? ["category", "service", "duration", "therapist", "date", "time", "details", "summary"]
    : ["location", "category", "service", "duration", "therapist", "date", "time", "details", "summary"];
  const activeSteps: StepId[] = selectedService && !requiresStaffSelection(selectedService) ? baseSteps.filter((item) => item !== "therapist") : baseSteps;

  const currentStep = activeSteps.includes(step) ? step : activeSteps[0];
  const currentStepIndex = activeSteps.indexOf(currentStep);

  function update(patch: Partial<BookingDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function goNext() {
    setStep(activeSteps[Math.min(currentStepIndex + 1, activeSteps.length - 1)]);
  }

  function goBack() {
    setStep(activeSteps[Math.max(currentStepIndex - 1, 0)]);
  }

  function changeLocation() {
    setLocationLocked(false);
    setResult(null);
    update({ category: "", serviceId: "", variantId: "", preferredStaffId: "no-preference" });
    setStep("location");
  }

  function variantTitle(durationMinutes: number | null, pricePesewas: number) {
    return [durationMinutes === null ? "" : `${durationMinutes} min`, formatMoney(pricePesewas)].filter(Boolean).join(" / ");
  }

  function submit() {
    startTransition(async () => {
      const response = await submitBookingRequest(draft);
      setResult(response);
    });
  }

  if (result?.ok) {
    const service = getServiceById(result.data.serviceId);
    const variant = getVariantById(result.data.variantId);
    const staff = eligibleStaff.find((member) => member.id === result.data.preferredStaffId);

    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d7dfcf] text-[#583d2f]">
          <Check size={24} aria-hidden="true" />
        </div>
        <h2 className="serif mt-5 text-4xl font-semibold text-[#583d2f]">Booking request received.</h2>
        <p className="mt-3 text-sm leading-6 text-[#5f554d]">
          Reference <strong>{result.bookingReference}</strong>. Serenity Haven staff will review and confirm your appointment.
        </p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <SummaryItem label="Service" value={service?.name ?? "Selected service"} />
          <SummaryItem label="Location" value={result.data.locationType === "SPA" ? "Visit the Spa" : "Home Service"} />
          <SummaryItem label="Date/time requested" value={`${result.data.requestedDate} at ${result.data.requestedTime}`} />
          <SummaryItem label="Therapist preference" value={staff?.displayName ?? "No Preference / staff assigned"} />
          <SummaryItem label="Timing" value={variant?.durationMinutes ? formatDuration(variant.durationMinutes) : "Staff will confirm"} />
          <SummaryItem label="Status" value="Pending confirmation" />
        </dl>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-lg bg-white p-4">
        <div className="mb-4 rounded-md bg-[#fbf7f0] p-3 text-sm">
          <p className="font-semibold text-[#583d2f]">{draft.locationType === "SPA" ? "Visit the Spa" : "Home Service"}</p>
          {selectedService ? <p className="mt-1 text-[#5f554d]">{selectedService.name}</p> : null}
          {locationLocked ? (
            <button type="button" onClick={changeLocation} className="mt-2 text-xs font-semibold text-[#583d2f] underline underline-offset-4">
              Change booking type
            </button>
          ) : null}
        </div>
        <ol className="space-y-2">
          {activeSteps.map((stepId, index) => (
            <li key={stepId} className={`rounded-md px-3 py-2 text-sm ${stepId === currentStep ? "bg-[#d7dfcf] font-semibold text-[#583d2f]" : "text-[#5f554d]"}`}>
              {index + 1}. {stepLabels[stepId]}
            </li>
          ))}
        </ol>
      </aside>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        {currentStep === "location" ? (
          <Panel title="Where would you like your service?">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["SPA", "Visit the Spa", "Book an in-spa appointment request."],
                ["HOME", "Home Service", "Request a therapist to come to your location."],
              ].map(([value, label, text]) => (
                <ChoiceButton
                  key={value}
                  selected={draft.locationType === value}
                  onClick={() => update({ locationType: value as LocationType, category: "", serviceId: "", variantId: "", preferredStaffId: "no-preference" })}
                  title={label}
                  text={text}
                />
              ))}
            </div>
          </Panel>
        ) : null}

        {currentStep === "category" ? (
          <Panel title="Choose a service category">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {categoryOptions.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => update({ category: category.id, serviceId: "", variantId: "", preferredStaffId: "no-preference" })}
                  className={`min-h-24 rounded-lg border p-4 text-left font-semibold ${
                    draft.category === category.id ? "border-[#583d2f] bg-[#d7dfcf] text-[#583d2f]" : "border-[#583d2f]/10 bg-[#fbf7f0] text-[#5f554d]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </Panel>
        ) : null}

        {currentStep === "service" ? (
          <Panel title="Select a service">
            <div className="grid gap-3">
              {availableServices.map((service) => (
                <ChoiceButton
                  key={service.id}
                  selected={draft.serviceId === service.id}
                  onClick={() => update({ category: draft.category || service.category, serviceId: service.id, variantId: "", preferredStaffId: "no-preference" })}
                  title={service.name}
                  text={service.description ?? service.category}
                />
              ))}
            </div>
          </Panel>
        ) : null}

        {currentStep === "duration" ? (
          <Panel title="Choose duration and price">
            <div className="grid gap-3">
              {selectedService?.variants
                .filter((variant) => variant.locationType === draft.locationType)
                .map((variant) => (
                  <ChoiceButton
                    key={variant.id}
                    selected={draft.variantId === variant.id}
                    onClick={() => update({ variantId: variant.id })}
                    title={variantTitle(variant.durationMinutes, variant.pricePesewas)}
                    text={variant.durationMinutes === null ? "Staff will confirm timing manually because this service does not yet have a configured length." : variant.locationType}
                  />
                ))}
            </div>
          </Panel>
        ) : null}

        {currentStep === "therapist" ? (
          <Panel title="Therapist preference">
            {selectedService ? <p className="mb-4 text-sm leading-6 text-[#5f554d]">{staffSelectionNote(selectedService)}</p> : null}
            {selectedService && requiresStaffSelection(selectedService) ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <button
                  type="button"
                  onClick={() => update({ preferredStaffId: "no-preference" })}
                  className={`min-h-40 rounded-lg border p-3 text-center ${
                    draft.preferredStaffId === "no-preference" ? "border-[#583d2f] bg-[#d7dfcf]" : "border-[#583d2f]/10 bg-[#fbf7f0]"
                  }`}
                >
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#583d2f] md:h-24 md:w-24">
                    <UserRound size={32} aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-sm font-semibold text-[#583d2f]">No Preference</span>
                </button>
                {eligibleStaff.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => update({ preferredStaffId: member.id })}
                    className={`rounded-lg border p-3 text-center ${
                      draft.preferredStaffId === member.id ? "border-[#583d2f] bg-[#d7dfcf]" : "border-[#583d2f]/10 bg-[#fbf7f0]"
                    }`}
                  >
                    <Image
                      src={member.profileImage}
                      alt={`${member.displayName}, ${member.roleLabel}`}
                      width={104}
                      height={104}
                      className="mx-auto h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
                    />
                    <span className="mt-3 block text-sm font-semibold text-[#583d2f]">{member.displayName}</span>
                    <span className="block text-xs text-[#5f554d]">{member.roleLabel}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-[#fbf7f0] p-4 text-sm text-[#5f554d]">Staff assignment will be handled by Serenity Haven.</div>
            )}
          </Panel>
        ) : null}

        {currentStep === "date" ? (
          <Panel title="Choose a date">
            <label className="block text-sm font-semibold text-[#583d2f]" htmlFor="requestedDate">
              Preferred date
            </label>
            <input
              id="requestedDate"
              type="date"
              value={draft.requestedDate}
              onChange={(event) => update({ requestedDate: event.target.value })}
              className="mt-2 w-full rounded-md border border-[#583d2f]/20 bg-[#fbf7f0] px-4 py-3"
            />
          </Panel>
        ) : null}

        {currentStep === "time" ? (
          <Panel title={availability?.mode === "SLOTS" ? "Choose an available time" : "Request a preferred time"}>
            {availability ? <p className="mb-4 text-sm leading-6 text-[#5f554d]">{availability.reason}</p> : null}
            {availability?.mode === "SLOTS" ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {availability.slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => update({ requestedTime: slot })}
                    className={`rounded-md px-4 py-3 text-sm font-semibold ${
                      draft.requestedTime === slot ? "bg-[#583d2f] text-white" : "bg-[#fbf7f0] text-[#583d2f]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-[#583d2f]" htmlFor="requestedTime">
                  Preferred time
                </label>
                <input
                  id="requestedTime"
                  type="time"
                  value={draft.requestedTime}
                  onChange={(event) => update({ requestedTime: event.target.value })}
                  className="mt-2 w-full rounded-md border border-[#583d2f]/20 bg-[#fbf7f0] px-4 py-3"
                />
              </div>
            )}
          </Panel>
        ) : null}

        {currentStep === "details" ? (
          <Panel title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" value={draft.customerName} onChange={(value) => update({ customerName: value })} />
              <TextField label="Phone" value={draft.customerPhone} onChange={(value) => update({ customerPhone: value })} />
              <TextField label="Email" value={draft.customerEmail} onChange={(value) => update({ customerEmail: value })} />
              <TextField label="Notes" value={draft.notes} onChange={(value) => update({ notes: value })} />
              {draft.locationType === "HOME" ? (
                <>
                  <TextField label="Area" value={draft.area} onChange={(value) => update({ area: value })} />
                  <TextField label="Address" value={draft.address} onChange={(value) => update({ address: value })} />
                  <TextField label="Landmark" value={draft.landmark} onChange={(value) => update({ landmark: value })} />
                  <TextField label="Location notes" value={draft.locationNotes} onChange={(value) => update({ locationNotes: value })} />
                </>
              ) : null}
            </div>
          </Panel>
        ) : null}

        {currentStep === "summary" ? (
          <Panel title="Review request">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <SummaryItem label="Location" value={draft.locationType === "SPA" ? "Visit the Spa" : "Home Service"} />
              <SummaryItem label="Service" value={selectedService?.name ?? "Not selected"} />
              <SummaryItem label="Timing" value={selectedVariant?.durationMinutes ? formatDuration(selectedVariant.durationMinutes) : "Staff will confirm"} />
              <SummaryItem label="Price" value={selectedVariant ? formatMoney(selectedVariant.pricePesewas) : "Not selected"} />
              <SummaryItem label="Date/time" value={`${draft.requestedDate || "Date needed"} ${draft.requestedTime || "Time needed"}`} />
              <SummaryItem label="Status after submission" value="Pending confirmation" />
            </dl>
            {result && !result.ok ? <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{result.message}</p> : null}
          </Panel>
        ) : null}

        <div className="mt-8 flex items-center justify-between border-t border-[#583d2f]/10 pt-5">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#583d2f] disabled:opacity-35"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {currentStepIndex < activeSteps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-full bg-[#583d2f] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-[#583d2f] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Clock size={16} /> {isPending ? "Submitting..." : "Submit Request"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="serif text-3xl font-semibold text-[#583d2f]">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ChoiceButton({ selected, onClick, title, text }: { selected: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${
        selected ? "border-[#583d2f] bg-[#d7dfcf]" : "border-[#583d2f]/10 bg-[#fbf7f0] hover:bg-[#efe4d4]"
      }`}
    >
      <span className="block font-semibold text-[#583d2f]">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-[#5f554d]">{text}</span>
    </button>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="block text-sm font-semibold text-[#583d2f]" htmlFor={id}>
      {label}
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-[#583d2f]/20 bg-[#fbf7f0] px-4 py-3 font-normal text-[#221f1a]"
      />
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#fbf7f0] p-4">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#62705a]">
        <MapPin size={13} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-[#583d2f]">{value}</dd>
    </div>
  );
}
