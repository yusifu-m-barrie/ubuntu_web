import Link from "next/link";

export function PrivacyNotice({
  title,
  intro,
  points,
  contact,
  compact = false,
}: {
  title: string;
  intro: string;
  points: string[];
  contact: string;
  compact?: boolean;
}) {
  return (
    <div
      id={compact ? undefined : "data-protection"}
      className={
        compact
          ? "rounded-2xl bg-cream px-4 py-4 ring-1 ring-navy/10 sm:px-5"
          : "scroll-mt-28 rounded-3xl bg-white p-8 ring-1 ring-navy/10"
      }
    >
      <h2 className={compact ? "font-serif text-xl text-navy" : "font-serif text-2xl text-navy md:text-3xl"}>
        {title}
      </h2>
      <p className={`mt-3 leading-relaxed text-muted ${compact ? "text-sm" : "text-sm md:text-base"}`}>{intro}</p>
      {compact ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We use your details to assess this application, verify identity and documents, prevent duplicate submissions,
          and contact you about this intake.{" "}
          <Link href="/apply#data-protection" className="font-semibold text-orange hover:underline">
            Read the full data protection notice
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-4 space-y-2 text-sm text-navy md:text-base">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" aria-hidden />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      )}
      {contact && !compact ? (
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{contact}</p>
      ) : null}
    </div>
  );
}
