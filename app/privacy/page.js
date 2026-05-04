import PrivacyPageClient from "./PrivacyPageClient";

export const metadata = {
  title: "سياسة الخصوصية | منصة C4R للمحافظة على بياناتك",
  description: "نلتزم في منصة C4R لتأجير السيارات في السعودية بأعلى معايير الحماية لبيانات عملائنا. اقرأ سياسة الخصوصية لمعرفة كيف نحمي معلوماتك.",
  openGraph: {
    title: "سياسة الخصوصية | منصة C4R للمحافظة على بياناتك",
    description: "تعرف على سياسة الخصوصية لمنصة C4R وكيفية حماية بياناتك الشخصية.",
    url: "https://c4rplatform.com/privacy",
  },
  alternates: {
    canonical: "https://c4rplatform.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main>
      <PrivacyPageClient />
    </main>
  );
}
