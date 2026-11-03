import { AdminHeader } from "@/components/admin/AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-70 print:hidden"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 0%, rgba(238,122,18,0.16), transparent 28%), radial-gradient(circle at 100% 12%, rgba(18,38,58,0.08), transparent 26%)",
        }}
      />
      <AdminHeader />
      <div className="relative mx-auto max-w-[100rem] px-4 py-8 lg:px-6 lg:py-10">{children}</div>
    </div>
  );
}
