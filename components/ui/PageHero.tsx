import Link from "next/link";

export function PageHero({
  title,
  subtitle,
  kicker,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
}) {
  return (
    <section className="bg-navy text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-20">
        {kicker ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">{kicker}</p> : null}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-2xl text-lg text-sand">{subtitle}</p> : null}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 lg:px-6 ${className}`}>{children}</div>;
}

export function CtaLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  const className =
    variant === "outline"
      ? "btn-shine inline-flex cursor-pointer items-center rounded-full border-2 border-navy px-6 py-3 text-sm font-semibold text-navy transition duration-300 hover:bg-navy hover:text-white hover:shadow-[0_10px_24px_rgba(18,38,58,0.18)]"
      : "btn-shine hover-glow-orange inline-flex cursor-pointer items-center rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-orange-dark";
  if (external) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} prefetch className={className}>
      {children}
    </Link>
  );
}
