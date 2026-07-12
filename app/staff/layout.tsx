import { StaffShell } from "@/components/staff/staff-shell";
import { requireStaffSession } from "@/lib/staff/auth";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  await requireStaffSession();

  return <StaffShell>{children}</StaffShell>;
}
