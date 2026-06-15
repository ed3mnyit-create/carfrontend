import HeroAd from "@/components/home/HeroAd";
import Departments from "@/components/home/Departments";
import PromoSection from "@/components/PromoSection";
import FAQ from "@/components/home/FAQ";
import ReviewMarquee from "@/components/home/ReviewMarquee";
import HomeSections from "@/components/home/HomeSections";
import HomeContact from "@/components/home/HomeContact";

export const metadata = {
  title: "أرخص تأجير سيارات في السعودية | أسعار تبدأ من 200 ريال | C4R",
  description: "منصة C4R هي الخيار الأول لتأجير السيارات في المملكة. تصفح عروض تبدأ من 200 ريال لليوم. حجز أونلاين سريع وسهل في الرياض وجدة وكافة المدن KSA.",
  alternates: {
    canonical: "https://c4rplatform.com",
  },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "ما هي شروط تأجير السيارات في السعودية؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يتطلب الحجز هوية سارية، رخصة قيادة معترف بها، وبطاقة ائتمان.",
        },
      },
      {
        "@type": "Question",
        "name": "هل توفرون سيارات مع سائق؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، لدينا خدمة تأجير سيارات بسائق خاص في جميع مدن المملكة.",
        },
      },
      {
        "@type": "Question",
        "name": "ما هي المدن المتاحة للحجز؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نغطي الرياض، جدة، المنطقة الشرقية (الدمام، الخبر، الظهران) وقريباً مدن أخرى.",
        },
      },
      {
        "@type": "Question",
        "name": "هل يوجد حد أدنى لمدة الإيجار؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكنك استئجار سيارة بدءاً من يوم واحد. نوفر أيضاً عقود شهرية وسنوية بأسعار مخفضة.",
        },
      },
      {
        "@type": "Question",
        "name": "كيف يتم تأكيد الحجز؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بعد إرسال طلبك عبر المنصة، سيتواصل معك فريقنا عبر الواتساب لتأكيد الحجز وترتيب التسليم.",
        },
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "C4R Platform",
    "alternateName": ["سي فور آر لتأجير السيارات", "C4R Car Rental Saudi Arabia"],
    "description": "منصة لتأجير السيارات في السعودية أونلاين بأسعار تبدأ من 200 ريال. حجز سيارة فخمة أو اقتصادية بأرخص الأسعار.",
    "keywords": "تأجير سيارات في السعودية, أرخص تأجير سيارات, تأجير سيارات الرياض, rent a car KSA, car rental Saudi",
    "url": "https://c4rplatform.com",
    "logo": "https://c4rplatform.com/images/logo.jpeg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966554118873",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "English"],
      "areaServed": "SA",
    },
    "sameAs": [
      "https://www.instagram.com/C4R_Platform",
      "https://x.com/C4R_Platform",
      "https://www.tiktok.com/@C4R.Platform",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "C4R Platform",
    "alternateName": "منصة سي فور آر",
    "url": "https://c4rplatform.com",
  };

  return (
    <main className="min-h-screen pb-24">
      {/* Homepage-only JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <HeroAd />
      <Departments />
      <HomeSections />
      <PromoSection />
      <ReviewMarquee />
      {/* <Partners /> */}
      <FAQ />
      <HomeContact />
    </main>
  );
}
