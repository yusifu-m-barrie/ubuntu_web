import type { Metadata, Viewport } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Ubuntu Afrika Studio",
  referrer: "same-origin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100dvh",
        overflow: "auto",
        overscrollBehavior: "none",
        WebkitFontSmoothing: "antialiased",
        background: "#fff",
      }}
    >
      {children}
    </div>
  );
}
