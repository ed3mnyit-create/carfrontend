import IndividualsPageClient from "./IndividualsPageClient";

export const metadata = {
  title: "تأجير سيارات أفراد | أسعار تبدأ من 200 ريال | عروض حصرية - C4R",
  description:
    "احجز سيارتك المفضلة للإيجار اليومي أو الشهري بأفضل الأسعار. تشكيلة سيارات اقتصادية وعائلية بأسعار تبدأ من 200 ريال في الرياض، جدة، والدمام من منصة C4R.",
  openGraph: {
    title: "تأجير سيارات أفراد | عروض حصرية يومية وشهرية - C4R",
    description: "اطلع على أفضل عروض الإيجار اليومي والشهري للسيارات في السعودية بأسعار تبدأ من 200 ريال.",
    url: "https://c4rplatform.com/individuals",
  },
  alternates: {
    canonical: "https://c4rplatform.com/individuals",
  },
};

export default function IndividualsPage() {
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
        "name": "خدمات الأفراد",
        "item": "https://c4rplatform.com/individuals",
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <IndividualsPageClient />
    </main>
  );
}
