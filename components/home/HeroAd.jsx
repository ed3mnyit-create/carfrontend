"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const HeroAd = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="w-full pt-18 md:pt-22 bg-transparent pb-8 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative h-[420px] w-full overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl group md:h-[520px]">
          <div className="absolute inset-0">
            <Image
              src="/images/car1.png"
              alt={t("hero.imageAlt", { defaultValue: "أسطول سيارات C4R للتأجير في السعودية" })}
              fill
              className="object-cover object-center transition-transform duration-10000 group-hover:scale-105"
              priority
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-black/35"></div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-4 py-8 text-white sm:py-10 md:px-12 md:py-12"
            dir={i18n.dir()}
          >
            <div className="mb-10 max-w-3xl text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <h1 className="text-2xl font-black leading-tight tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] sm:text-3xl md:text-4xl md:leading-snug">
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t("hero.titlePart1")}
                </span>{" "}
                <br />
                {t("hero.titlePart2")}
              </h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] sm:text-base md:text-lg">
                {t("hero.description")}
              </p>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/sharqiya"
                className="group/card relative h-12 w-full max-w-[150px] overflow-hidden rounded-xl border border-white/20 shadow-lg transition-all duration-300 active:scale-95 hover:border-primary/50 sm:h-14 md:h-16"
                aria-label={t("hero.eastern")}
                title={t("hero.eastern")}
              >
                <div className="absolute inset-0 bg-midnight/70 backdrop-blur-md transition-colors group-hover/card:bg-midnight/80"></div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-primary transition-transform group-hover/card:scale-x-100"></div>
                <div className="absolute inset-0 flex items-center justify-center px-3">
                  <span className="text-xs font-black text-white transition-colors group-hover/card:text-primary sm:text-sm md:text-base">
                    {t("hero.eastern")}
                  </span>
                </div>
              </Link>

              <Link
                href="/riyadh"
                className="group/card relative h-12 w-full max-w-[150px] overflow-hidden rounded-xl border border-white/20 shadow-lg transition-all duration-300 active:scale-95 hover:border-primary/50 sm:h-14 md:h-16"
                aria-label={t("hero.riyadh")}
                title={t("hero.riyadh")}
              >
                <div className="absolute inset-0 bg-midnight/70 backdrop-blur-md transition-colors group-hover/card:bg-midnight/80"></div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-primary transition-transform group-hover/card:scale-x-100"></div>
                <div className="absolute inset-0 flex items-center justify-center px-3">
                  <span className="text-xs font-black text-white transition-colors group-hover/card:text-primary sm:text-sm md:text-base">
                    {t("hero.riyadh")}
                  </span>
                </div>
              </Link>

              <Link
                href="/jeddah"
                className="group/card relative h-12 w-full max-w-[150px] overflow-hidden rounded-xl border border-white/20 shadow-lg transition-all duration-300 active:scale-95 hover:border-primary/50 sm:h-14 md:h-16"
                aria-label={t("hero.jeddah")}
                title={t("hero.jeddah")}
              >
                <div className="absolute inset-0 bg-midnight/70 backdrop-blur-md transition-colors group-hover/card:bg-midnight/80"></div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-primary transition-transform group-hover/card:scale-x-100"></div>
                <div className="absolute inset-0 flex items-center justify-center px-3">
                  <span className="text-xs font-black text-white transition-colors group-hover/card:text-primary sm:text-sm md:text-base">
                    {t("hero.jeddah")}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAd;