import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function listBookableStaff() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role configuration is required for staff data.");
  }

  const { data, error } = await supabase
    .from("staff")
    .select("id, display_name, role_label, profile_image_path, active, bookable, home_service_eligible")
    .eq("active", true)
    .eq("bookable", true)
    .order("display_name");

  if (error) {
    throw error;
  }

  return data ?? [];
}
