"use server";

import { getAdminSession } from "@/lib/applications/admin-guard";
import { isSafeApplicationId } from "@/lib/applications/file-types";
import { addAdminNotes, updateApplicationStatus } from "@/lib/applications/service";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatusAction(formData: FormData) {
  if (!(await getAdminSession())) {
    return { ok: false as const, error: "Unauthorized." };
  }
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!isSafeApplicationId(id)) {
    return { ok: false as const, error: "Invalid application." };
  }
  try {
    await updateApplicationStatus(id, { status });
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Unable to update status." };
  }
}

export async function addAdminNoteAction(formData: FormData) {
  if (!(await getAdminSession())) {
    return { ok: false as const, error: "Unauthorized." };
  }
  const id = String(formData.get("id") || "");
  const notes = String(formData.get("notes") || "");
  if (!isSafeApplicationId(id)) {
    return { ok: false as const, error: "Invalid application." };
  }
  try {
    await addAdminNotes(id, { notes });
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Unable to save notes." };
  }
}
