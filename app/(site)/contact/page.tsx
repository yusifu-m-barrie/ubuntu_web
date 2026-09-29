import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { loadContent, siteUrl } from "@/lib/content";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await loadContent();
  return {
    title: contact.seo.title,
    description: contact.seo.description,
    alternates: { canonical: siteUrl("/contact") },
  };
}

export default async function ContactRoute() {
  const { contact, settings } = await loadContent();

  return (
    <>
      <PageHero title={contact.title} subtitle={contact.intro} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:px-6">
        <div className="space-y-6">
          <article className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
            <h2 className="flex items-center gap-2 font-serif text-2xl text-navy">
              <Phone className="h-5 w-5 text-orange" /> {contact.callTitle}
            </h2>
            <p className="mt-3">
              <a href={`tel:${settings.phoneContact}`}>{settings.phoneContact}</a>
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
            <h2 className="flex items-center gap-2 font-serif text-2xl text-navy">
              <Mail className="h-5 w-5 text-orange" /> {contact.emailTitle}
            </h2>
            <ul className="mt-3 space-y-1">
              {settings.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
            <h2 className="flex items-center gap-2 font-serif text-2xl text-navy">
              <MapPin className="h-5 w-5 text-orange" /> {contact.visitTitle}
            </h2>
            <p className="mt-3 whitespace-pre-line">{settings.addressLines.join("\n")}</p>
          </article>
        </div>
        <ContactForm labels={contact.formLabels} />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 lg:px-6">
        <iframe
          title="Ubuntu Afrika office map"
          src={settings.mapEmbedUrl}
          className="h-80 w-full rounded-2xl border-0"
          loading="lazy"
        />
      </div>
    </>
  );
}
