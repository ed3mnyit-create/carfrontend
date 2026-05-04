"use client";

import React from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  Shield,
  Lock,
  Gavel,
  Visibility,
  Description,
  Update,
  ContactSupport,
} from "@mui/icons-material";

const TermsPageClient = () => {
  const breadcrumbItems = [{ label: "الشروط والأحكام" }];

  const sections = [
    {
      title: "من نحن والخدمة المقدمة",
      icon: <Shield />,
      content:
        "منصة C4R هي جهة وسيطة بين العميل وجهة التأجير، ولا تتحمل أي استخدام مخالف للأنظمة أو شروط المرور.",
    },
    {
      title: "صحة ومسؤولية البيانات",
      icon: <Lock />,
      content:
        "يجب أن تكون بيانات العميل صحيحة وكاملة، وأي خلل في البيانات قد يؤخّر تنفيذ الطلب.",
    },
    {
      title: "الأسعار والتوافر",
      icon: <Update />,
      content:
        "الأسعار تختلف حسب المدينة، نوع السيارة، المدة، والتوافر وقت الطلب.",
    },
    {
      title: "تأكيد الحجز",
      icon: <Visibility />,
      content:
        "حجز السيارة لا يُعتبر مؤكدًا إلا بعد تأكيدنا للعميل على الواتساب أو البريد.",
    },
    {
      title: "إلغاء الطلب",
      icon: <Gavel />,
      content:
        "في حال إلغاء الطلب بعد تأكيده قد تُطبّق رسوم إلغاء (حسب سياسة جهة التأجير).",
    },
    {
      title: "المخالفات والأضرار",
      icon: <Description />,
      content:
        "أي مخالفات أو أضرار على السيارة بعد الاستلام تقع على عهدة المستأجر حسب عقد شركة التأجير.",
    },
    {
      title: "حق الرفض",
      icon: <Shield />,
      content:
        "المنصة تحتفظ بحق رفض أي طلب غير مستوفٍ للشروط أو فيه بيانات غير صحيحة.",
    },
    {
      title: "سياسة التوصيل والاستلام",
      icon: <Update />,
      content: [
        "نوفر خدمة توصيل السيارة إلى موقع العميل واستلامها من نفس الموقع أو موقع آخر (حسب الاتفاق).",
        "قد تُضاف رسوم توصيل بحسب المدينة أو بُعد الموقع.",
        "في حال تأخير العميل عن وقت الاستلام أو التسليم قد تُحتسب رسوم إضافية من جهة التأجير.",
      ],
    },
    {
      title: "طرق الدفع",
      icon: <Lock />,
      content: [
        "تحويل بنكي على حساب المنصة.",
        "كاش عند الاستلام (في المدن التي تدعم الخدمة).",
        "(يُحدَّد خيار الدفع المناسب للعميل أثناء تأكيد الحجز على الواتساب)",
      ],
    },
    {
      title: "قنوات التواصل الرسمية",
      icon: <ContactSupport />,
      content: [
        "واتساب: +966554118873",
        "البريد الإلكتروني: Team@C4Rplatform.com",
        "جميع طلبات التأجير، إرسال المستندات، وتأكيد الحجز تتم عبر الواتساب بزنس أو الإيميل الخاص بالمنصة.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 border border-white/10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

          <h1 className="text-3xl md:text-5xl font-black text-white mb-12 tracking-tighter relative z-10">
            الشروط <span className="text-primary italic">والأحكام</span>
          </h1>

          <div className="space-y-12 relative z-10">
            {sections.map((section, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {section.icon}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="pr-19">
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className="text-slate-400 text-lg md:text-xl font-bold leading-relaxed flex items-center gap-3"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary/40" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 text-lg md:text-xl font-bold leading-relaxed">
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPageClient;
