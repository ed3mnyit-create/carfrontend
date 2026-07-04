"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ArrowBack,
  BusinessCenter,
  CheckCircle,
  DirectionsCar,
  EventAvailable,
  Groups,
  LocalOffer,
  Shield,
  Star,
} from "@mui/icons-material";
import { carService } from "@/services/api";
import CarCard from "@/components/cards/CarCard";
import { localized } from "./homeSettings";
import { useHomeSettings } from "./useHomeSettings";

const SectionHeader = ({ eyebrow, title, text, align = "center" }) => (
  <div
    className={`mb-8 md:mb-12 ${
      align === "start" ? "text-start" : "text-center mx-auto"
    }`}
  >
    <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
      {eyebrow}
    </p>
    <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
      {title}
    </h2>
    {text && (
      <p
        className={`mt-4 text-sm font-bold leading-7 text-slate-400 sm:text-base ${
          align === "start" ? "max-w-2xl" : "mx-auto max-w-3xl"
        }`}
      >
        {text}
      </p>
    )}
  </div>
);

const CtaLink = ({ href, children, variant = "primary" }) => {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-sm font-black transition-all active:scale-95 ${
        isPrimary
          ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover"
          : "border border-white/10 bg-white/5 text-white hover:border-primary/40 hover:bg-white/10"
      }`}
    >
      {children}
      <ArrowBack sx={{ fontSize: 18 }} />
    </Link>
  );
};

export default function HomeSections() {
  const { t, i18n } = useTranslation("common");
  const { settings } = useHomeSettings();
  const isArabic = i18n.language?.startsWith("ar");
  const tr = (key, ar, en) => t(key, { defaultValue: isArabic ? ar : en });
  const lang = i18n.language;
  const section = settings.sections;

  const { data: carsData } = useQuery({
    queryKey: ["homeSectionsCars"],
    queryFn: () => carService.getAll({ page: 1, limit: 6 }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: driverCarsData } = useQuery({
    queryKey: ["homeSectionsDriverCars"],
    queryFn: () => carService.getAll({ category: "with_driver", page: 1, limit: 6 }),
    staleTime: 1000 * 60 * 5,
  });

  const cars = carsData?.data?.cars || [];
  const driverCars = driverCarsData?.data?.cars || [];

  const features = [
    {
      icon: <Shield />,
      title: localized(settings.features?.[0]?.title, lang),
      text: localized(settings.features?.[0]?.text, lang),
    },
    {
      icon: <EventAvailable />,
      title: localized(settings.features?.[1]?.title, lang),
      text: localized(settings.features?.[1]?.text, lang),
    },
    {
      icon: <CheckCircle />,
      title: localized(settings.features?.[2]?.title, lang),
      text: localized(settings.features?.[2]?.text, lang),
    },
  ];

  const serviceIcons = [<DirectionsCar />, <Groups />, <BusinessCenter />];
  const services = (settings.services.items || []).map((service, index) => ({
    icon: serviceIcons[index] || <DirectionsCar />,
    title: localized(service.title, lang),
    text: localized(service.text, lang),
    href: service.href || "/cars",
  }));

  const fallbackFleet = [
    {
      icon: <Star />,
      title: tr("homeSections.cars.fallback.luxury.title", "سيارات فاخرة", "Luxury Cars"),
      text: tr(
        "homeSections.cars.fallback.luxury.text",
        "خيارات مميزة للمناسبات والتنقلات الرسمية.",
        "Premium choices for events and formal transportation.",
      ),
      image: "/images/car1.png",
    },
    {
      icon: <Shield />,
      title: tr("homeSections.cars.fallback.family.title", "سيارات عائلية", "Family Cars"),
      text: tr(
        "homeSections.cars.fallback.family.text",
        "مساحة وراحة للرحلات اليومية والسفر.",
        "Space and comfort for daily trips and travel.",
      ),
      image: "/images/car-indevadulals.jpg",
    },
    {
      icon: <LocalOffer />,
      title: tr("homeSections.cars.fallback.economy.title", "سيارات اقتصادية", "Economy Cars"),
      text: tr(
        "homeSections.cars.fallback.economy.text",
        "حلول عملية بأسعار مناسبة للاستخدام المتكرر.",
        "Practical options with suitable pricing for frequent use.",
      ),
      image: "/images/car-companys.jpg",
    },
    {
      icon: <DirectionsCar />,
      title: isArabic ? "سيارات يومية" : "Daily Rentals",
      text: isArabic ? "خيارات عملية للتنقل اليومي داخل المدينة." : "Practical options for daily movement in the city.",
      image: "/images/individuals.jpg",
    },
    {
      icon: <CheckCircle />,
      title: isArabic ? "اختيارات موثوقة" : "Trusted Choices",
      text: isArabic ? "سيارات واضحة التفاصيل قبل إرسال طلب الحجز." : "Cars with clear details before sending your booking request.",
      image: "/images/p-3.jpeg",
    },
    {
      icon: <EventAvailable />,
      title: isArabic ? "مدد مرنة" : "Flexible Durations",
      text: isArabic ? "حجز يناسب يومك أو احتياجك الطويل." : "Booking that fits your day or longer-term needs.",
      image: "/images/p-4.jpeg",
    },
  ];

  const driverFallbackCars = [
    {
      icon: <Star />,
      title: isArabic ? "سيارات تنفيذية" : "Executive Cars",
      text: isArabic ? "حضور راقٍ للاجتماعات والتنقلات الرسمية." : "A refined presence for meetings and formal trips.",
      image: "/images/car1.png",
    },
    {
      icon: <Groups />,
      title: isArabic ? "بسائق محترف" : "Professional Driver",
      text: isArabic ? "باقات 4 و8 و12 ساعة لتجربة أكثر راحة." : "4, 8, and 12-hour packages for a calmer ride.",
      image: "/images/car-with-driver.webp",
    },
    {
      icon: <LocalOffer />,
      title: isArabic ? "للمناسبات" : "For Occasions",
      text: isArabic ? "خيارات مناسبة للمناسبات والضيافة الخاصة." : "Options suited for events and private hospitality.",
      image: "/images/car-companys.jpg",
    },
    {
      icon: <Shield />,
      title: isArabic ? "تنقل آمن" : "Safe Transfers",
      text: isArabic ? "رحلات منظمة مع متابعة واضحة لتفاصيل الطلب." : "Organized rides with clear follow-up on request details.",
      image: "/images/hero-luxury-mercedes.jpg",
    },
    {
      icon: <BusinessCenter />,
      title: isArabic ? "للأعمال" : "Business Ready",
      text: isArabic ? "مناسبة للاجتماعات والزيارات الرسمية." : "Suitable for meetings and formal business visits.",
      image: "/images/car-indevadulals.jpg",
    },
    {
      icon: <EventAvailable />,
      title: isArabic ? "باقات ساعات" : "Hourly Packages",
      text: isArabic ? "اختر 4 أو 8 أو 12 ساعة حسب جدولك." : "Choose 4, 8, or 12 hours based on your schedule.",
      image: "/images/p5.JPEG",
    },
  ];

  return (
    <div dir={i18n.dir()} className="bg-transparent">
      {section.about && <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl md:rounded-[3rem] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
              <SectionHeader
                align="start"
                eyebrow={localized(settings.about.eyebrow, lang)}
                title={localized(settings.about.title, lang)}
                text={localized(settings.about.text, lang)}
              />
            </div>

            <div className="relative min-h-[340px]">
              <Image
                src={settings.about.image || "/images/car-indevadulals.jpg"}
                alt={localized(settings.about.imageAlt, lang)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
              <div className="theme-dark-media absolute bottom-5 right-5 left-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/65 p-4 backdrop-blur-xl">
                <Shield className="text-primary" />
                <p className="text-sm font-black leading-6 text-white">
                  {localized(settings.about.imageNote, lang)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>}

      {section.features && <section className="py-10 sm:py-12 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex min-h-32 items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  {React.cloneElement(feature.icon, { sx: { fontSize: 28 } })}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-400">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {section.cars && <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              align="start"
              eyebrow={localized(settings.cars.eyebrow, lang)}
              title={localized(settings.cars.title, lang)}
              text={localized(settings.cars.text, lang)}
            />
            <CtaLink href={settings.cars.href} variant="secondary">
              {localized(settings.cars.action, lang)}
            </CtaLink>
          </div>

          {cars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} variant="dark" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {fallbackFleet.map((item) => (
                <div
                  key={item.title}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35"
                >
                  <div className="relative h-44">
                    <Image
                      src={item.image || "/images/car1.png"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/90 text-white">
                      {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm font-bold leading-7 text-slate-400">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>}

      {section.driverCars && <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              align="start"
              eyebrow={localized(settings.driverCars.eyebrow, lang)}
              title={localized(settings.driverCars.title, lang)}
              text={localized(settings.driverCars.text, lang)}
            />
            <CtaLink href={settings.driverCars.href}>
              {localized(settings.driverCars.action, lang)}
            </CtaLink>
          </div>
          {driverCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {driverCars.map((car) => (
                <CarCard key={car._id} car={car} variant="dark" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {driverFallbackCars.map((item) => (
                <div
                  key={item.title}
                  className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35"
                >
                  <div className="relative h-48">
                    <Image
                      src={item.image || "/images/car-with-driver.webp"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                    </div>
                    <h3 className="text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-3 text-sm font-bold leading-7 text-slate-400">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>}

      {section.services && <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            align="start"
            eyebrow={localized(settings.services.eyebrow, lang)}
            title={localized(settings.services.title, lang)}
            text={localized(settings.services.text, lang)}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group flex min-h-[260px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white/[0.065] active:scale-[0.99]"
              >
                <div>
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    {React.cloneElement(service.icon, { sx: { fontSize: 28 } })}
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-400">
                    {service.text}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-black text-primary">
                  {localized(settings.services.action, lang)}
                  <ArrowBack sx={{ fontSize: 18 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>}

      {section.cta && <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-primary/25 bg-primary/15 p-6 shadow-2xl sm:p-8 md:rounded-[3rem] md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  {localized(settings.cta.eyebrow, lang)}
                </p>
                <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  {localized(settings.cta.title, lang)}
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-400 sm:text-base">
                  {localized(settings.cta.text, lang)}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                <CtaLink href={settings.cta.primaryHref}>{localized(settings.cta.primaryLabel, lang)}</CtaLink>
                <CtaLink href={settings.cta.secondaryHref} variant="secondary">
                  {localized(settings.cta.secondaryLabel, lang)}
                </CtaLink>
              </div>
            </div>
          </div>
        </div>
      </section>}

    </div>
  );
}
