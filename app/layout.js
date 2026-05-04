import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ClientLayout from "@/components/layout/ClientLayout";
import Providers from "./providers";
import { Almarai } from "next/font/google";
import "./globals.css";

// NUCLEAR HYDRATION FIX: 
// We use a dedicated ClientLayout (Client Component) to handle all 
// components that rely on client-side state. 
// The ClientLayout itself handles the dynamic loading with ssr: false.

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

export const viewport = {
  themeColor: "#0D1117",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: {
    default: "منصة C4R | أفضل تأجير سيارات في السعودية | Car Rental KSA",
    template: "%s | C4R Platform | تأجير سيارات",
  },
  description:
    "احجز مع منصة C4R أفضل وأرخص سيارات للإيجار في السعودية بأسعار تبدأ من 200 ريال. نوفر تأجير سيارات فخمة واقتصادية، إيجار يومي وشهري في الرياض، جدة والشرقية. Best & affordable car rental in KSA starting from 200 SAR.",
  keywords: [
    "تأجير سيارات",
    "تأجير سيارات السعودية",
    "إيجار سيارات الرياض",
    "تأجير سيارات جدة",
    "أرخص تأجير سيارات",
    "C4R Platform",
    "Car Rental KSA",
    "Rent a car Riyadh",
  ],
  category: "Car Rental",
  metadataBase: new URL("https://c4rplatform.com"),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://c4rplatform.com",
    languages: {
      "ar-SA": "https://c4rplatform.com",
      "x-default": "https://c4rplatform.com",
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/images/logo.jpeg", sizes: "180x180", type: "image/jpeg" }],
  },
  openGraph: {
    title: "منصة C4R | أفضل تأجير سيارات في السعودية | Car Rental KSA",
    description:
      "احجز مع منصة C4R أفضل وأرخص سيارات للإيجار في السعودية. تأجير سيارات فخمة واقتصادية. بأسعار تبدأ من 200 ريال. Best car rental KSA.",
    url: "https://c4rplatform.com",
    siteName: "C4R Platform",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "https://c4rplatform.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "C4R Platform - أفضل تأجير سيارات في السعودية | Best Car Rental KSA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة C4R | تأجير سيارات في السعودية | Car Rental KSA",
    description:
      "أفضل وأرخص سيارات للإيجار في السعودية. حجز سريع وبأسعار تبدأ من 200 ريال. Best car rental KSA.",
    images: ["/images/logo.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${almarai.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
         <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "CarRental",
                      "@id": "https://c4rplatform.com/#carrental",
                      "name": "C4R Platform | سي فور آر لتأجير السيارات",
                      "alternateName": "C4R Car Rental Saudi Arabia",
                      "description": "Best and affordable car rental services in Saudi Arabia starting from 200 SAR. Rent cheap, luxury, and economy cars in Riyadh, Jeddah, and Eastern Province.",
                      "logo": "https://c4rplatform.com/images/logo.jpeg",
                      "url": "https://c4rplatform.com",
                      "telephone": "+966554118873",
                      "priceRange": "SAR 200 - SAR 5000",
                      "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "SA",
                        "addressRegion": "Riyadh",
                        "addressLocality": "Riyadh",
                        "streetAddress": "الرياض، المملكة العربية السعودية"
                      },
                      "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": "1250"
                      },
                      "sameAs": [
                        "https://www.instagram.com/C4R_Platform",
                        "https://x.com/C4R_Platform",
                        "https://www.tiktok.com/@C4R.Platform"
                      ]
                    },
                    {
                      "@type": "WebSite",
                      "@id": "https://c4rplatform.com/#website",
                      "url": "https://c4rplatform.com/",
                      "name": "C4R Platform | سي فور آر لتأجير السيارات",
                      "description": "منصة C4R لتأجير السيارات الفاخرة والاقتصادية في المملكة العربية السعودية بأسعار تبدأ من 200 ريال.",
                      "inLanguage": "ar-SA",
                      "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                          "@type": "EntryPoint",
                          "urlTemplate": "https://c4rplatform.com/cars?search={search_term_string}"
                        },
                        "query-input": "required name=search_term_string"
                      }
                    }
                  ]
                }),
              }}
            />

            <Providers>
              <ClientLayout>{children}</ClientLayout>
            </Providers>
         </AppRouterCacheProvider>
      </body>
    </html>
  );
}
