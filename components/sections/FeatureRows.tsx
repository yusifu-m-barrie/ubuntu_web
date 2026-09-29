import type { FeatureBlock } from "@/types/content";
import Image from "next/image";

export function FeatureRows({ features }: { features: FeatureBlock[] }) {
  return (
    <div className="space-y-10 md:space-y-16">
      {features.map((feature) => {
        const imageFirst = feature.imageOn === "left";
        return (
          <article
            key={feature.title}
            className="grid min-h-[400px] items-stretch overflow-hidden md:grid-cols-2"
          >
            <div className={`relative min-h-[320px] overflow-hidden md:min-h-[400px] ${imageFirst ? "md:order-1" : "md:order-2"}`}>
              <Image
                src={feature.image}
                alt={feature.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div
              className={`flex flex-col justify-center bg-white px-6 py-12 md:px-12 lg:px-16 ${
                imageFirst ? "md:order-2" : "md:order-1"
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.5px] text-[#01b88e]">{feature.eyebrow}</p>
              <h3 className="mt-3 font-serif text-3xl font-bold leading-tight text-navy md:text-4xl">
                {feature.title}
              </h3>
            </div>
          </article>
        );
      })}
    </div>
  );
}
