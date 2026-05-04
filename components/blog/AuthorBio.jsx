"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Verified } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const AuthorBio = () => {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 my-10">
      <div className="flex items-start gap-5">
        {/* Circle Avatar with Ring */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-transparent">
            <Image 
              src="/images/logo.jpeg" 
              alt="C4R Automotive Experts" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
            <Verified sx={{ fontSize: 14 }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-base md:text-lg font-bold text-white">
              {t("blog.author.title")}
            </h4>
          </div>
          
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
            {t("blog.author.description")}
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              {t("blog.author.learnMore")}
            </Link>
            
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary/80 text-xs font-medium px-3 py-1.5 rounded-full">
              <Verified sx={{ fontSize: 12 }} />
              {t("blog.author.trustedBadge")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
