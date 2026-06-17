"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Email, LocationOn, Phone, Send, WhatsApp } from "@mui/icons-material";
import { settingService } from "@/services/api";
import { localized } from "./homeSettings";
import { useHomeSettings } from "./useHomeSettings";

const ContactCard = ({ item }) => {
  const content = (
    <div className="group flex h-full min-h-40 flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-start shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white/[0.065] active:scale-[0.99]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          {item.label}
        </p>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
          {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
        </div>
      </div>
      <p
        className="mt-6 break-words text-lg font-black leading-7 text-white"
        dir={item.dir}
      >
        {item.value}
      </p>
    </div>
  );

  if (!item.href) return content;

  return (
    <Link
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={item.label}
    >
      {content}
    </Link>
  );
};

export default function HomeContact() {
  const { t, i18n } = useTranslation("common");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const isArabic = i18n.language?.startsWith("ar");
  const { settings } = useHomeSettings();
  const lang = i18n.language;
  const content = settings.contact;

  const { data: contactData } = useQuery({
    queryKey: ["setting", "contact_info"],
    queryFn: () => settingService.getOne("contact_info"),
    staleTime: 1000 * 60 * 10,
  });

  const contact = contactData?.data || {
    phone: "966554118873",
    whatsapp: "966554118873",
    email: "Team@C4Rplatform.com",
  };
  const phone = contact.phone || "966554118873";
  const whatsapp = contact.whatsapp || phone;
  const email = contact.email || "Team@C4Rplatform.com";
  const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;
  const normalizedWhatsapp = whatsapp.startsWith("+") ? whatsapp : `+${whatsapp}`;
  if (!settings.sections.contact) return null;

  const copy = {
    eyebrow: localized(content.eyebrow, lang),
    title: localized(content.title, lang),
    text: localized(content.text, lang),
    name: isArabic ? "الاسم" : "Name",
    phone: isArabic ? "رقم الجوال" : "Phone number",
    message: isArabic ? "رسالتك" : "Message",
    placeholderName: isArabic ? "اكتب اسمك" : "Enter your name",
    placeholderPhone: isArabic ? "مثال: 9665xxxxxxxx" : "Example: 9665xxxxxxxx",
    placeholderMessage: isArabic
      ? "ما المدينة والمدة ونوع السيارة المطلوب؟"
      : "Which city, duration, and car type do you need?",
    submit: localized(content.submit, lang),
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(isArabic ? "طلب تواصل من الموقع" : "Website contact request");
    const body = encodeURIComponent(
      `${copy.name}: ${formData.name}\n${copy.phone}: ${formData.phone}\n${copy.message}: ${formData.message}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const cards = [
    {
      icon: <WhatsApp />,
      label: t("homeSections.contact.whatsapp", {
        defaultValue: isArabic ? "واتساب" : "WhatsApp",
      }),
      value: normalizedWhatsapp,
      href: `https://wa.me/${String(whatsapp).replace(/\+/g, "")}`,
      dir: "ltr",
    },
    {
      icon: <Phone />,
      label: t("homeSections.contact.phone", {
        defaultValue: isArabic ? "الهاتف" : "Phone",
      }),
      value: normalizedPhone,
      href: `tel:${phone}`,
      dir: "ltr",
    },
    {
      icon: <Email />,
      label: t("homeSections.contact.email", {
        defaultValue: isArabic ? "البريد الإلكتروني" : "Email",
      }),
      value: email,
      href: `mailto:${email}`,
      dir: "ltr",
    },
    {
      icon: <LocationOn />,
      label: t("homeSections.contact.coverage", {
        defaultValue: isArabic ? "التغطية" : "Coverage",
      }),
      value: t("homeSections.contact.cities", {
        defaultValue: localized(content.coverage, lang),
      }),
      dir: i18n.dir(),
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20" dir={i18n.dir()}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`mb-8 md:mb-12 ${isArabic ? "text-right" : "text-left"}`}>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
            {copy.eyebrow}
          </p>
          <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-slate-400 sm:text-base">
            {copy.text}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => (
              <ContactCard key={item.label} item={item} />
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-6 md:rounded-[3rem] md:p-8 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div className="rounded-[1.5rem] border border-primary/20 bg-primary/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                {copy.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-black leading-tight text-white">
                {copy.title}
              </h3>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-400">
                {copy.text}
              </p>
            </div>

            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-start">
                  <span className="mb-2 block text-sm font-black text-white">
                    {copy.name}
                  </span>
                  <input
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                    className="min-h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-base font-bold text-white outline-none transition focus:border-primary"
                    placeholder={copy.placeholderName}
                  />
                </label>

                <label className="block text-start">
                  <span className="mb-2 block text-sm font-black text-white">
                    {copy.phone}
                  </span>
                  <input
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    required
                    inputMode="tel"
                    dir="ltr"
                    className="min-h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-base font-bold text-white outline-none transition focus:border-primary"
                    placeholder={copy.placeholderPhone}
                  />
                </label>
              </div>

              <label className="mt-4 block text-start">
                <span className="mb-2 block text-sm font-black text-white">
                  {copy.message}
                </span>
                <textarea
                  value={formData.message}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  required
                  rows={5}
                  className="min-h-40 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-bold leading-7 text-white outline-none transition focus:border-primary"
                  placeholder={copy.placeholderMessage}
                />
              </label>

              <button
                type="submit"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover active:scale-[0.99] sm:w-auto"
              >
                <Send sx={{ fontSize: 18 }} />
                {copy.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
