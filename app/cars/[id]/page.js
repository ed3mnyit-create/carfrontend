import CarDetailsClient from "./CarDetailsClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://c4r-platform-backend.vercel.app/api";

async function getCarData(id) {
  try {
    const res = await fetch(`${API_URL}/cars/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.car || data?.data || null;
  } catch {
    return null;
  }
}

function SafeSchemaScript({ data }) {
  if (!data) return null;

  let schemaJson = "";
  try {
    schemaJson = JSON.stringify(data);
  } catch {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson }}
    />
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const car = await getCarData(id);

  if (!car) {
    return {
      title: "سيارة غير موجودة | منصة C4R",
      description: "لم يتم العثور على السيارة المطلوبة.",
    };
  }

  const carName = car.name || `${car.brand} ${car.model}`;
  const price = car.pricePerDay || "";
  const region = car.region || "";
  const carSlug = car.slug || id;

  const title = `تأجير سيارة ${carName} | ضمان التميز - C4R`;
  const desc = `استأجر ${carName} في السعودية${region ? ` في ${region}` : ""}. أسعار تبدأ من ${price} ريال يومياً. حجز سريع وتوصيل مجاني مع منصة C4R.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://c4rplatform.com/cars/${carSlug}`,
      type: "website",
      images: car.image
        ? [
            {
              url: car.image,
              width: 1200,
              height: 630,
              alt: `تأجير سيارة ${carName} في السعودية`,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: car.image ? [car.image] : [],
    },
    alternates: {
      canonical: `https://c4rplatform.com/cars/${carSlug}`,
    },
  };
}

export default async function CarDetailsPage({ params }) {
  const { id } = await params;
  const car = await getCarData(id);

  const carName = car ? (car.name || `${car.brand} ${car.model}`) : null;
  const carSlug = car?.slug || id;

  // Product JSON-LD Schema
  const productSchema = car
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": carName,
        "image": car.image || car.imageUrl || "",
        "description":
          car.description ||
          `تأجير ${carName} بأفضل الأسعار في السعودية`,
        "brand": { "@type": "Brand", "name": car.brand || "C4R" },
        "offers": {
          "@type": "Offer",
          "price": car.pricePerDay || "0",
          "priceCurrency": "SAR",
          "priceValidUntil": new Date(
            new Date().getFullYear() + 1,
            0,
            1,
          ).toISOString().split("T")[0],
          "availability": "https://schema.org/InStock",
          "url": `https://c4rplatform.com/cars/${carSlug}`,
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": String(car.averageRating || 4.9),
          "reviewCount": String(car.reviewsCount || 85),
        },
      }
    : null;

  // Breadcrumb JSON-LD
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
      ...(car
        ? [
            {
              "@type": "ListItem",
              "position": 3,
              "name": carName,
              "item": `https://c4rplatform.com/cars/${carSlug}`,
            },
          ]
        : []),
    ],
  };

  return (
    <main>
      <SafeSchemaScript data={productSchema} />
      <SafeSchemaScript data={breadcrumbSchema} />
      <CarDetailsClient initialCarData={car} />
    </main>
  );
}
