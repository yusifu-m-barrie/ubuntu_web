import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">404</p>
      <h1 className="mt-3 font-serif text-4xl text-navy">Page not found</h1>
      <p className="mt-4 text-muted">The page you requested is not part of the Ubuntu Afrika website.</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-orange px-6 py-3 font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
}
