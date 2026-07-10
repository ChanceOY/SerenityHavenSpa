import { PublicFooter } from "@/components/public/footer";
import { PublicNav } from "@/components/public/public-nav";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#fbf7f0]">
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
