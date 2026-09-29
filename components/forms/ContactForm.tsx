"use client";

import { useState } from "react";

type Labels = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  submit: string;
};

export function ContactForm({ labels }: { labels: Labels }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error || "Something went wrong. Please email us directly.");
      setStatus("error");
      return;
    }

    form.reset();
    setStatus("success");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy/10">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold text-navy">
          Name <span className="text-orange">*</span>
        </legend>
        <label className="block text-sm">
          {labels.firstName}
          <input
            required
            name="firstName"
            autoComplete="given-name"
            className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          {labels.lastName}
          <input
            required
            name="lastName"
            autoComplete="family-name"
            className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2"
          />
        </label>
      </fieldset>
      <label className="block text-sm">
        {labels.email} <span className="text-orange">*</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        {labels.message} <span className="text-orange">*</span>
        <textarea
          required
          name="message"
          rows={6}
          className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : labels.submit}
      </button>
      {status === "success" ? (
        <p role="status" className="text-sm text-navy">
          Thank you. Your message has been sent.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
