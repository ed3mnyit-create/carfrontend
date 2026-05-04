"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore, HelpOutline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t, i18n } = useTranslation("common");
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      id: "panel1",
      question: t("faq.q1.question"),
      answer: t("faq.q1.answer"),
    },
    {
      id: "panel2",
      question: t("faq.q2.question"),
      answer: t("faq.q2.answer"),
    },
    {
      id: "panel3",
      question: t("faq.q3.question"),
      answer: t("faq.q3.answer"),
    },
    {
      id: "panel4",
      question: t("faq.q4.question"),
      answer: t("faq.q4.answer"),
    },
    {
      id: "panel5",
      question: t("faq.q5.question"),
      answer: t("faq.q5.answer"),
    },
    {
      id: "panel6",
      question: t("faq.q6.question"),
      answer: t("faq.q6.answer"),
    },
    {
      id: "panel7",
      question: t("faq.q7.question"),
      answer: t("faq.q7.answer"),
    },
    {
      id: "panel8",
      question: t("faq.q8.question"),
      answer: t("faq.q8.answer"),
    },
    {
      id: "panel9",
      question: t("faq.q9.question"),
      answer: t("faq.q9.answer"),
    },
  ];

  return (
    <section className="py-24 bg-transparent relative" dir={i18n.dir()}>
      {/* Background Decorative Asset */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
              <HelpOutline className="text-primary" sx={{ fontSize: 32 }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter">
              {t("faq.titlePart1")}{" "}
              <span className="text-primary">{t("faq.titlePart2")}</span>
            </h2>
          </div>
          <p className="text-slate-400 font-bold max-w-xl mx-auto">
            {t("faq.description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="mb-2">
              <Accordion
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  color: "#fff",
                  borderRadius: "24px !important",
                  border:
                    expanded === faq.id
                      ? "1px solid var(--primary)"
                      : "1px solid rgba(255,255,255,0.05)",
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
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
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
                      color: expanded === faq.id ? "var(--primary)" : "#f8fafc",
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
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "var(--font-almarai), sans-serif",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
