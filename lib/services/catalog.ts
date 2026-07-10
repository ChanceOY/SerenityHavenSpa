import type { LocationType, Service, ServiceCategoryName, ServiceVariant } from "@/lib/types";

export const serviceCategories: ServiceCategoryName[] = [
  "Massage",
  "Four Hands Massage",
  "Signature Massage Combos",
  "Couples Massage",
  "Focused Massage",
  "Nails",
  "Facials",
  "Waxing",
  "Body Treatments",
];

type SeedVariant = {
  locationType: LocationType;
  durationMinutes: number | null;
  priceGhs: number;
};

type SeedService = {
  name: string;
  category: ServiceCategoryName;
  description?: string;
  variants: SeedVariant[];
};

const spa = (durationMinutes: number | null, priceGhs: number): SeedVariant => ({
  locationType: "SPA",
  durationMinutes,
  priceGhs,
});

const home = (durationMinutes: number | null, priceGhs: number): SeedVariant => ({
  locationType: "HOME",
  durationMinutes,
  priceGhs,
});

const seedServices: SeedService[] = [
  {
    name: "Swedish Massage",
    category: "Massage",
    variants: [spa(60, 200), spa(90, 300), spa(120, 400), home(90, 550)],
  },
  {
    name: "Deep Tissue Massage",
    category: "Massage",
    variants: [spa(60, 250), spa(90, 350), spa(120, 500), home(90, 650)],
  },
  {
    name: "Hot Stone Massage",
    category: "Massage",
    variants: [spa(60, 300), spa(90, 400), spa(120, 580), home(90, 700)],
  },
  {
    name: "Thai Massage",
    category: "Massage",
    variants: [spa(60, 300), spa(90, 400), spa(120, 580), home(90, 750)],
  },
  {
    name: "Four Hands Swedish Massage",
    category: "Four Hands Massage",
    variants: [spa(60, 400), spa(90, 550), spa(120, 750)],
  },
  {
    name: "Four Hands Deep Tissue Massage",
    category: "Four Hands Massage",
    variants: [spa(60, 500), spa(90, 650), spa(120, 880)],
  },
  {
    name: "Four Hands Hot Stone Massage",
    category: "Four Hands Massage",
    variants: [spa(60, 600), spa(90, 750), spa(120, 950)],
  },
  {
    name: "Four Hands Thai Massage",
    category: "Four Hands Massage",
    variants: [spa(60, 600), spa(90, 750), spa(120, 950)],
  },
  {
    name: "Four Hands Soli Massage",
    category: "Four Hands Massage",
    description: "Combination of Deep Tissue, Thai and Hot Stone",
    variants: [spa(60, 700), spa(90, 850), spa(120, 1300)],
  },
  {
    name: "Four Hands Elixir Massage",
    category: "Four Hands Massage",
    description: "Combination of Swedish and Hot Stone",
    variants: [spa(60, 550), spa(90, 680), spa(120, 1000)],
  },
  {
    name: "Four Hands Scintilla Massage",
    category: "Four Hands Massage",
    description: "Combination of Swedish and Deep Tissue",
    variants: [spa(60, 550), spa(90, 630), spa(120, 950)],
  },
  {
    name: "Soli Massage",
    category: "Signature Massage Combos",
    description: "Deep Tissue + Thai + Hot Stone",
    variants: [spa(60, 350), spa(90, 450), spa(120, 600), home(90, 800)],
  },
  {
    name: "Elixir Massage",
    category: "Signature Massage Combos",
    description: "Swedish + Hot Stone",
    variants: [spa(60, 250), spa(90, 350), spa(120, 480), home(90, 600)],
  },
  {
    name: "Scintilla Massage",
    category: "Signature Massage Combos",
    description: "Swedish + Deep Tissue",
    variants: [spa(60, 300), spa(90, 400), spa(120, 550), home(90, 650)],
  },
  {
    name: "Moon Walk",
    category: "Couples Massage",
    description: "Swedish massage for both",
    variants: [spa(60, 400), spa(90, 550), spa(120, 750)],
  },
  {
    name: "Rosy Massage",
    category: "Couples Massage",
    description: "Swedish + Deep Tissue",
    variants: [spa(60, 500), spa(90, 650), spa(120, 850)],
  },
  {
    name: "Solace Massage",
    category: "Couples Massage",
    description: "Hot Stone + Deep Tissue",
    variants: [spa(60, 600), spa(90, 700), spa(120, 1000)],
  },
  {
    name: "Soothing Massage",
    category: "Couples Massage",
    description: "Deep Tissue + Soli",
    variants: [spa(60, 680), spa(90, 830), spa(120, 1200)],
  },
  {
    name: "Repose Massage",
    category: "Couples Massage",
    description: "Elixir for both",
    variants: [spa(60, 480), spa(90, 600), spa(120, 800)],
  },
  {
    name: "Back Massage",
    category: "Focused Massage",
    variants: [spa(40, 150), home(40, 400)],
  },
  {
    name: "Reflexology",
    category: "Focused Massage",
    variants: [spa(40, 150), home(40, 400)],
  },
  {
    name: "Head Massage",
    category: "Focused Massage",
    variants: [spa(40, 100), home(40, 200)],
  },
  {
    name: "Head, Neck & Shoulder Massage",
    category: "Focused Massage",
    variants: [spa(40, 150), home(40, 400)],
  },
  {
    name: "Classic Facial",
    category: "Facials",
    variants: [spa(null, 350), home(null, 500)],
  },
  {
    name: "Basic Facial",
    category: "Facials",
    variants: [spa(null, 280), home(null, 400)],
  },
  {
    name: "Bikini Line Waxing",
    category: "Waxing",
    variants: [spa(null, 200), home(null, 350)],
  },
  {
    name: "Armpit Waxing",
    category: "Waxing",
    variants: [spa(null, 120), home(null, 240)],
  },
  {
    name: "Beard Waxing",
    category: "Waxing",
    variants: [spa(null, 120), home(null, 200)],
  },
  {
    name: "Arm Waxing",
    category: "Waxing",
    variants: [spa(null, 250), home(null, 400)],
  },
  {
    name: "Thigh Waxing",
    category: "Waxing",
    variants: [spa(null, 300), home(null, 600)],
  },
  {
    name: "Body Scrub",
    category: "Body Treatments",
    variants: [spa(null, 300), home(null, 500)],
  },
  {
    name: "Body Scrub & Steaming",
    category: "Body Treatments",
    variants: [spa(null, 400), home(null, 650)],
  },
  {
    name: "Manicure",
    category: "Nails",
    variants: [spa(null, 50), home(null, 100)],
  },
  {
    name: "Pedicure",
    category: "Nails",
    variants: [spa(null, 120), home(null, 250)],
  },
  {
    name: "Stickons",
    category: "Nails",
    variants: [spa(null, 100)],
  },
  {
    name: "Stickons & French Tip",
    category: "Nails",
    variants: [spa(null, 120)],
  },
  {
    name: "Stickon & Art with Rhinestones",
    category: "Nails",
    variants: [spa(null, 140)],
  },
  {
    name: "Stickon Toes with Gel Polish",
    category: "Nails",
    variants: [spa(null, 80)],
  },
  {
    name: "Plain Set Acrylic - Short",
    category: "Nails",
    variants: [spa(null, 140)],
  },
  {
    name: "Plain Set Acrylic - Long",
    category: "Nails",
    variants: [spa(null, 150)],
  },
  {
    name: "Plain Set Acrylic - X Long",
    category: "Nails",
    variants: [spa(null, 180)],
  },
  {
    name: "Ombre Set",
    category: "Nails",
    variants: [spa(null, 170)],
  },
  {
    name: "Marble Set",
    category: "Nails",
    variants: [spa(null, 175)],
  },
  {
    name: "Gel Nails",
    category: "Nails",
    variants: [spa(null, 150)],
  },
  {
    name: "Pedicure with Gel Polish",
    category: "Nails",
    variants: [spa(null, 150)],
  },
  {
    name: "Four Hands Massage",
    category: "Four Hands Massage",
    description: "Home-service four hands massage request",
    variants: [home(90, 900)],
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const services: Service[] = seedServices.map((service) => {
  const serviceId = slugify(service.name);
  const variants: ServiceVariant[] = service.variants.map((variant, index) => ({
    id: `${serviceId}-${variant.locationType.toLowerCase()}-${variant.durationMinutes ?? "duration-tbd"}-${index}`,
    serviceId,
    locationType: variant.locationType,
    durationMinutes: variant.durationMinutes,
    pricePesewas: variant.priceGhs * 100,
  }));

  return {
    id: serviceId,
    name: service.name,
    category: service.category,
    description: service.description,
    active: true,
    variants,
  };
});

export function formatMoney(pesewas: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(pesewas / 100);
}

export function formatDuration(durationMinutes: number | null): string {
  return durationMinutes === null ? "" : `${durationMinutes} min`;
}

export function formatPublicVariantLabel(durationMinutes: number | null): string {
  return durationMinutes === null ? "" : `${durationMinutes} min`;
}

export function getServiceById(serviceId: string): Service | undefined {
  return services.find((service) => service.id === serviceId);
}

export function getVariantById(variantId: string): ServiceVariant | undefined {
  return services.flatMap((service) => service.variants).find((variant) => variant.id === variantId);
}

export function servicesForLocation(locationType: LocationType): Service[] {
  return services
    .map((service) => ({
      ...service,
      variants: service.variants.filter((variant) => variant.locationType === locationType),
    }))
    .filter((service) => service.variants.length > 0);
}

export function categoryHasNailServices(category: ServiceCategoryName): boolean {
  return category === "Nails";
}
