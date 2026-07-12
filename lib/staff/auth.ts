import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedRoles = new Set(["ADMIN", "RECEPTION"]);

export type StaffSession = {
  userId: string;
  email: string | null;
  role: "ADMIN" | "RECEPTION";
  displayName: string | null;
};

export async function getStaffSession(): Promise<StaffSession | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from("profiles").select("role, display_name").eq("id", user.id).maybeSingle();

  if (!profile || !allowedRoles.has(profile.role)) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    role: profile.role as "ADMIN" | "RECEPTION",
    displayName: profile.display_name,
  };
}

export async function requireStaffSession(): Promise<StaffSession> {
  const session = await getStaffSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
