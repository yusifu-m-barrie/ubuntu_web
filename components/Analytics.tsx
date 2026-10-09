import Script from "next/script";

function measurementId() {
  const value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  return /^G-[A-Z0-9]+$/.test(value) ? value : "";
}

export function Analytics() {
  const id = measurementId();
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-measurement" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
