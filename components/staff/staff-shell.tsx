import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, LayoutDashboard, Receipt, Scissors, UserPlus, UsersRound } from "lucide-react";

const staffLinks = [
  ["/staff/dashboard", "Dashboard", LayoutDashboard],
  ["/staff/appointments", "Appointments", CalendarCheck],
  ["/staff/walk-ins/new", "New Walk-In", UserPlus],
  ["/staff/customers", "Customers", UsersRound],
  ["/staff/services", "Services", Scissors],
  ["/staff/team", "Team", UsersRound],
  ["/staff/receipts/demo", "Receipt", Receipt],
] as const;

export function StaffShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#221f1a]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#583d2f]/10 bg-white p-5 lg:block">
        <Link href="/staff/dashboard" className="flex items-center gap-3">
          <Image src="/brand/serenity-haven-logo.jpeg" alt="Serenity Haven Spa logo" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <div>
            <p className="serif text-xl font-semibold text-[#583d2f]">Serenity Desk</p>
            <p className="text-xs text-[#5f554d]">Staff Operations</p>
          </div>
        </Link>
        <nav className="mt-8 space-y-1">
          {staffLinks.map(([href, label, Icon]) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#583d2f] hover:bg-[#d7dfcf]">
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="border-b border-[#583d2f]/10 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#583d2f]">Serenity Desk</p>
        </header>
        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
