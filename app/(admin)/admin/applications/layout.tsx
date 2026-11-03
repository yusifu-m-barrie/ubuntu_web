import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/applications/admin-guard";

export default async function ApplicationsAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <AdminShell>{children}</AdminShell>;
}
