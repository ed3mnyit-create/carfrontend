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
  corporatePage: {
    hero: {
      backgroundImage: "/images/car-companys.jpg",
      badge: { ar: "حلول الشركات", en: "Corporate mobility" },
      title: {
        ar: "حلول تأجير سيارات مريحة وواضحة لفرق العمل والشركات",
        en: "Comfortable, clear car rental solutions for teams and companies",
      },
      highlight: { ar: "بعرض مخصص", en: "with a tailored offer" },
      description: {
        ar: "نوفر خيارات تأجير مرنة للشركات، الفرق، المناسبات، والتنقلات اليومية مع متابعة مباشرة حتى تجهيز العرض المناسب.",
        en: "We provide flexible rental options for companies, teams, events, and daily operations with direct follow-up until your offer is ready.",
      },
      primaryLabel: { ar: "احصل على عرض", en: "Get your offer" },
      primaryHref: "#corporate-offer",
    },
    features: {
      eyebrow: { ar: "لماذا C4R للشركات؟", en: "Why C4R for companies?" },
      title: {
        ar: "تجربة تأجير أوضح للفرق التي تحتاج حركة يومية موثوقة",
        en: "A clearer rental experience for teams that need reliable daily mobility",
      },
      items: [
        {
          title: { ar: "أسطول مناسب", en: "Suitable fleet" },
          text: {
            ar: "خيارات متعددة حسب المدينة والمدة وطبيعة استخدام الشركة.",
            en: "Multiple options based on city, duration, and company usage.",
          },
        },
        {
          title: { ar: "عروض مرنة", en: "Flexible offers" },
          text: {
            ar: "نجهز العرض حسب عدد السيارات والمدة واحتياج فريقك.",
            en: "We prepare offers around car count, duration, and team needs.",
          },
        },
        {
          title: { ar: "متابعة مباشرة", en: "Direct support" },
          text: {
            ar: "فريقنا يراجع الطلب ويتواصل معك لتأكيد التفاصيل بسرعة.",
            en: "Our team reviews the request and follows up to confirm details quickly.",
          },
        },
      ],
    },
    services: {
      eyebrow: { ar: "خدمات الشركات", en: "Corporate services" },
      title: { ar: "حلول عملية حسب طريقة عمل شركتك", en: "Practical services around how your company moves" },
      text: {
        ar: "صممنا الصفحة لتقود العميل خطوة بخطوة من فهم الخدمة إلى طلب العرض.",
        en: "The page guides customers from understanding the service to requesting an offer.",
      },
      items: [
        {
          title: { ar: "عقود شهرية وطويلة", en: "Monthly and long-term contracts" },
          text: {
            ar: "مناسبة للشركات التي تحتاج سيارات لفترات مستمرة وبمتابعة واضحة.",
            en: "Ideal for companies that need cars for continuous periods with clear support.",
          },
        },
        {
          title: { ar: "تنقل فرق العمل", en: "Team transportation" },
          text: {
            ar: "خيارات للموظفين، الزيارات الميدانية، والتنقلات اليومية بين المواقع.",
            en: "Options for staff, field visits, and daily movement between locations.",
          },
        },
        {
          title: { ar: "المناسبات والضيافة", en: "Events and hospitality" },
          text: {
            ar: "سيارات وسائقون للفعاليات، الوفود، وضيوف الشركات عند الحاجة.",
            en: "Cars and chauffeurs for events, delegations, and corporate guests when needed.",
          },
        },
      ],
    },
    cta: {
      eyebrow: { ar: "عرض مخصص", en: "Tailored offer" },
      title: {
        ar: "دعنا نجهز لك عرضاً يناسب حجم شركتك ومدة الاستخدام",
        en: "Let us prepare an offer that fits your company size and usage duration",
      },
      text: {
        ar: "شاركنا المدينة وعدد السيارات والمدة، وسنساعدك في اختيار صيغة تأجير عملية وواضحة.",
        en: "Share the city, number of cars, and duration, and we will help you choose a practical rental setup.",
      },
      action: { ar: "ابدأ طلب العرض", en: "Start offer request" },
    },
    steps: {
      eyebrow: { ar: "كيف تعمل الخدمة؟", en: "How it works" },
      title: { ar: "ثلاث خطوات بسيطة للوصول إلى عرض مناسب", en: "Three simple steps to reach the right offer" },
      text: {
        ar: "لا تحتاج لاختيار باقة معقدة. أرسل الاحتياج وسنرتب التفاصيل معك.",
        en: "No complicated package selection. Send your needs and we will arrange the details with you.",
      },
      items: [
        { text: { ar: "أرسل بيانات الشركة والمدينة وعدد السيارات.", en: "Send company details, city, and number of cars." } },
        { text: { ar: "نراجع الاحتياج ونقترح الخيارات المناسبة.", en: "We review the need and suggest suitable options." } },
        { text: { ar: "يصلك عرض واضح لتأكيد التفاصيل والبدء.", en: "You receive a clear offer to confirm details and start." } },
      ],
    },
    faq: {
      eyebrow: { ar: "أسئلة الشركات", en: "Corporate FAQ" },
      title: { ar: "إجابات سريعة قبل طلب العرض", en: "Quick answers before requesting an offer" },
      items: [
        {
          question: { ar: "هل يمكن تجهيز عقد شهري أو سنوي؟", en: "Can you arrange monthly or yearly contracts?" },
          answer: {
            ar: "نعم، يمكن تجهيز عروض حسب مدة الاستخدام وعدد السيارات والمدينة بعد مراجعة الطلب.",
            en: "Yes, offers can be prepared based on duration, car count, and city after reviewing the request.",
          },
        },
        {
          question: { ar: "هل الخدمة متاحة في أكثر من مدينة؟", en: "Is the service available in more than one city?" },
          answer: {
            ar: "نعم، يمكن ترتيب حلول الشركات في المدن المتاحة على المنصة مع تأكيد التوفر بعد مراجعة الطلب.",
            en: "Yes, corporate solutions can be arranged in available platform cities, with availability confirmed after request review.",
          },
        },
        {
          question: { ar: "هل يمكن طلب سيارات بسائق للشركات؟", en: "Can companies request chauffeur cars?" },
          answer: {
            ar: "نعم، يمكن طلب سيارات بسائق للمناسبات، الضيافة، أو التنقلات الرسمية.",
            en: "Yes, chauffeur cars can be requested for corporate events, hospitality, or formal transportation.",
          },
        },
        {
          question: { ar: "متى يصلني العرض؟", en: "When will I receive the offer?" },
          answer: {
            ar: "بعد إرسال الطلب، يتم التواصل معك لمراجعة التفاصيل وتجهيز العرض المناسب في أقرب وقت.",
            en: "After submitting the request, we contact you to review details and prepare the suitable offer as soon as possible.",
          },
        },
      ],
    },
    form: {
      eyebrow: { ar: "احصل على عرضك", en: "Get your offer" },
      title: { ar: "أرسل احتياج شركتك وسنعود لك بالعرض المناسب", en: "Send your company needs and we will return with the right offer" },
      text: {
        ar: "النموذج يفتح تطبيق البريد برسالة جاهزة إلى البريد المحدد في إعدادات المنصة.",
        en: "The form opens your email app with a prepared message sent to the email configured in platform settings.",
      },
      submit: { ar: "إرسال طلب العرض", en: "Send offer request" },
      sendTo: { ar: "يتم الإرسال إلى", en: "Sent to" },
      placeholder: {
        ar: "اكتب أي تفاصيل إضافية مثل نوع السيارات المطلوبة أو موعد بداية الخدمة.",
        en: "Add any extra details such as car type or expected start date.",
      },
    },
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
