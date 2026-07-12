import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LocationType } from "@/lib/types";

export type ServiceVariantOption = {
  id: string;
  serviceName: string;
  categoryName: string;
  locationType: LocationType;
  durationMinutes: number | null;
  pricePesewas: number;
};

export async function listServiceVariantOptions(locationType?: LocationType) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role configuration is required for service data.");
  }

  let query = supabase
    .from("service_variants")
    .select("id, location_type, duration_minutes, price_pesewas, services!inner(name, service_categories!inner(name))")
    .eq("active", true)
    .order("price_pesewas", { ascending: true });

  if (locationType) {
    query = query.eq("location_type", locationType);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const service = Array.isArray(row.services) ? row.services[0] : row.services;
    const category = Array.isArray(service.service_categories) ? service.service_categories[0] : service.service_categories;

    return {
      id: row.id,
      serviceName: service.name,
      categoryName: category.name,
      locationType: row.location_type,
      durationMinutes: row.duration_minutes,
      pricePesewas: row.price_pesewas,
    } satisfies ServiceVariantOption;
  });
}
