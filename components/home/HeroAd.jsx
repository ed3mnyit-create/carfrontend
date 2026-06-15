"use client";

import React from "react";
import Link from "next/link";
import { ArrowBack, DirectionsCar, WhatsApp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const HeroAd = () => {
  const { t, i18n } = useTranslation("common");
  const isArabic = i18n.language?.startsWith("ar");
  const dir = isArabic ? "rtl" : "ltr";

  const copy = {
    title: isArabic
      ? "تجربة تأجير سيارات راقية لاختيار واثق"
      : "A premium car rental experience for a confident choice",
    description: isArabic
      ? "اختر من سيارات فاخرة واقتصادية، للأفراد والشركات أو مع سائق، مع حجز واضح ومتابعة مباشرة حتى تأكيد الطلب."
      : "Choose luxury and economy cars for individuals, companies, or chauffeur service, with clear booking and direct follow-up until confirmation.",
    primary: isArabic ? "اكتشف السيارات" : "Discover cars",
    secondary: isArabic ? "تواصل معنا" : "Contact us",
  };

  return (
    <section
      className="theme-dark-media relative isolate h-[88vh] min-h-[760px] w-full overflow-hidden bg-midnight bg-cover bg-center bg-no-repeat"
      dir={dir}
      style={{
        backgroundImage: "url('/images/hero-rolls-royce.jpg')",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className={`absolute inset-0 ${
          isArabic
            ? "bg-linear-to-l from-black/88 via-black/54 to-black/10"
            : "bg-linear-to-r from-black/88 via-black/54 to-black/10"
        }`}
      />
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-transparent to-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-midnight to-transparent" />

      <div className="relative mx-auto flex h-full max-w-[88rem] items-center justify-center px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="z-10 flex max-w-4xl flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
            <DirectionsCar sx={{ fontSize: 16 }} />
            C4R Platform
          </span>

          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
            {copy.title}
          </h1>

          <p className="max-w-2xl text-base font-black leading-8 text-white/78 sm:text-lg">
            {copy.description}
          </p>

          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/cars"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-white transition hover:bg-primary-hover active:scale-95 sm:min-w-44"
            >
              {copy.primary}
              <ArrowBack sx={{ fontSize: 18 }} />
            </Link>
            <Link
              href="https://wa.me/966554118873"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-6 py-3 text-sm font-black text-white backdrop-blur-md transition hover:border-primary/40 hover:bg-white/10 active:scale-95 sm:min-w-44"
            >
              {copy.secondary}
              <WhatsApp sx={{ fontSize: 18 }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAd;
