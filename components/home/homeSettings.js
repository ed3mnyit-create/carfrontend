export const defaultHomeSettings = {
  sections: {
    hero: true,
    departments: true,
    about: true,
    features: true,
    cars: true,
    driverCars: true,
    services: true,
    cta: true,
    promos: true,
    reviews: true,
    faq: true,
    contact: true,
  },
  hero: {
    backgroundImage: "/images/hero-rolls-royce.jpg",
    title: {
      ar: "تجربة تأجير سيارات راقية لاختيار واثق",
      en: "A premium car rental experience for a confident choice",
    },
    description: {
      ar: "اختر من سيارات فاخرة واقتصادية، للأفراد والشركات أو مع سائق، مع حجز واضح ومتابعة مباشرة حتى تأكيد الطلب.",
      en: "Choose luxury and economy cars for individuals, companies, or chauffeur service, with clear booking and direct follow-up until confirmation.",
    },
    primaryLabel: { ar: "اكتشف السيارات", en: "Discover cars" },
    primaryHref: "/cars",
    secondaryLabel: { ar: "تواصل معنا", en: "Contact us" },
    secondaryHref: "https://wa.me/966554118873",
  },
  departments: {
    titlePart1: { ar: "أرخص تأجير سيارات", en: "Best Car Rental Options" },
    titlePart2: { ar: "حسب احتياجك", en: "For You" },
    cards: [
      {
        title: { ar: "تأجير سيارات للأفراد", en: "Car Rental for Individuals" },
        description: {
          ar: "تأجير سيارات يومي وشهري بأرخص الأسعار، خيارات متنوعة من السيارات.",
          en: "Daily and monthly car rentals with competitive prices and a wide variety of cars.",
        },
        action: { ar: "احجز الآن", en: "Rent Now" },
        href: "/individuals",
        image: "/images/car-indevadulals.jpg",
        badge: { ar: "الأكثر طلباً", en: "Popular" },
      },
      {
        title: { ar: "تأجير سيارات بسائق", en: "Rent a Car with Driver" },
        description: {
          ar: "استمتع برحلة مريحة مع سائق محترف وخدمة سيارات فاخرة.",
          en: "Enjoy a comfortable journey with a professional driver and premium car service.",
        },
        action: { ar: "احجز الآن", en: "Book Now" },
        href: "/with-driver",
        image: "/images/car-with-driver.webp",
        badge: { ar: "", en: "" },
      },
      {
        title: { ar: "قسم الشركات", en: "Corporate Section" },
        description: {
          ar: "حلول تأجير مخصصة للشركات بأسعار تنافسية وخدمة VIP.",
          en: "Customized rental solutions for companies with competitive prices and VIP service.",
        },
        action: { ar: "تواصل معنا", en: "Contact Us" },
        href: "/corporate",
        image: "/images/car-companys.jpg",
        badge: { ar: "للشركات", en: "Corporate" },
      },
    ],
  },
  about: {
    eyebrow: { ar: "من نحن", en: "About Us" },
    title: {
      ar: "منصة C4R لتأجير سيارات أسهل، أوضح، وأكثر موثوقية",
      en: "C4R makes car rental simpler, clearer, and more reliable",
    },
    text: {
      ar: "نربط العملاء بخيارات تأجير سيارات تناسب الأفراد، الشركات، وخدمة السيارة بسائق داخل المملكة، مع تجربة حجز واضحة وتواصل مباشر لتأكيد كل التفاصيل.",
      en: "We connect customers with rental options for individuals, companies, and chauffeur service across Saudi Arabia, with a clear booking experience and direct confirmation support.",
    },
    image: "/images/car-indevadulals.jpg",
    imageAlt: {
      ar: "عميل يستعرض خيارات تأجير السيارات من C4R",
      en: "Customer browsing C4R car rental options",
    },
    imageNote: {
      ar: "نوثق تفاصيل الحجز ونساعدك في اختيار السيارة المناسبة قبل تأكيد الطلب.",
      en: "We document booking details and help you choose the right car before confirming the request.",
    },
  },
  features: [
    {
      title: { ar: "سيارات موثقة", en: "Verified cars" },
      text: { ar: "اختيارات واضحة قبل إرسال الطلب.", en: "Clear choices before sending the request." },
    },
    {
      title: { ar: "مدد مرنة", en: "Flexible durations" },
      text: { ar: "حجز يومي أو باقات بسائق حسب الحاجة.", en: "Daily rental or chauffeur packages as needed." },
    },
    {
      title: { ar: "متابعة سريعة", en: "Fast follow-up" },
      text: { ar: "فريقنا يتواصل لتأكيد التفاصيل.", en: "Our team follows up to confirm details." },
    },
  ],
  cars: {
    eyebrow: { ar: "سياراتنا", en: "Our Cars" },
    title: { ar: "أسطول مختار لاحتياجات مختلفة", en: "A selected fleet for different needs" },
    text: {
      ar: "تصفح سيارات متاحة للحجز مع تفاصيل السعر، المدينة، والفئة قبل إرسال طلبك.",
      en: "Browse available cars with price, city, and category details before sending your request.",
    },
    action: { ar: "عرض كل السيارات", en: "View all cars" },
    href: "/cars",
  },
  driverCars: {
    eyebrow: { ar: "سيارات بسائق", en: "Cars With Driver" },
    title: { ar: "سيارات للإيجار مع سائق محترف", en: "Cars for rent with a professional driver" },
    text: {
      ar: "اختر سيارة بسائق لتجربة انتقال أكثر هدوءاً وتنظيماً.",
      en: "Choose a chauffeur car for a calmer, more organized ride.",
    },
    action: { ar: "عرض سيارات السائق", en: "View driver cars" },
    href: "/with-driver",
  },
  services: {
    eyebrow: { ar: "خدماتنا", en: "Our Services" },
    title: { ar: "خدمات مصممة حسب طريقة تنقلك", en: "Services shaped around how you move" },
    text: {
      ar: "اختر بين التأجير الفردي، سيارات بسائق، أو حلول الشركات بدون تعقيد في خطوات الحجز.",
      en: "Choose individual rental, chauffeur service, or corporate solutions without complicating the booking steps.",
    },
    action: { ar: "استكشف الخدمة", en: "Explore service" },
    items: [
      {
        title: { ar: "تأجير للأفراد", en: "Individual Rental" },
        text: {
          ar: "سيارات يومية وشهرية للاستخدام الشخصي، المشاوير، والسفر داخل المدن.",
          en: "Daily and monthly cars for personal use, city errands, and trips between destinations.",
        },
        href: "/individuals",
      },
      {
        title: { ar: "سيارات بسائق", en: "Cars With Driver" },
        text: {
          ar: "باقات 4 و8 و12 ساعة مع سائق لرحلات العمل والمناسبات والتنقلات اليومية.",
          en: "4, 8, and 12-hour chauffeur packages for business trips, events, and daily movement.",
        },
        href: "/with-driver",
      },
      {
        title: { ar: "حلول الشركات", en: "Corporate Solutions" },
        text: {
          ar: "خيارات مرنة للفرق والشركات التي تحتاج سيارات متعددة أو عقود أطول.",
          en: "Flexible options for teams and companies that need multiple cars or longer contracts.",
        },
        href: "/corporate",
      },
    ],
  },
  cta: {
    eyebrow: { ar: "جاهز للحجز؟", en: "Ready to book?" },
    title: {
      ar: "اختر سيارتك الآن واترك لفريقنا تأكيد التفاصيل معك",
      en: "Choose your car now and let our team confirm the details with you",
    },
    text: {
      ar: "ابدأ من صفحة السيارات أو انتقل مباشرة إلى خدمة السيارة بسائق حسب احتياجك.",
      en: "Start from the cars page or go directly to chauffeur service based on what you need.",
    },
    primaryLabel: { ar: "احجز سيارة", en: "Book a car" },
    primaryHref: "/cars",
    secondaryLabel: { ar: "سيارة بسائق", en: "Car with driver" },
    secondaryHref: "/with-driver",
  },
  faq: {
    titlePart1: { ar: "الأسئلة", en: "Frequently" },
    titlePart2: { ar: "الشائعة", en: "Asked Questions" },
    description: {
      ar: "إجابات على أهم الأسئلة قبل إرسال طلب الحجز",
      en: "Answers to the most important questions before sending your booking request",
    },
    image: "/images/car-with-driver.webp",
    imageAlt: { ar: "خدمة تأجير سيارات من منصة C4R", en: "C4R car rental service" },
    imageTitle: { ar: "حجز أوضح قبل الانطلاق", en: "Clearer booking before you go" },
    imageText: {
      ar: "راجع أهم التفاصيل ثم أرسل طلبك، وسيقوم فريقنا بتأكيد السيارة والمدة معك.",
      en: "Review the key details, send your request, and our team will confirm the car and duration with you.",
    },
    items: [
      {
        question: { ar: "ما المستندات المطلوبة للحجز؟", en: "What documents are required for booking?" },
        answer: {
          ar: "تحتاج رخصة قيادة سارية وبطاقة هوية/إقامة سارية وبطاقة ائتمان للضمان.",
          en: "You need a valid driver's license, valid ID/residency, and a credit card for guarantee.",
        },
      },
      {
        question: { ar: "هل يمكن توصيل السيارة في مدينة أخرى؟", en: "Can I return the car in a different city?" },
        answer: {
          ar: "نعم، نوفر خدمة التوصيل بين المدن برجاء التواصل لترتيب ذلك مع رسوم إضافية.",
          en: "Yes, we offer inter-city delivery service. Please contact us to arrange this with a small additional fee.",
        },
      },
      {
        question: { ar: "ما سياسة الإلغاء؟", en: "What is the cancellation policy?" },
        answer: {
          ar: "يمكنك إلغاء الحجز قبل 24 ساعة من الاستلام بدون رسوم. بعد ذلك قد تُطبق رسوم إلغاء.",
          en: "You can cancel 24 hours before pickup without charges. After that, cancellation fees may apply.",
        },
      },
      {
        question: { ar: "هل التأمين مشمول؟", en: "Is insurance included?" },
        answer: {
          ar: "نعم، جميع سياراتنا مؤمنة بالكامل. يمكنك الترقية لتغطية أوسع عند الحجز.",
          en: "Yes, all our cars are comprehensively insured. You can upgrade for broader coverage when booking.",
        },
      },
      {
        question: { ar: "ما الحد الأدنى للعمر للاستئجار؟", en: "What is the minimum rental age?" },
        answer: {
          ar: "الحد الأدنى 21 سنة مع رخصة قيادة سارية لمدة عام على الأقل.",
          en: "The minimum age is 21 years with a valid driver's license for at least one year.",
        },
      },
    ],
  },
  contact: {
    eyebrow: { ar: "تواصل معنا", en: "Contact" },
    title: { ar: "تحتاج مساعدة في اختيار السيارة؟", en: "Need help choosing the right car?" },
    text: {
      ar: "أرسل بياناتك أو تواصل مباشرة عبر القنوات المتاحة، وسنساعدك في اختيار الخدمة الأنسب حسب المدينة والمدة.",
      en: "Send your details or contact us directly, and we will help you choose the right service based on city and duration.",
    },
    coverage: { ar: "الرياض، جدة، والمنطقة الشرقية", en: "Riyadh, Jeddah, and Eastern Province" },
    submit: { ar: "إرسال عبر البريد", en: "Send by email" },
  },
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const mergeHomeSettings = (incoming = {}, base = defaultHomeSettings) => {
  if (!isPlainObject(incoming)) return base;

  return Object.keys({ ...base, ...incoming }).reduce((result, key) => {
    const baseValue = base[key];
    const incomingValue = incoming[key];

    if (Array.isArray(baseValue)) {
      result[key] = Array.isArray(incomingValue) ? incomingValue : baseValue;
      return result;
    }

    if (isPlainObject(baseValue)) {
      result[key] = mergeHomeSettings(incomingValue, baseValue);
      return result;
    }

    result[key] = incomingValue ?? baseValue;
    return result;
  }, {});
};

export const localized = (value, language = "ar", fallback = "") => {
  if (isPlainObject(value)) {
    const key = language?.startsWith("ar") ? "ar" : "en";
    return value[key] || value.ar || value.en || fallback;
  }

  return value ?? fallback;
};
