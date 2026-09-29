import { NextRequest, NextResponse } from "next/server";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { firstName?: string; lastName?: string; email?: string; message?: string }
    | null;

  const firstName = body?.firstName?.trim() || "";
  const lastName = body?.lastName?.trim() || "";
  const email = body?.email?.trim() || "";
  const message = body?.message?.trim() || "";

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "d.salifu@ubuntuafrika.com";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The contact form is configured, but RESEND_API_KEY is not set. Email d.salifu@ubuntuafrika.com directly.",
      },
      { status: 503 },
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: "Ubuntu Afrika <noreply@ubuntuafrika-sl.com>",
    to,
    replyTo: email,
    subject: `Website contact from ${firstName} ${lastName}`,
    text: `${message}\n\nFrom: ${firstName} ${lastName} <${email}>`,
  });

  if (result.error) {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
