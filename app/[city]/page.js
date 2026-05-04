// This is the client component
import CityPageClient from "./CityPageClient";

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityNames = {
    riyadh: "مدينة الرياض",
    jeddah: "مدينة جدة",
    eastern: "المنطقة الشرقية",
  };
  const cityName = cityNames[city] || city;

  return {
    title: `أرخص تأجير سيارات في ${cityName} | أسعار تبدأ من 200 ريال | C4R`,
    description: `أفضل عروض تأجير السيارات في ${cityName} بأسعار تبدأ من 200 ريال. احجز سيارتك أونلاين بأفضل الأسعار. تأجير يومي وشهري للسيارات الاقتصادية والفخمة. Affordable car rental in ${city} from 200 SAR.`,
    alternates: {
      canonical: `https://c4rplatform.com/${city}`,
    },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const cityNames = {
    riyadh: "مدينة الرياض",
    jeddah: "مدينة جدة",
    eastern: "المنطقة الشرقية",
  };
  const cityName = cityNames[city] || city;

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
        "name": `تأجير سيارات في ${cityName}`,
        "item": `https://c4rplatform.com/${city}`,
      },
    ],
  };

  const citySchemas = {
    riyadh: {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      "name": "تأجير سيارات الرياض - C4R",
      "url": "https://c4rplatform.com/riyadh",
      "description": "أرخص خدمات تأجير السيارات في الرياض بأسعار تبدأ من 200 ريال.",
      "image": "https://c4rplatform.com/images/logo.jpeg",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Riyadh",
        "addressRegion": "Riyadh",
        "addressCountry": "SA",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "450",
      },
      "priceRange": "SAR 200 - SAR 3000",
    },
    jeddah: {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      "name": "تأجير سيارات جدة - C4R",
      "url": "https://c4rplatform.com/jeddah",
      "description": "أرخص خدمات تأجير السيارات في جدة بأسعار تبدأ من 200 ريال.",
      "image": "https://c4rplatform.com/images/logo.jpeg",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jeddah",
        "addressRegion": "Makkah Region",
        "addressCountry": "SA",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "320",
      },
      "priceRange": "SAR 200 - SAR 3000",
    },
    eastern: {
      "@context": "https://schema.org",
      "@type": "AutoRental",
      "name": "تأجير سيارات الشرقية - C4R",
      "url": "https://c4rplatform.com/eastern",
      "description": "أرخص خدمات تأجير السيارات في الدمام والخبر بأسعار تبدأ من 200 ريال.",
      "image": "https://c4rplatform.com/images/logo.jpeg",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dammam",
        "addressRegion": "Eastern Province",
        "addressCountry": "SA",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "210",
      },
      "priceRange": "SAR 200 - SAR 3000",
    },
  };

  const schema = citySchemas[city];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CityPageClient city={city} cityName={cityName} />
    </>
  );
}
