import { requireAdminPage } from "@/lib/applications/admin-guard";
import { redirect } from "next/navigation";

export default async function AdminIndex() {
  await requireAdminPage();
  redirect("/admin/applications");
}
