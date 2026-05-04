import PolicyPageClient from "./PolicyPageClient";

export const metadata = {
  title: "سياسة الإلغاء والاسترجاع | منصة C4R لتأجير السيارات",
  description: "تعرف على سياسة الإلغاء والاسترجاع واستبدال السيارات في منصة C4R. حقوقك كعميل وشروط الاستثناءات.",
  openGraph: {
    title: "سياسة الإلغاء والاسترجاع | منصة C4R لتأجير السيارات",
    description: "سياسة الإلغاء والاسترجاع لخدمات تأجير السيارات مع C4R.",
    url: "https://c4rplatform.com/policy",
  },
  alternates: {
    canonical: "https://c4rplatform.com/policy",
  },
};

export default function PolicyPage() {
  return (
    <main>
      <PolicyPageClient />
    </main>
  );
}
