import AboutPageClient from "./AboutPageClient";

export const metadata = {
  title: "من نحن | C4R أفضل منصة لتأجير السيارات في السعودية",
  description:
    "تعرف على منصة C4R، الوسيط الموثوق الأسرع نمواً في السعودية لتأجير السيارات الاقتصادية والفاخرة. نربطك بأفضل مكاتب التأجير مع دعم عملاء على مدار الساعة.",
  openGraph: {
    title: "من نحن | C4R أفضل منصة لتأجير السيارات في السعودية",
    description: "تعرف على منصة C4R، الوجهة الأولى لتأجير السيارات في المملكة بخيارات متنوعة وأسعار تنافسية.",
    url: "https://c4rplatform.com/about",
  },
  alternates: {
    canonical: "https://c4rplatform.com/about",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutPageClient />
    </main>
  );
}
