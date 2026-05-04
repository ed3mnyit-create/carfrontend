import FAQPageClient from "./FAQPageClient";

export const metadata = {
  title: "الأسئلة الشائعة | منصة C4R لتأجير السيارات",
  description:
    "إجابات على أكثر الأسئلة تكراراً حول تأجير السيارات في السعودية: الشروط، الأسعار، التوصيل، وطرق الدفع مع منصة C4R.",
  openGraph: {
    title: "الأسئلة الشائعة | منصة C4R لتأجير السيارات",
    description: "كل ما تود معرفته عن تأجير السيارات في السعودية مع C4R.",
    url: "https://c4rplatform.com/faq",
  },
  alternates: {
    canonical: "https://c4rplatform.com/faq",
  },
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "ما هي شروط تأجير السيارات في السعودية؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يتطلب الحجز هوية سارية، رخصة قيادة معترف بها، وبطاقة ائتمان.",
        },
      },
      {
        "@type": "Question",
        "name": "هل توفرون سيارات مع سائق؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، لدينا خدمة تأجير سيارات بسائق خاص في جميع مدن المملكة.",
        },
      },
      {
        "@type": "Question",
        "name": "ما هي المدن المتاحة للحجز؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نغطي الرياض، جدة، المنطقة الشرقية (الدمام، الخبر، الظهران) وقريباً مدن أخرى.",
        },
      },
      {
        "@type": "Question",
        "name": "هل يوجد حد أدنى لمدة الإيجار؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكنك استئجار سيارة بدءاً من يوم واحد. نوفر أيضاً عقود شهرية وسنوية بأسعار مخفضة.",
        },
      },
      {
        "@type": "Question",
        "name": "كيف يتم تأكيد الحجز؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بعد إرسال طلبك عبر المنصة، سيتواصل معك فريقنا عبر الواتساب لتأكيد الحجز وترتيب التسليم.",
        },
      },
      {
        "@type": "Question",
        "name": "ما هي طرق الدفع المتاحة؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نوفر الدفع بالتحويل البنكي أو الدفع نقداً عند الاستلام في المدن المدعومة.",
        },
      },
      {
        "@type": "Question",
        "name": "هل يمكن إلغاء الحجز بعد التأكيد؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكن إلغاء الحجز قبل استلام السيارة. قد تطبق رسوم إلغاء حسب سياسة جهة التأجير.",
        },
      },
      {
        "@type": "Question",
        "name": "هل التوصيل مجاني؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نوفر خدمة توصيل السيارة لموقعك. قد تضاف رسوم توصيل حسب المدينة وبعد الموقع.",
        },
      },
      {
        "@type": "Question",
        "name": "هل يشمل الإيجار التأمين؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، جميع السيارات مؤمنة تأميناً شاملاً أو ضد الغير حسب نوع السيارة وجهة التأجير.",
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQPageClient />
    </main>
  );
}
