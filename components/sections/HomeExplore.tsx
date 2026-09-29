import Image from "next/image";
import Link from "next/link";

type Path = {
  href: string;
  label: string;
  image: string;
  alt: string;
};

export function HomeExplore({ paths }: { paths: Path[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {paths.map((path, index) => (
        <li key={path.href} className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
          <Link
            href={path.href}
            className="hover-glow group relative block min-h-[240px] cursor-pointer overflow-hidden rounded-3xl shadow-md ring-1 ring-navy/10"
            prefetch
          >
            <Image
              src={path.image}
              alt={path.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition duration-700 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent transition duration-500 group-hover:from-navy/90" />
            <span className="absolute inset-x-0 bottom-0 p-5">
              <span className="font-serif text-xl font-bold text-white">{path.label}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
