"use client";

import React from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  SupportAgent,
  LibraryAddCheck,
  DirectionsCar,
  VerifiedUser,
  AutoGraph,
  Handyman,
  WorkspacePremium,
  Info,
} from "@mui/icons-material";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { settingService } from "@/services/api";

const AboutPageClient = () => {
  const { data: aboutData } = useQuery({
    queryKey: ["setting", "about_content"],
    queryFn: () => settingService.getOne("about_content"),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const about = aboutData?.data || {
    badge: "من نحن",
    mainTitlePart1: "قصتنا في",
    mainTitlePart2: "C4R",
    description: "منصة C4R هي وجهتك الأولى لتأجير السيارات في المملكة العربية السعودية. بدأنا بهدف واحد: جعل عملية تأجير السيارات أسهل، أسرع، وأكثر شفافية. نحن لسنا مجرد موقع حجز؛ نحن شريكك في الطريق.",
    storyTitle: "لماذا منصة C4R؟",
    storyText: "نحن في منصة C4R نؤمن بأن استئجار سيارة يجب أن يكون تجربة ممتعة وخالية من القلق. لذلك قمنا ببناء نظام ذكي يربطك بأفضل مقدمي الخدمة في المملكة مع ضمان كامل الشفافية في الأسعار والجودة.",
    featuresTitle: "مميزاتنا",
    features: [
      {
        title: "منصة وسيطة موثوقة",
        icon: "LibraryAddCheck",
        description: "نعمل كوسيط بينك وبين أفضل مكاتب تأجير السيارات لضمان الجودة.",
      },
      {
        title: "تنوع الخيارات",
        icon: "DirectionsCar",
        description: "نقدم تشكيلة هائلة من السيارات الفاخرة، الاقتصادية، والعائلية.",
      },
      {
        title: "دعم على مدار الساعة",
        icon: "SupportAgent",
        description: "فريقنا متواجد دائماً لمساعدتك في أي استفسار أو مشكلة تواجهك.",
      },
    ],
  };

  const iconMap = {
    LibraryAddCheck: <LibraryAddCheck />,
    DirectionsCar: <DirectionsCar />,
    SupportAgent: <SupportAgent />,
    VerifiedUser: <VerifiedUser />,
    AutoGraph: <AutoGraph />,
    Handyman: <Handyman />,
    WorkspacePremium: <WorkspacePremium />,
    Info: <Info />,
  };

  const breadcrumbItems = [{ label: "من نحن" }];

  const features = about.features && about.features.length > 0 ? about.features : about.features;


  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto mb-12">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left Column: Text */}
            <div dir="rtl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6 border border-primary/20">
                <Info fontSize="small" />
                <span className="font-black text-xs uppercase tracking-widest">
                  {about.badge}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                {about.mainTitlePart1} <span className="text-primary italic">{about.mainTitlePart2}</span>
              </h1>
              <p className="text-xl text-slate-400 font-bold leading-relaxed mb-10">
                {about.description}
              </p>

              <div className="space-y-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shrink-0">
                      {iconMap[feature.icon] || <Info />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-2">
                        {feature.title}
                      </h2>
                      <p className="text-slate-500 font-bold">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Image/Visual */}
            <div className="relative">
              <div className="aspect-square rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative bg-white/5 flex items-center justify-center p-8">
                <Image
                  src="/images/logo.jpeg"
                  alt="شعار منصة C4R لتأجير السيارات في السعودية"
                  width={400}
                  height={200}
                  className="object-contain logo-premium-glow"
                  style={{
                    filter: "brightness(1.5) contrast(1.1)",
                    maxHeight: "220px",
                    width: "auto",
                  }}
                />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -right-8 bg-midnight/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-xs md:max-w-none">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-primary">+١٠٠</div>
                  <div className="text-slate-300 font-bold">
                    مكتب تأجير <br />
                    متعاقد
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageClient;
