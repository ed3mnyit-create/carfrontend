"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { settingService } from "@/services/api";
import { localized, defaultHomeSettings, mergeHomeSettings } from "@/components/home/homeSettings";
import { Container } from "@mui/material";
import {
  Business,
  DirectionsCar,
  Groups,
  LocalOffer,
  Schedule,
  Send,
  Shield,
} from "@mui/icons-material";
import Image from "next/image";

export default function CorporatePageClient() {
  const { t, i18n } = useTranslation("common");
  const isArabic = i18n.language?.startsWith("ar");
  const lang = isArabic ? "ar" : "en";
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    city: "",
    fleetSize: "",
    duration: "",
    message: "",
  });

  const { data: contactData } = useQuery({
    queryKey: ["setting", "contact_info"],
    queryFn: () => settingService.getOne("contact_info"),
    staleTime: 1000 * 60 * 10,
  });

  const { data: homepageData } = useQuery({
    queryKey: ["setting", "homepage_content"],
    queryFn: () => settingService.getOne("homepage_content"),
    staleTime: 1000 * 60 * 10,
  });

  const contactEmail = contactData?.data?.email || "Team@C4Rplatform.com";
  const pageSettings =
    mergeHomeSettings(homepageData?.data || defaultHomeSettings).corporatePage;

  const featureIcons = [<DirectionsCar key="fleet" />, <LocalOffer key="offers" />, <Shield key="support" />];
  const serviceIcons = [<Business key="contracts" />, <Groups key="teams" />, <Schedule key="events" />];

  const benefits = (pageSettings.features.items || []).map((item, index) => ({
    icon: featureIcons[index % featureIcons.length],
    title: localized(item.title, lang),
    text: localized(item.text, lang),
  }));

  const services = (pageSettings.services.items || []).map((item, index) => ({
    icon: serviceIcons[index % serviceIcons.length],
    title: localized(item.title, lang),
    text: localized(item.text, lang),
  }));

  const fallbackBenefits = [
    {
      icon: <DirectionsCar />,
      title: t("corporate.benefits.fleet.title"),
      text: t("corporate.benefits.fleet.text"),
    },
    {
      icon: <LocalOffer />,
      title: t("corporate.benefits.offers.title"),
      text: t("corporate.benefits.offers.text"),
    },
    {
      icon: <Shield />,
      title: t("corporate.benefits.support.title"),
      text: t("corporate.benefits.support.text"),
    },
  ];

  const fallbackServices = [
    {
      icon: <Business />,
      title: t("corporate.services.contracts.title"),
      text: t("corporate.services.contracts.text"),
    },
    {
      icon: <Groups />,
      title: t("corporate.services.teams.title"),
      text: t("corporate.services.teams.text"),
    },
    {
      icon: <Schedule />,
      title: t("corporate.services.events.title"),
      text: t("corporate.services.events.text"),
    },
  ];

  const displayedBenefits = benefits.length ? benefits : fallbackBenefits;
  const displayedServices = services.length ? services : fallbackServices;
  const steps = (pageSettings.steps.items || []).map((step) => localized(step.text, lang));

  const faqs = (pageSettings.faq.items || []).map((item) => ({
    question: localized(item.question, lang),
    answer: localized(item.answer, lang),
  }));

  const fallbackFaqs = [
    {
      question: t("corporate.faq.items.contract.question"),
      answer: t("corporate.faq.items.contract.answer"),
    },
    {
      question: t("corporate.faq.items.cities.question"),
      answer: t("corporate.faq.items.cities.answer"),
    },
    {
      question: t("corporate.faq.items.driver.question"),
      answer: t("corporate.faq.items.driver.answer"),
    },
    {
      question: t("corporate.faq.items.offer.question"),
      answer: t("corporate.faq.items.offer.answer"),
    },
  ];
  const displayedFaqs = faqs.length ? faqs : fallbackFaqs;
  const displayedSteps = steps.length
    ? steps
    : [t("corporate.steps.step1"), t("corporate.steps.step2"), t("corporate.steps.step3")];

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      isArabic
        ? `طلب عرض سعر للشركات - ${formData.companyName}`
        : `Corporate offer request - ${formData.companyName}`,
    );
    const body = encodeURIComponent(
      [
        `${t("corporate.form.companyName")}: ${formData.companyName}`,
        `${t("corporate.form.contactName")}: ${formData.contactName}`,
        `${t("corporate.form.phone")}: ${formData.phone}`,
        `${t("corporate.form.city")}: ${formData.city}`,
        `${t("corporate.form.fleetSize")}: ${formData.fleetSize}`,
        `${t("corporate.form.duration")}: ${formData.duration}`,
        `${t("corporate.form.message")}: ${formData.message}`,
      ].join("\n"),
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-transparent pb-20" dir={i18n.dir()}>
      <section className="theme-dark-media relative min-h-[72vh] overflow-hidden">
        <Image
          src={pageSettings.hero.backgroundImage || "/images/car-companys.jpg"}
          alt={localized(pageSettings.hero.title, lang, t("corporate.pageTitle"))}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/58 to-black/12" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/20" />
        <Container maxWidth="xl" className="relative z-10">
          <div className="flex min-h-[72vh] max-w-4xl flex-col justify-center py-24">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-5 py-2 text-primary backdrop-blur-md">
              <Business fontSize="small" />
              <span className="text-xs font-black uppercase tracking-[0.22em]">
                {localized(pageSettings.hero.badge, lang, t("corporate.heroBadge"))}
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              {localized(pageSettings.hero.title, lang, t("corporate.heroTitlePart1"))}{" "}
              <span className="text-primary">
                {localized(pageSettings.hero.highlight, lang, t("corporate.heroTitlePart2"))}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-white/78 md:text-lg">
              {localized(pageSettings.hero.description, lang, t("corporate.heroDesc"))}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={pageSettings.hero.primaryHref || "#corporate-offer"}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white transition hover:bg-primary-hover active:scale-95"
              >
                {localized(pageSettings.hero.primaryLabel, lang, t("corporate.cta.primary"))}
                <Send sx={{ fontSize: 18 }} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Container maxWidth="xl" className="relative z-10">
        <section className="my-16">
          <div className="mb-8 max-w-3xl text-start">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
              {localized(pageSettings.features.eyebrow, lang, t("corporate.features.eyebrow"))}
            </p>
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
              {localized(pageSettings.features.title, lang, t("corporate.features.title"))}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {displayedBenefits.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  {React.cloneElement(item.icon, { sx: { fontSize: 28 } })}
                </div>
                <h3 className="text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="corporate-services" className="my-16">
          <div className="mb-8 max-w-3xl text-start">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
              {localized(pageSettings.services.eyebrow, lang, t("corporate.services.eyebrow"))}
            </p>
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
              {localized(pageSettings.services.title, lang, t("corporate.services.title"))}
            </h2>
            <p className="mt-5 text-sm font-bold leading-7 text-slate-400">
              {localized(pageSettings.services.text, lang, t("corporate.steps.text"))}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {displayedServices.map((service) => (
              <div
                key={service.title}
                className="flex min-h-[260px] flex-col rounded-[2rem] border border-white/10 bg-white/[0.035] p-6"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  {React.cloneElement(service.icon, { sx: { fontSize: 28 } })}
                </div>
                <h3 className="text-xl font-black text-white">{service.title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-400">
                  {service.text}
                </p>
                <div className="mt-auto pt-6">
                  <div className="h-px w-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 overflow-hidden rounded-[2rem] border border-primary/25 bg-primary/10 p-6 md:rounded-[3rem] md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
                {localized(pageSettings.cta.eyebrow, lang, t("corporate.midCta.eyebrow"))}
              </p>
              <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
                {localized(pageSettings.cta.title, lang, t("corporate.midCta.title"))}
              </h2>
              <p className="mt-4 text-sm font-bold leading-7 text-slate-400">
                {localized(pageSettings.cta.text, lang, t("corporate.midCta.text"))}
              </p>
            </div>
            <a
              href="#corporate-offer"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white transition hover:bg-primary-hover"
            >
              {localized(pageSettings.cta.action, lang, t("corporate.cta.primary"))}
              <Send sx={{ fontSize: 18 }} />
            </a>
          </div>
        </section>

        <section className="mb-16 rounded-[2rem] border border-primary/20 bg-primary/10 p-5 md:rounded-[3rem] md:p-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
                {localized(pageSettings.steps.eyebrow, lang, t("corporate.steps.eyebrow"))}
              </p>
              <h2 className="text-3xl font-black leading-tight text-white">
                {localized(pageSettings.steps.title, lang, t("corporate.steps.title"))}
              </h2>
            </div>
            <p className="max-w-2xl text-sm font-bold leading-7 text-slate-400">
              {localized(pageSettings.steps.text, lang, t("corporate.steps.text"))}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {displayedSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-black text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-black leading-7 text-white">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8 max-w-3xl text-start">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
              {localized(pageSettings.faq.eyebrow, lang, t("corporate.faq.eyebrow"))}
            </p>
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
              {localized(pageSettings.faq.title, lang, t("corporate.faq.title"))}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {displayedFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <summary className="cursor-pointer list-none text-base font-black text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm font-bold leading-7 text-slate-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="corporate-offer"
          className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:rounded-[3rem] md:p-8"
        >
          <div className="mb-8 max-w-3xl text-start">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
              {localized(pageSettings.form.eyebrow, lang, t("corporate.form.eyebrow"))}
            </p>
            <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
              {localized(pageSettings.form.title, lang, t("corporate.form.title"))}
            </h2>
            <p className="mt-4 text-sm font-bold leading-7 text-slate-400">
              {localized(pageSettings.form.text, lang, t("corporate.form.text"))}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["companyName", t("corporate.form.companyName")],
              ["contactName", t("corporate.form.contactName")],
              ["phone", t("corporate.form.phone")],
              ["city", t("corporate.form.city")],
              ["fleetSize", t("corporate.form.fleetSize")],
              ["duration", t("corporate.form.duration")],
            ].map(([field, label]) => (
              <label key={field} className="block text-start">
                <span className="mb-2 block text-sm font-black text-white">{label}</span>
                <input
                  required={field !== "duration"}
                  value={formData[field]}
                  onChange={(event) => updateForm(field, event.target.value)}
                  className="min-h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-white outline-none transition focus:border-primary"
                  dir={field === "phone" ? "ltr" : i18n.dir()}
                />
              </label>
            ))}

            <label className="block text-start md:col-span-2">
              <span className="mb-2 block text-sm font-black text-white">
                {t("corporate.form.message")}
              </span>
              <textarea
                value={formData.message}
                onChange={(event) => updateForm("message", event.target.value)}
                rows={5}
                className="min-h-36 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold leading-7 text-white outline-none transition focus:border-primary"
                placeholder={localized(pageSettings.form.placeholder, lang, t("corporate.form.placeholder"))}
              />
            </label>

            <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  {localized(pageSettings.form.sendTo, lang, t("corporate.form.sendTo"))}
                </p>
                <p className="mt-2 break-words text-sm font-black text-white" dir="ltr">
                  {contactEmail}
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white transition hover:bg-primary-hover active:scale-[0.99]"
              >
                <Send sx={{ fontSize: 18 }} />
                {localized(pageSettings.form.submit, lang, t("corporate.form.submit"))}
              </button>
            </div>
          </form>
        </section>
      </Container>
    </div>
  );
}
