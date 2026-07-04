"use client";
import React from "react";
import Link from "next/link";
import { DirectionsCar } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const DynamicContentCTA = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="my-12 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-6 text-right" dir="rtl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
             <DirectionsCar className="text-primary" />
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-black text-white mb-2">
               {t("blog.cta.dynamic.title")}
            </h4>
            <p className="text-slate-400 font-bold text-sm">
               {t("blog.cta.dynamic.subtitle")}
            </p>
          </div>
        </div>

        <Link 
          href="/cars" 
          className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black transition-all shadow-lg shadow-primary/20 shrink-0"
        >
          {t("blog.cta.dynamic.button")}
        </Link>
      </div>
    </div>
  );
};

export default DynamicContentCTA;
