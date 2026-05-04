"use client";

import React from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import FAQ from "@/components/home/FAQ";
import { QuestionAnswer } from "@mui/icons-material";

const FAQPageClient = () => {
  const breadcrumbItems = [{ label: "الأسئلة الشائعة" }];

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

          <div className="text-center mb-16 relative z-10" dir="rtl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6 border border-primary/20">
              <QuestionAnswer fontSize="small" />
              <span className="font-black text-xs uppercase tracking-widest">
                الأسئلة الشائعة
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-8 italic">
              كل ما تود <span className="text-primary not-italic">معرفته</span>
            </h1>
            <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
              جمعنا لك أكثر الأسئلة تكراراً لتوفير وقتك. إذا لم تجد ما تبحث عنه،
              فريقنا متاح دائماً عبر الواتساب.
            </p>
          </div>

          <div className="relative z-10">
            <FAQ />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPageClient;
