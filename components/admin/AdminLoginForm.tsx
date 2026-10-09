"use client";

import { useState } from "react";

function safeAdminRedirect(value?: string) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("://") || value.includes("\\")) {
    return "/admin/applications";
  }
  return value;
}

export function AdminLoginForm({ nextPath, error }: { nextPath: string; error?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState(error || "");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const password = String(new FormData(form).get("password") || "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, next: safeAdminRedirect(nextPath) }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string; redirect?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Unable to sign in.");
      return;
    }
    window.location.assign(safeAdminRedirect(data.redirect));
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-navy/10">
      <label className="block text-sm font-medium text-navy">
        Password
        <input
          required
          type="password"
          name="password"
          maxLength={256}
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-navy/15 bg-cream px-3 py-2.5"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white hover:bg-orange-dark disabled:opacity-60"
      >
        {status === "sending" ? "Signing in…" : "Sign in"}
      </button>
      {message ? (
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
      ) : null}
    </form>
  );
}
