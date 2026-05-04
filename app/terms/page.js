import TermsPageClient from "./TermsPageClient";

export const metadata = {
  title: "الشروط والأحكام | منصة C4R لتأجير السيارات",
  description: "اطلع على شروط وأحكام منصة C4R لضمان تجربة تأجير سيارات آمنة وسهلة في السعودية ومطابقة للقوانين.",
  openGraph: {
    title: "الشروط والأحكام | منصة C4R لتأجير السيارات",
    description: "اطلع على شروط وأحكام تأجير السيارات مع منصة C4R.",
    url: "https://c4rplatform.com/terms",
  },
  alternates: {
    canonical: "https://c4rplatform.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main>
      <TermsPageClient />
    </main>
  );
}
