"use client";

import React from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  Shield,
  Lock,
  Visibility,
  Email,
  WhatsApp,
  History,
  Info,
  Policy,
} from "@mui/icons-material";

const PrivacyPageClient = () => {
  const breadcrumbItems = [{ label: "سياسة الخصوصية" }];

  const sections = [
    {
      title: "مقدمة",
      icon: <Policy />,
      content:
        "في منصة C4R نحترم خصوصية عملائنا وشركائنا ونلتزم بحماية جميع المعلومات التي يتم مشاركتها معنا أثناء استخدام خدماتنا.",
    },
    {
      title: "1. جمع المعلومات",
      icon: <Info />,
      content: [
        "نجمع المعلومات التي يقدّمها العميل طوعًا أثناء التواصل معنا عبر الواتساب أو البريد الإلكتروني، وتشمل:",
        "الاسم الكامل.",
        "رقم الهوية أو الرخصة (للأفراد).",
        "السجل التجاري ورقم المنشأة الضريبي (للشركات).",
        "رقم الجوال وبيانات التواصل.",
        "معلومات السيارة المطلوبة وطريقة الدفع.",
      ],
    },
    {
      title: "2. استخدام المعلومات",
      icon: <Visibility />,
      content: [
        "نستخدم هذه المعلومات للأغراض التالية:",
        "تنفيذ طلبات التأجير ومشاركتها مع شركات التأجير المتعاقدة معنا.",
        "التواصل مع العميل لتأكيد الطلب أو متابعة الحالة.",
        "تحسين تجربة المستخدم وجودة الخدمة.",
        "حفظ السجلات المالية والإدارية عند الحاجة القانونية.",
      ],
    },
    {
      title: "3. مشاركة المعلومات",
      icon: <Shield />,
      content: [
        "قد نشارك بعض المعلومات الضرورية فقط مع:",
        "شركات ومكاتب التأجير المتعاقدة معنا لتنفيذ الخدمة.",
        "الجهات القانونية عند الطلب الرسمي أو الامتثال للأنظمة.",
        "لا نقوم ببيع أو مشاركة بيانات العملاء مع أي جهة خارجية لأغراض تسويقية.",
      ],
    },
    {
      title: "4. حماية المعلومات",
      icon: <Lock />,
      content:
        "نلتزم بحفظ بيانات العملاء بسرية تامة، ويتم التعامل معها من خلال قنوات رسمية وآمنة (الواتساب بزنس والبريد الرسمي)، مع منع الوصول إليها إلا من قبل موظفين مخوّلين.",
    },
    {
      title: "5. حقوق العميل",
      icon: <Info />,
      content: [
        "للعميل الحق في:",
        "طلب تحديث أو تصحيح بياناته.",
        "طلب حذف بياناته بعد انتهاء الخدمة (ما لم يكن هناك التزام نظامي بالاحتفاظ بها).",
      ],
    },
    {
      title: "6. ملفات تعريف الارتباط (Cookies)",
      icon: <Lock />,
      content:
        "قد يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة الاستخدام، دون جمع معلومات شخصية مباشرة.",
    },
    {
      title: "7. التعديلات على السياسة",
      icon: <History />,
      content:
        "تحتفظ منصة C4R بالحق في تحديث أو تعديل سياسة الخصوصية عند الحاجة، وسيتم نشر آخر نسخة محدثة في الموقع.",
    },
    {
      title: "8. التواصل معنا",
      icon: <Email />,
      content: [
        "لأي استفسارات بخصوص سياسة الخصوصية أو البيانات الشخصية، يمكن التواصل عبر:",
        "📞 واتساب: +966554118873",
        "📧 البريد الإلكتروني: Team@C4Rplatform.com",
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
            سياسة <span className="text-primary italic">الخصوصية</span>
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

                <div className="pr-19 text-slate-400 text-lg md:text-xl font-bold leading-relaxed">
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-4">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="w-2 h-2 rounded-full bg-primary/40 mt-3 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{section.content}</p>
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

export default PrivacyPageClient;
