import { displayFieldOfStudy } from "@/lib/applications/constants";
import { fullName } from "@/lib/applications/reference";
import type { ApplicationRecord } from "@/types/application";

const BRAND = "Ubuntu Tech Afrika";

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
    "Thank you for applying to Ubuntu Postgraduate Training 2026. We have received your application.",
    "",
    `Applicant name: ${name}`,
    `Programme: ${record.programme}`,
    `District: ${record.district}`,
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
      <p style="margin:0 0 16px;">Thank you for applying to Ubuntu Postgraduate Training 2026. We have received your application.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-top:1px solid #eadfce;border-bottom:1px solid #eadfce;">
        ${detailRow("Applicant name", name)}
        ${detailRow("Programme", record.programme)}
        ${detailRow("District", record.district)}
        ${detailRow("Application reference", record.applicationReference)}
        ${detailRow("Submission date", submitted)}
      </table>
      <p style="margin:0 0 16px;">Our team will review your application. This process may take some time. We will contact you using the email address you provided if we need more information or when an update is available.</p>
      <p style="margin:0;">Please keep your application reference number for all future correspondence. Do not reply to this message with documents or personal files.</p>
    `,
  );

  return { subject, text, html };
}

export function applicantShortlistedEmail(record: ApplicationRecord) {
  const name = applicantName(record);
  const programme = "Ubuntu Postgraduate Training 2026";
  const subject = `You have been shortlisted — ${record.applicationReference}`;
  const text = [
    BRAND,
    "",
    "Application shortlisted",
    "",
    `Dear ${record.firstName},`,
    "",
    `We write to inform you that your application for ${programme} has been shortlisted for the next stage of the selection process.`,
    "",
    `Applicant name: ${name}`,
    `Programme: ${record.programme || programme}`,
    `Application reference: ${record.applicationReference}`,
    "",
    "The admissions team will contact you at this email address with any further instructions, including arrangements for the next stage. Please monitor this inbox, including your junk or spam folder.",
    "",
    "Please keep your application reference number for all correspondence. You do not need to reply to this message unless we request additional information.",
    "",
    "Yours sincerely,",
    "Admissions Office",
    BRAND,
    "Makeni, Sierra Leone",
  ].join("\n");

  const html = layout(
    "Application shortlisted",
    `
      <p style="margin:0 0 16px;">Dear ${escapeHtml(record.firstName)},</p>
      <p style="margin:0 0 16px;">We write to inform you that your application for ${escapeHtml(programme)} has been shortlisted for the next stage of the selection process.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-top:1px solid #eadfce;border-bottom:1px solid #eadfce;">
        ${detailRow("Applicant name", name)}
        ${detailRow("Programme", record.programme || programme)}
        ${detailRow("Application reference", record.applicationReference)}
      </table>
      <p style="margin:0 0 16px;">The admissions team will contact you at this email address with any further instructions, including arrangements for the next stage. Please monitor this inbox, including your junk or spam folder.</p>
      <p style="margin:0 0 16px;">Please keep your application reference number for all correspondence. You do not need to reply to this message unless we request additional information.</p>
      <p style="margin:0;">Yours sincerely,<br />Admissions Office<br />${escapeHtml(BRAND)}<br />Makeni, Sierra Leone</p>
    `,
  );

  return { subject, text, html };
}

export function applicantRejectedEmail(record: ApplicationRecord) {
  const name = applicantName(record);
  const programme = "Ubuntu Postgraduate Training 2026";
  const subject = `Application update — ${record.applicationReference}`;
  const text = [
    BRAND,
    "",
    "Application update",
    "",
    `Dear ${record.firstName},`,
    "",
    `Thank you for your application to ${programme}. After careful consideration, we regret to inform you that we are unable to progress your application on this occasion.`,
    "",
    `Applicant name: ${name}`,
    `Programme: ${record.programme || programme}`,
    `Application reference: ${record.applicationReference}`,
    "",
    "We appreciate the time and effort you invested in your application and your interest in Ubuntu Tech Afrika. We wish you every success in your future endeavours.",
    "",
    "Yours sincerely,",
    "Admissions Office",
    BRAND,
    "Makeni, Sierra Leone",
  ].join("\n");

  const html = layout(
    "Application update",
    `
      <p style="margin:0 0 16px;">Dear ${escapeHtml(record.firstName)},</p>
      <p style="margin:0 0 16px;">Thank you for your application to ${escapeHtml(programme)}. After careful consideration, we regret to inform you that we are unable to progress your application on this occasion.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-top:1px solid #eadfce;border-bottom:1px solid #eadfce;">
        ${detailRow("Applicant name", name)}
        ${detailRow("Programme", record.programme || programme)}
        ${detailRow("Application reference", record.applicationReference)}
      </table>
      <p style="margin:0 0 16px;">We appreciate the time and effort you invested in your application and your interest in ${escapeHtml(BRAND)}. We wish you every success in your future endeavours.</p>
      <p style="margin:0;">Yours sincerely,<br />Admissions Office<br />${escapeHtml(BRAND)}<br />Makeni, Sierra Leone</p>
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
    `District: ${record.district}`,
    `Field of study: ${record.fieldOfStudy}`,
    `Institution: ${record.institution}`,
    ...(record.additionalQualifications.length
      ? record.additionalQualifications.map(
          (qualification, index) =>
            `Additional qualification ${index + 1}: ${[qualification.degree, displayFieldOfStudy(qualification.fieldOfStudy, qualification.fieldOfStudyOther), qualification.institution].filter(Boolean).join(" · ")}`,
        )
      : []),
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
        ${detailRow("District", record.district)}
        ${detailRow("Field of study", record.fieldOfStudy)}
        ${detailRow("Institution", record.institution)}
        ${record.additionalQualifications
          .map((qualification, index) =>
            detailRow(
              `Additional qualification ${index + 1}`,
              [qualification.degree, displayFieldOfStudy(qualification.fieldOfStudy, qualification.fieldOfStudyOther), qualification.institution].filter(Boolean).join(" · ") || "—",
            ),
          )
          .join("")}
        ${detailRow("Application reference", record.applicationReference)}
        ${detailRow("Submission date", submitted)}
      </table>
      <p style="margin:0 0 16px;"><a href="${escapeHtml(reviewUrl)}" style="color:#ee7a12;">Open this application in the admin dashboard</a></p>
      <p style="margin:0;">Uploaded documents are not attached to this email. Open the application in the admin dashboard to review files.</p>
    `,
  );

  return { subject, text, html };
}
