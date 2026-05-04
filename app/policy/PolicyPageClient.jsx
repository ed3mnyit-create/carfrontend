"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  AssignmentReturn,
  CheckCircle,
  Gavel,
  History,
  PriceCheck,
  Warning,
} from "@mui/icons-material";

const PolicyPageClient = () => {
  const { t, i18n } = useTranslation("common");
  const breadcrumbItems = [{ label: t("policy.pageTitle") }];

  const categories = [
    {
      title: t("policy.cancelTitle"),
      icon: <AssignmentReturn />,
      items: [t("policy.cancelItem1"), t("policy.cancelItem2")],
    },
    {
      title: t("policy.exchangeTitle"),
      icon: <CheckCircle />,
      items: [t("policy.exchangeItem1"), t("policy.exchangeItem2")],
    },
    {
      title: t("policy.refundTitle"),
      icon: <PriceCheck />,
      items: [t("policy.refundItem1"), t("policy.refundItem2")],
    },
    {
      title: t("policy.exceptionsTitle"),
      icon: <Warning />,
      items: [t("policy.exceptionsItem1"), t("policy.exceptionsItem2")],
    },
  ];

  return (
    <div
      className="min-h-screen bg-transparent pt-32 pb-20 px-6 overflow-hidden"
      dir={i18n.dir()}
    >
      <div className="max-w-5xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 border border-white/10 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

          <h1 className="text-2xl md:text-4xl font-black text-white mb-12 tracking-tighter relative z-10 leading-tight">
            {t("policy.titlePart1")}{" "}
            <span className="text-primary italic">
              {t("policy.titlePart2")}
            </span>
          </h1>

          <div className="space-y-16 relative z-10">
            {categories.map((category, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                    {category.icon}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                    {category.title}
                  </h2>
                </div>

                <div className="pr-19 font-bold text-lg md:text-xl leading-relaxed text-slate-400">
                  <ul className="space-y-4">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/30 mt-2.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 text-center relative z-10">
            <p className="text-slate-500 font-bold italic">
              {t("policy.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPageClient;
