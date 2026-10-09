import { fullName } from "@/lib/applications/reference";
import type { ApplicationRecord } from "@/types/application";

const BRAND = "Ubuntu Tech Africa";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatSubmissionDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Freetown",
  }).format(date);
}

function applicantName(record: ApplicationRecord) {
  return fullName(record.firstName, record.lastName, record.middleName);
}

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f1e8;font-family:Georgia,'Times New Roman',serif;color:#12263a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e8;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#12263a;padding:24px 28px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#ee7a12;">${escapeHtml(BRAND)}</p>
                <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;color:#f6f1e8;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#12263a;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#5c6b7a;">
                ${escapeHtml(BRAND)} · Makeni, Sierra Leone
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:#5c6b7a;width:40%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;font-size:15px;color:#12263a;vertical-align:top;"><strong>${escapeHtml(value)}</strong></td>
  </tr>`;
}

export function applicantConfirmationEmail(record: ApplicationRecord) {
  const name = applicantName(record);
  const submitted = formatSubmissionDate(record.submittedAt);
  const subject = `Application Received — ${record.applicationReference}`;
  const text = [
    BRAND,
    "",
    "Application Received",
    "",
    `Dear ${record.firstName},`,
    "",
    `Thank you for applying to ${BRAND}. We have received your application.`,
    "",
    `Applicant name: ${name}`,
    `Programme: ${record.programme}`,
    `Application reference: ${record.applicationReference}`,
    `Submission date: ${submitted}`,
    "",
    "Our team will review your application. This process may take some time. We will contact you using the email address you provided if we need more information or when an update is available.",
    "",
    "Please keep your application reference number for all future correspondence. Do not reply to this message with documents or personal files.",
    "",
    BRAND,
  ].join("\n");

  const html = layout(
    "Application Received",
    `
      <p style="margin:0 0 16px;">Dear ${escapeHtml(record.firstName)},</p>
      <p style="margin:0 0 16px;">Thank you for applying to ${escapeHtml(BRAND)}. We have received your application.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-top:1px solid #eadfce;border-bottom:1px solid #eadfce;">
        ${detailRow("Applicant name", name)}
        ${detailRow("Programme", record.programme)}
        ${detailRow("Application reference", record.applicationReference)}
        ${detailRow("Submission date", submitted)}
      </table>
      <p style="margin:0 0 16px;">Our team will review your application. This process may take some time. We will contact you using the email address you provided if we need more information or when an update is available.</p>
      <p style="margin:0;">Please keep your application reference number for all future correspondence. Do not reply to this message with documents or personal files.</p>
    `,
  );

  return { subject, text, html };
}

export function adminNotificationEmail(record: ApplicationRecord, reviewUrl: string) {
  const name = applicantName(record);
  const submitted = formatSubmissionDate(record.submittedAt);
  const subject = `New application ${record.applicationReference} — ${name}`;
  const text = [
    BRAND,
    "",
    "A new graduate/postgraduate application has been submitted.",
    "",
    `Applicant name: ${name}`,
    `Email: ${record.email}`,
    `Phone: ${record.phone}`,
    `Programme: ${record.programme}`,
    `Field of study: ${record.fieldOfStudy}`,
    `Institution: ${record.institution}`,
    `Application reference: ${record.applicationReference}`,
    `Submission date: ${submitted}`,
    "",
    `Review in the admin dashboard: ${reviewUrl}`,
    "",
    "Uploaded documents are not attached to this email. Open the application in the admin dashboard to review files.",
  ].join("\n");

  const html = layout(
    "New application submitted",
    `
      <p style="margin:0 0 16px;">A new graduate/postgraduate application has been submitted.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-top:1px solid #eadfce;border-bottom:1px solid #eadfce;">
        ${detailRow("Applicant name", name)}
        ${detailRow("Email", record.email)}
        ${detailRow("Phone", record.phone)}
        ${detailRow("Programme", record.programme)}
        ${detailRow("Field of study", record.fieldOfStudy)}
        ${detailRow("Institution", record.institution)}
        ${detailRow("Application reference", record.applicationReference)}
        ${detailRow("Submission date", submitted)}
      </table>
      <p style="margin:0 0 16px;"><a href="${escapeHtml(reviewUrl)}" style="color:#ee7a12;">Open this application in the admin dashboard</a></p>
      <p style="margin:0;">Uploaded documents are not attached to this email. Open the application in the admin dashboard to review files.</p>
    `,
  );

  return { subject, text, html };
}
