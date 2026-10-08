"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SanityLiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    let stamp = "";
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const check = async () => {
      if (cancelled || document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/content-stamp", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { stamp?: string };
        const next = data.stamp || "";
        if (!stamp) {
          stamp = next;
          return;
        }
        if (next && next !== stamp) {
          stamp = next;
          router.refresh();
        }
      } catch {
        return;
      }
    };

    const loop = () => {
      if (cancelled) return;
      void check().finally(() => {
        if (!cancelled) timer = setTimeout(loop, 2000);
      });
    };

    loop();
    document.addEventListener("visibilitychange", check);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [router]);

  return null;
}
