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
  const isArabic = i18n.language?.startsWith("ar");
  const tr = (key, ar, en) => t(key, { defaultValue: isArabic ? ar : en });

  const { data: carsData } = useQuery({
    queryKey: ["homeSectionsCars"],
    queryFn: () => carService.getAll({ page: 1, limit: 3 }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: driverCarsData } = useQuery({
    queryKey: ["homeSectionsDriverCars"],
    queryFn: () => carService.getAll({ category: "with_driver", page: 1, limit: 3 }),
    staleTime: 1000 * 60 * 5,
  });

  const cars = carsData?.data?.cars || [];
  const driverCars = driverCarsData?.data?.cars || [];

  const features = [
    {
      icon: <Shield />,
      title: tr("homeSections.about.points.verified", "سيارات موثقة", "Verified cars"),
      text: isArabic ? "اختيارات واضحة قبل إرسال الطلب." : "Clear choices before sending the request.",
    },
    {
      icon: <EventAvailable />,
      title: tr("homeSections.about.points.flexible", "مدد مرنة", "Flexible durations"),
      text: isArabic ? "حجز يومي أو باقات بسائق حسب الحاجة." : "Daily rental or chauffeur packages as needed.",
    },
    {
      icon: <CheckCircle />,
      title: tr("homeSections.about.points.support", "متابعة سريعة", "Fast follow-up"),
      text: isArabic ? "فريقنا يتواصل لتأكيد التفاصيل." : "Our team follows up to confirm details.",
    },
  ];

  const services = [
    {
      icon: <DirectionsCar />,
      title: tr("homeSections.services.items.individual.title", "تأجير للأفراد", "Individual Rental"),
      text: tr(
        "homeSections.services.items.individual.text",
        "سيارات يومية وشهرية للاستخدام الشخصي، المشاوير، والسفر داخل المدن.",
        "Daily and monthly cars for personal use, city errands, and trips between destinations.",
      ),
      href: "/individuals",
    },
    {
      icon: <Groups />,
      title: tr("homeSections.services.items.driver.title", "سيارات بسائق", "Cars With Driver"),
      text: tr(
        "homeSections.services.items.driver.text",
        "باقات 4 و8 و12 ساعة مع سائق لرحلات العمل والمناسبات والتنقلات اليومية.",
        "4, 8, and 12-hour chauffeur packages for business trips, events, and daily movement.",
      ),
      href: "/with-driver",
    },
    {
      icon: <BusinessCenter />,
      title: tr("homeSections.services.items.corporate.title", "حلول الشركات", "Corporate Solutions"),
      text: tr(
        "homeSections.services.items.corporate.text",
        "خيارات مرنة للفرق والشركات التي تحتاج سيارات متعددة أو عقود أطول.",
        "Flexible options for teams and companies that need multiple cars or longer contracts.",
      ),
      href: "/corporate",
    },
  ];

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
  ];

  return (
    <div dir={i18n.dir()} className="bg-transparent">
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl md:rounded-[3rem] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
              <SectionHeader
                align="start"
                eyebrow={tr("homeSections.about.eyebrow", "من نحن", "About Us")}
                title={tr(
                  "homeSections.about.title",
                  "منصة C4R لتأجير سيارات أسهل، أوضح، وأكثر موثوقية",
                  "C4R makes car rental simpler, clearer, and more reliable",
                )}
                text={tr(
                  "homeSections.about.text",
                  "نربط العملاء بخيارات تأجير سيارات تناسب الأفراد، الشركات، وخدمة السيارة بسائق داخل المملكة، مع تجربة حجز واضحة وتواصل مباشر لتأكيد كل التفاصيل.",
                  "We connect customers with rental options for individuals, companies, and chauffeur service across Saudi Arabia, with a clear booking experience and direct confirmation support.",
                )}
              />
            </div>

            <div className="relative min-h-[340px]">
              <Image
                src="/images/car-indevadulals.jpg"
                alt={tr("homeSections.about.imageAlt", "عميل يستعرض خيارات تأجير السيارات من C4R", "Customer browsing C4R car rental options")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
              <div className="theme-dark-media absolute bottom-5 right-5 left-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/65 p-4 backdrop-blur-xl">
                <Shield className="text-primary" />
                <p className="text-sm font-black leading-6 text-white">
                  {tr(
                    "homeSections.about.imageNote",
                    "نوثق تفاصيل الحجز ونساعدك في اختيار السيارة المناسبة قبل تأكيد الطلب.",
                    "We document booking details and help you choose the right car before confirming the request.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-14">
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
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              align="start"
              eyebrow={tr("homeSections.cars.eyebrow", "سياراتنا", "Our Cars")}
              title={tr("homeSections.cars.title", "أسطول مختار لاحتياجات مختلفة", "A selected fleet for different needs")}
              text={tr(
                "homeSections.cars.text",
                "تصفح سيارات متاحة للحجز مع تفاصيل السعر، المدينة، والفئة قبل إرسال طلبك.",
                "Browse available cars with price, city, and category details before sending your request.",
              )}
            />
            <CtaLink href="/cars" variant="secondary">
              {tr("homeSections.cars.action", "عرض كل السيارات", "View all cars")}
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
                      src={item.image}
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
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              align="start"
              eyebrow={isArabic ? "سيارات بسائق" : "Cars With Driver"}
              title={isArabic ? "سيارات للإيجار مع سائق محترف" : "Cars for rent with a professional driver"}
              text={tr(
                "homeSections.luxury.text",
                "اختر سيارة بسائق لتجربة انتقال أكثر هدوءاً وتنظيماً.",
                "Choose a chauffeur car for a calmer, more organized ride.",
              )}
            />
            <CtaLink href="/with-driver">
              {isArabic ? "عرض سيارات السائق" : "View driver cars"}
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
                      src={item.image}
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
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            align="start"
            eyebrow={tr("homeSections.services.eyebrow", "خدماتنا", "Our Services")}
            title={tr("homeSections.services.title", "خدمات مصممة حسب طريقة تنقلك", "Services shaped around how you move")}
            text={tr(
              "homeSections.services.text",
              "اختر بين التأجير الفردي، سيارات بسائق، أو حلول الشركات بدون تعقيد في خطوات الحجز.",
              "Choose individual rental, chauffeur service, or corporate solutions without complicating the booking steps.",
            )}
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
                  {tr("homeSections.services.action", "استكشف الخدمة", "Explore service")}
                  <ArrowBack sx={{ fontSize: 18 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-primary/25 bg-primary/15 p-6 shadow-2xl sm:p-8 md:rounded-[3rem] md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  {tr("homeSections.cta.eyebrow", "جاهز للحجز؟", "Ready to book?")}
                </p>
                <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  {tr(
                    "homeSections.cta.title",
                    "اختر سيارتك الآن واترك لفريقنا تأكيد التفاصيل معك",
                    "Choose your car now and let our team confirm the details with you",
                  )}
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-orange-100/80 sm:text-base">
                  {tr(
                    "homeSections.cta.text",
                    "ابدأ من صفحة السيارات أو انتقل مباشرة إلى خدمة السيارة بسائق حسب احتياجك.",
                    "Start from the cars page or go directly to chauffeur service based on what you need.",
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                <CtaLink href="/cars">{tr("homeSections.cta.primary", "احجز سيارة", "Book a car")}</CtaLink>
                <CtaLink href="/with-driver" variant="secondary">
                  {tr("homeSections.cta.secondary", "سيارة بسائق", "Car with driver")}
                </CtaLink>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
