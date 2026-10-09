import { adminNotificationEmail, applicantConfirmationEmail } from "@/lib/applications/email-templates";
import {
  adminNotifiedEvent,
  applicantNotifiedEvent,
  hasHistoryId,
  hasHistoryType,
} from "@/lib/applications/history";
import { adminNotifyAddresses, isDeliverableEmail, mailConfigured, sendApplicationEmail } from "@/lib/applications/mail";
import { getApplicationStore } from "@/lib/applications/store";
import type { ApplicationHistoryEvent, ApplicationRecord } from "@/types/application";

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function logNotify(reference: string, message: string) {
  console.error(`[applications] ${reference}: ${message}`);
}

async function persistNotification(id: string, event: ApplicationHistoryEvent) {
  try {
    const store = await getApplicationStore();
    await store.appendHistoryEvent(id, event);
  } catch {
    logNotify(id, "Unable to record that a notification email was sent.");
  }
}

async function sendApplicantConfirmation(record: ApplicationRecord) {
  const event = applicantNotifiedEvent(record.id, new Date().toISOString());
  if (hasHistoryType(record.history, "APPLICANT_NOTIFIED") || hasHistoryId(record.history, event.id)) {
    return { sent: false as const, duplicate: true as const };
  }
  if (!mailConfigured()) {
    return { sent: false as const, duplicate: false as const };
  }
  if (!isDeliverableEmail(record.email)) {
    logNotify(record.applicationReference, "Applicant email address is not deliverable.");
    return { sent: false as const, duplicate: false as const };
  }

  const template = applicantConfirmationEmail(record);
  const result = await sendApplicationEmail({
    to: record.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
    headers: { "X-Entity-Ref-ID": event.id },
  });
  if (!result.sent) {
    if (!result.skipped) logNotify(record.applicationReference, result.error);
    return { sent: false as const, duplicate: false as const };
  }
  await persistNotification(record.id, event);
  return { sent: true as const, duplicate: false as const };
}

async function sendAdminNotification(record: ApplicationRecord) {
  const event = adminNotifiedEvent(record.id, new Date().toISOString());
  if (hasHistoryType(record.history, "ADMIN_NOTIFIED") || hasHistoryId(record.history, event.id)) {
    return { sent: false as const, duplicate: true as const };
  }
  const recipients = adminNotifyAddresses();
  if (!mailConfigured() || !recipients.length) {
    return { sent: false as const, duplicate: false as const };
  }

  const template = adminNotificationEmail(record, `${siteUrl()}/admin/applications/${record.id}`);
  const result = await sendApplicationEmail({
    to: recipients,
    subject: template.subject,
    text: template.text,
    html: template.html,
    replyTo: isDeliverableEmail(record.email) ? record.email : undefined,
    headers: { "X-Entity-Ref-ID": event.id },
  });
  if (!result.sent) {
    if (!result.skipped) logNotify(record.applicationReference, result.error);
    return { sent: false as const, duplicate: false as const };
  }
  await persistNotification(record.id, event);
  return { sent: true as const, duplicate: false as const };
}

export async function notifyApplicationSubmitted(record: ApplicationRecord) {
  try {
    const store = await getApplicationStore();
    const latest = (await store.get(record.id)) || record;
    const applicant = await sendApplicantConfirmation(latest);
    const admin = await sendAdminNotification(latest);
    return { ok: true as const, applicant, admin };
  } catch {
    logNotify(record.applicationReference, "Notification dispatch failed.");
    return { ok: false as const };
  }
}
