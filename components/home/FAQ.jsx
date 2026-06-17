"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore, HelpOutline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { localized } from "./homeSettings";
import { useHomeSettings } from "./useHomeSettings";

const FAQ = () => {
  const { t, i18n } = useTranslation("common");
  const [expanded, setExpanded] = useState(false);
  const isArabic = i18n.language?.startsWith("ar");
  const { settings } = useHomeSettings();
  const lang = i18n.language;
  const faqSettings = settings.faq;

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!settings.sections.faq) return null;

  const faqs = (faqSettings.items || []).slice(0, 5).map((item, index) => ({
    id: `panel${index + 1}`,
    question: localized(item.question, lang),
    answer: localized(item.answer, lang),
  }));

  return (
    <section className="py-24 bg-transparent relative" dir={i18n.dir()}>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
              <HelpOutline className="text-primary" sx={{ fontSize: 32 }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
              {localized(faqSettings.titlePart1, lang)}{" "}
              <span className="text-primary">
                {localized(faqSettings.titlePart2, lang)}
              </span>
            </h2>
          </div>
          <p className="text-slate-400 font-bold max-w-xl mx-auto">
            {localized(faqSettings.description, lang)}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                sx={{
                  backgroundColor: "color-mix(in srgb, var(--midnight) 88%, transparent)",
                  color: "var(--foreground)",
                  borderRadius: "24px !important",
                  border:
                    expanded === faq.id
                      ? "1px solid var(--primary)"
                      : "1px solid var(--app-frame-border)",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    expanded === faq.id
                      ? "0 10px 40px rgba(249, 115, 22, 0.1)"
                      : "none",
                  marginBottom: "12px",
                  "&:before": { display: "none" },
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    backgroundColor: "color-mix(in srgb, var(--midnight) 94%, var(--primary) 6%)",
                    borderColor: "rgba(249, 115, 22, 0.35)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${expanded === faq.id ? "bg-primary text-white shadow-[0_5px_15px_rgba(249,115,22,0.4)]" : "bg-white/5 text-slate-400"}`}
                    >
                      <ExpandMore />
                    </div>
                  }
                  aria-controls={`${faq.id}-content`}
                  id={`${faq.id}-header`}
                  sx={{
                    px: { xs: 2, md: 4 },
                    py: 2,
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "var(--font-almarai), sans-serif",
                      fontWeight: expanded === faq.id ? "800" : "700",
                      color: expanded === faq.id ? "var(--primary)" : "var(--foreground)",
                      fontSize: { xs: "1rem", md: "1.15rem" },
                      transition: "all 0.4s",
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    px: { xs: 2, md: 4 },
                    pb: 4,
                    borderTop: "1px solid var(--app-frame-border)",
                    backgroundColor: "color-mix(in srgb, var(--background) 86%, var(--primary) 4%)",
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "var(--font-almarai), sans-serif",
                      fontWeight: "500",
                      color: "color-mix(in srgb, var(--foreground) 78%, transparent)",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>

          <div className="theme-dark-media relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl md:rounded-[3rem]">
            <Image
              src={faqSettings.image || "/images/car-with-driver.webp"}
              alt={localized(faqSettings.imageAlt, lang)}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/55 p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                C4R
              </p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-white">
                {localized(faqSettings.imageTitle, lang)}
              </h3>
              <p className="mt-3 text-sm font-bold leading-7 text-white/80">
                {localized(faqSettings.imageText, lang)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
