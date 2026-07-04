"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Business, DirectionsCar, ArrowBack, Star } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { localized } from "./homeSettings";
import { useHomeSettings } from "./useHomeSettings";

const Departments = () => {
  const { i18n } = useTranslation("common");
  const { settings } = useHomeSettings();
  const lang = i18n.language;
  const cards = settings.departments.cards || [];
  const icons = [<DirectionsCar key="car" />, <DirectionsCar key="driver" />, <Business key="business" />];

  if (!settings.sections.departments) return null;

  return (
    <section
      className="py-24 bg-transparent relative overflow-hidden"
      dir={i18n.dir()}
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tighter">
            {localized(settings.departments.titlePart1, lang)}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-primary">
              {localized(settings.departments.titlePart2, lang)}
            </span>
          </h2>
          <div className="w-16 md:w-24 h-1.5 md:h-2 bg-linear-to-r from-primary to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, index) => {
            const title = localized(card.title, lang);
            const badge = localized(card.badge, lang);

            return (
              <Link
                key={`${card.href}-${title}`}
                href={card.href || "/cars"}
                className="group relative h-[300px] sm:h-[350px] md:h-[450px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 active:scale-95 border border-white/10"
                aria-label={title}
                title={title}
              >
                <div className="absolute inset-0">
                  <Image
                    src={card.image || "/images/car-indevadulals.jpg"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-l from-midnight/95 via-midnight/60 to-transparent"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10 z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors duration-500 text-white">
                      {React.cloneElement(icons[index] || icons[0], {
                        sx: { fontSize: { xs: 24, md: 36 } },
                      })}
                    </div>
                    {badge ? (
                      <div className="px-3 md:px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] md:text-xs font-black text-white uppercase tracking-widest gap-1 flex items-center">
                        <Star sx={{ fontSize: 14 }} className="text-accent" />
                        {badge}
                      </div>
                    ) : (
                      <Star
                        className="text-white/50 group-hover:text-accent transition-colors duration-500"
                        sx={{ fontSize: { xs: 24, md: 32 } }}
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 text-transparent bg-clip-text bg-linear-to-r from-primary-light to-primary drop-shadow-lg">
                      {title}
                    </h3>
                    <p className="text-slate-200 text-sm sm:text-base md:text-lg mb-4 max-w-sm leading-relaxed font-bold opacity-90 line-clamp-2">
                      {localized(card.description, lang)}
                    </p>

                    <div className="flex items-center gap-3 text-white font-black group-hover:gap-5 transition-all duration-300">
                      <span className="text-sm sm:text-lg group-hover:text-primary">
                        {localized(card.action, lang)}
                      </span>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ArrowBack className="transform scale-75 sm:scale-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Departments;
