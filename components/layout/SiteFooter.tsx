import type { SiteSettings } from "@/types/content";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 bg-navy text-cream" role="contentinfo">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 lg:px-6">
        <section>
          <h2 className="font-serif text-xl">{settings.footerAboutTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-sand">{settings.footerAboutText}</p>
        </section>
        <section>
          <h2 className="font-serif text-xl">{settings.footerContactTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <a className="transition duration-300 hover:text-orange" href={`mailto:${settings.emails[0]}`}>
                {settings.emails[0]}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <a className="hover:text-orange" href={`tel:${settings.phoneFooter}`}>
                {settings.phoneFooter}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{settings.addressFull}</span>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-xl">{settings.footerSocialTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {settings.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                  className="rounded-full border border-cream/30 px-4 py-2 text-sm transition duration-300 hover:scale-105 hover:border-orange hover:text-orange hover:shadow-[0_0_18px_rgba(238,122,18,0.35)]"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-sm text-sand">
        <p>
          {settings.copyright} — <Heart className="inline h-3.5 w-3.5 text-orange" aria-hidden /> {settings.credit}
        </p>
        <p className="mt-2">
          <Link href="/contact" prefetch className="hover:text-orange">
            Contact
          </Link>
          {" · "}
          <Link href="/apply" prefetch className="hover:text-orange">
            Apply Now
          </Link>
        </p>
      </div>
    </footer>
  );
}
