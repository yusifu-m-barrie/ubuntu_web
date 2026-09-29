import type { TeamMember } from "@/types/content";
import { Linkedin } from "lucide-react";
import Image from "next/image";

function LinkedInButton({ href, name }: { href: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
      className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#004182] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2]"
    >
      <Linkedin className="h-3.5 w-3.5" aria-hidden />
      LinkedIn
    </a>
  );
}

export function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((member, index) => {
        const logoPhoto = member.photo.includes("preving");
        return (
          <li key={member.name} className="group reveal-in" style={{ animationDelay: `${Math.min(index, 12) * 70}ms` }}>
            <article className="hover-glow h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy/10">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`transition duration-700 group-hover:scale-110 ${
                    logoPhoto ? "object-contain bg-white p-8" : "object-cover object-top"
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                {member.linkedin ? (
                  <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-2 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <LinkedInButton href={member.linkedin} name={member.name} />
                  </div>
                ) : null}
              </div>
              <div className="px-4 py-5 text-center">
                <h3 className="font-semibold text-navy">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
                {member.linkedin ? (
                  <div className="mt-4">
                    <LinkedInButton href={member.linkedin} name={member.name} />
                  </div>
                ) : null}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
