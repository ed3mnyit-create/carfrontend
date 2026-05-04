import CorporatePageClient from "./CorporatePageClient";

export const metadata = {
  title: "تأجير سيارات للشركات | عروض وعقود حصرية لقطاع الأعمال | C4R",
  description:
    "حلول تأجير السيارات للشركات والمؤسسات في السعودية. أسطول حديث، أسعار تبدأ من 200 ريال لليوم، وعقود مرنة للشركات في الرياض وجدة وكافة أنحاء المملكة.",
  openGraph: {
    title: "تأجير سيارات للشركات | عروض وخصومات حصرية - C4R",
    description: "حلول تأجير السيارات للشركات والمؤسسات بأسعار مميزة وعقود مرنة بأسعار تبدأ من 200 ريال.",
    url: "https://c4rplatform.com/corporate",
  },
  alternates: {
    canonical: "https://c4rplatform.com/corporate",
  },
};

export default function CorporatePage() {
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
        "name": "خدمات الشركات",
        "item": "https://c4rplatform.com/corporate",
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CorporatePageClient />
    </main>
  );
}
