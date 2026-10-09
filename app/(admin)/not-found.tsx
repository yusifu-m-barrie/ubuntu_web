import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Not found</p>
      <h1 className="mt-3 font-serif text-3xl text-navy">Application not found</h1>
      <Link href="/admin/applications" className="mt-8 inline-block rounded-full bg-orange px-6 py-3 font-semibold text-white">
        Back to applications
      </Link>
    </div>
  );
}
