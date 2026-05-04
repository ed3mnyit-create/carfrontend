import WithDriverPageClient from "./WithDriverPageClient";

export const metadata = {
  title: "تأجير سيارات فخمة مع سائق | أسعار تبدأ من 200 ريال | C4R",
  description:
    "استأجر سيارة مع سائق محترف في السعودية (الرياض، جدة، الدمام). خدمة VIP للشخصيات، مشاوير مطار، وتوصيل آمن. أسعار تبدأ من 200 ريال لخدمات التأجير اليومي.",
  openGraph: {
    title: "تأجير سيارات فخمة مع سائق | خدمة VIP توصيل واستقبال - C4R",
    description: "أفضل خدمة تأجير سيارات بسائق في المملكة. سيارات فخمة واقتصادية بأسعار تنافسية.",
    url: "https://c4rplatform.com/with-driver",
  },
  alternates: {
    canonical: "https://c4rplatform.com/with-driver",
  },
};

export default function WithDriverPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://c4rplatform.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "سيارة مع سائق",
        "item": "https://c4rplatform.com/with-driver",
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <WithDriverPageClient />
    </main>
  );
}
