const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type OutgoingEmail = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function mailFromAddress() {
  return process.env.EMAIL_FROM || "Ubuntu Tech Africa <noreply@ubuntuafrika-sl.com>";
}

export function adminNotifyAddresses() {
  const raw = process.env.APPLICATIONS_NOTIFY_EMAIL || process.env.CONTACT_TO_EMAIL || "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => EMAIL_PATTERN.test(value));
}

export function isDeliverableEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export async function sendApplicationEmail(message: OutgoingEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false as const, skipped: true as const, error: "Email delivery is not configured." };
  }

  const to = (Array.isArray(message.to) ? message.to : [message.to]).map((value) => value.trim());
  if (!to.length || to.some((value) => !EMAIL_PATTERN.test(value))) {
    return { sent: false as const, skipped: true as const, error: "No valid recipient." };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: mailFromAddress(),
      to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      ...(message.replyTo ? { replyTo: message.replyTo } : {}),
      ...(message.headers ? { headers: message.headers } : {}),
    });
    if (result.error) {
      return { sent: false as const, skipped: false as const, error: result.error.message || "Email provider rejected the message." };
    }
    return { sent: true as const, skipped: false as const };
  } catch {
    return { sent: false as const, skipped: false as const, error: "Email provider is unavailable." };
  }
}
