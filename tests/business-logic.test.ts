import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canTransitionAppointmentStatus } from "../lib/appointments/status.ts";
import { databaseVariantMatchesCatalogSelection, validatePreferredStaffSelection } from "../lib/bookings/validation.ts";
import { normalizeGhanaPhone } from "../lib/customers/phone.ts";
import { formatMoney, getServiceById } from "../lib/services/catalog.ts";

describe("online booking variant validation", () => {
  it("matches a null-duration nail service with the correct price", () => {
    const service = getServiceById("stickons");
    const variant = service?.variants.find((item) => item.locationType === "SPA" && item.durationMinutes === null && item.pricePesewas === 10000);

    assert.ok(service);
    assert.ok(variant);
    assert.equal(
      databaseVariantMatchesCatalogSelection({
        serviceName: "Stickons",
        serviceActive: true,
        variantActive: true,
        locationType: "SPA",
        durationMinutes: null,
        pricePesewas: 10000,
        selectedService: service,
        selectedVariant: variant,
      }),
      true,
    );
  });

  it("does not match a null-duration service with the wrong price", () => {
    const service = getServiceById("classic-facial");
    const variant = service?.variants.find((item) => item.locationType === "SPA");

    assert.ok(service);
    assert.ok(variant);
    assert.equal(
      databaseVariantMatchesCatalogSelection({
        serviceName: "Classic Facial",
        serviceActive: true,
        variantActive: true,
        locationType: "SPA",
        durationMinutes: null,
        pricePesewas: 99999,
        selectedService: service,
        selectedVariant: variant,
      }),
      false,
    );
  });

  it("accepts no therapist for nail services", () => {
    const service = getServiceById("stickons");

    assert.ok(service);
    assert.equal(validatePreferredStaffSelection({ service, locationType: "SPA", preferredStaffId: null }), null);
  });

  it("rejects current therapists for nail services", () => {
    const service = getServiceById("stickons");

    assert.ok(service);
    assert.throws(() => validatePreferredStaffSelection({ service, locationType: "SPA", preferredStaffId: "ruby" }));
  });
});

describe("phone normalisation", () => {
  it("normalises local Ghana numbers", () => {
    assert.equal(normalizeGhanaPhone("054 163 9802"), "+233541639802");
  });

  it("normalises country-code Ghana numbers", () => {
    assert.equal(normalizeGhanaPhone("233-541-639-802"), "+233541639802");
    assert.equal(normalizeGhanaPhone("+233541639802"), "+233541639802");
  });

  it("rejects invalid numbers", () => {
    assert.throws(() => normalizeGhanaPhone("12345"));
  });
});

describe("appointment status transitions", () => {
  it("allows the V1 lifecycle", () => {
    assert.equal(canTransitionAppointmentStatus("PENDING", "CONFIRMED"), true);
    assert.equal(canTransitionAppointmentStatus("CONFIRMED", "CHECKED_IN"), true);
    assert.equal(canTransitionAppointmentStatus("CHECKED_IN", "IN_PROGRESS"), true);
  });

  it("blocks arbitrary jumps", () => {
    assert.equal(canTransitionAppointmentStatus("PENDING", "COMPLETED"), false);
    assert.equal(canTransitionAppointmentStatus("PENDING", "NO_SHOW"), false);
    assert.equal(canTransitionAppointmentStatus("IN_PROGRESS", "COMPLETED"), false);
  });
});

describe("money formatting", () => {
  it("formats pesewas as GHS", () => {
    assert.equal(formatMoney(35000), "GH₵350");
  });
});
