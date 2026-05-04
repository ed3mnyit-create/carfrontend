import AllCarsPageClient from "./AllCarsPageClient";

export const metadata = {
  title: "تشكيلة سيارات للإيجار | أسعار تبدأ من 200 ريال | C4R",
  description:
    "تصفح تشكيلة واسعة من السيارات للإيجار في السعودية بأسعار تبدأ من 200 ريال لليوم. سيارات فارهة، عائلية، واقتصادية بأسعار منافسة في الرياض، جدة، وغيرها من المدن.",
  openGraph: {
    title: "تشكيلة سيارات للإيجار | سيارات فارهة واقتصادية | C4R",
    description: "تصفح أسطول سيارات C4R واحجز سيارتك المفضلة اليوم بأسعار تبدأ من 200 ريال.",
    url: "https://c4rplatform.com/cars",
  },
  alternates: {
    canonical: "https://c4rplatform.com/cars",
  },
};

export default function AllCarsPage() {
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
        "name": "السيارات",
        "item": "https://c4rplatform.com/cars",
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AllCarsPageClient />
    </main>
  );
}
