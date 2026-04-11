import { FaHotel, FaDoorOpen, FaChartLine, FaBullhorn, FaUserGraduate, FaPaintBrush, FaHandshake } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export interface Service {
  id: string;
  icon: IconType;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  faq: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    id: 'management',
    icon: FaHotel,
    title: 'Otelni Boshqarish',
    shortDesc: 'Yangi yoki mavjud otelga professional boshqaruv jamoasini joylash va operatsion nazorat.',
    fullDesc: 'Biz otellarni xalqaro standartlarga muvofiq boshqaramiz. Har bir otelga tajribali menejment jamoasini tayinlab, kundalik operatsiyalarni nazorat qilamiz, xodimlar tanlash va treninglar o\'tkazamiz.',
    features: [
      'Professional boshqaruv jamoasini joylash',
      'Operatsion nazorat va hisobot tizimi',
      'Kadrlar tanlash va standard joriy etish',
      'To\'liq boshqaruv, qisman yoki maslahat modeli',
      'Daromad va xarajatlarni optimallashtirish',
      'Mehmonlar qoniqishini ta\'minlash',
    ],
    faq: [
      { q: 'Boshqaruv shartnomasi qancha muddatga tuziladi?', a: 'Odatda 3 yildan 10 yilgacha shartnoma tuziladi, lekin muddatlar individual kelishiladi.' },
      { q: 'Boshqaruv narxi qanday hisoblanadi?', a: 'Boshqaruv to\'lovi odatda otel daromadining foizi sifatida belgilanadi, bu 3% dan 8% gacha bo\'lishi mumkin.' },
    ]
  },
  {
    id: 'pre-opening',
    icon: FaDoorOpen,
    title: 'Pre-Opening Xizmatlari',
    shortDesc: 'Otel ochilishidan oldingi to\'liq tayyorgarlik kompleksi — jihozlashdan kadrlargacha.',
    fullDesc: 'Otel ochilish sanasigacha bo\'lgan barcha tayyorgarlik ishlarini biz o\'z zimmamizga olamiz. Bu jarayon 6-12 oy oldin boshlanadi va otelning muvaffaqiyatli ishga tushishini kafolatlaydi.',
    features: [
      'Jihozlar va interyer standartlarini moslashtirish',
      'Kadrlar yollash va o\'qitish',
      'OTA platformalariga joylashtirish (Booking, Expedia)',
      'PMS va Channel Manager tizimlarini ulash',
      'Bron tizimini sozlash',
      'Ochilish marketingi va PR kampaniya',
    ],
    faq: [
      { q: 'Pre-opening jarayoni qancha vaqt oladi?', a: 'Odatda 6 oydan 12 oygacha davom etadi, otelning hajmiga qarab.' },
      { q: 'Bizda otel qurilishi tugamagan, siz yordam bera olasizmi?', a: 'Ha, biz qurilish jarayonida ham maslahat beramiz va ochilish uchun tayyorgarlik ishlarini parallel boshlaymiz.' },
    ]
  },
  {
    id: 'consulting',
    icon: FaChartLine,
    title: 'Konsalting va Tahlil',
    shortDesc: 'Bozor tadqiqoti, raqobatchilar tahlili, investitsion loyiha hisoblari va ROI kalkulyatsiyasi.',
    fullDesc: 'Professional tahlil va konsalting xizmatlari orqali investorlar va otel egalariga to\'g\'ri qarorlar qabul qilishda yordam beramiz.',
    features: [
      'Bozor tadqiqoti — viloyat/shahar bo\'yicha',
      'Raqobatchilar tahlili va narx strategiyasi',
      'Investitsion loyiha hisob-kitobi (ROI)',
      'Otelni yulduzlarga tasdiqlash',
      'Operatsion audit va tavsiyalar',
      'Strategik rivojlanish rejasi',
    ],
    faq: [
      { q: 'Konsalting qancha turadi?', a: 'Narx loyihaning hajmi va murakkabligiga bog\'liq. Bepul dastlabki maslahat uchun biz bilan bog\'laning.' },
      { q: 'Qaysi hududlarda xizmat ko\'rsatasiz?', a: 'Butun O\'zbekiston bo\'ylab, shuningdek Markaziy Osiyo mamlakatlarida.' },
    ]
  },
  {
    id: 'marketing',
    icon: FaBullhorn,
    title: 'Marketing va Sotish',
    shortDesc: 'OTA boshqaruvi, Revenue Management, digital marketing va brend yaratish xizmatlari.',
    fullDesc: 'Zamonaviy marketing vositalari va strategiyalari orqali otelning band bo\'lish darajasini oshiramiz va daromadni maksimallashtirmiz.',
    features: [
      'OTA boshqaruvi va RevenueManagement',
      'Otel brendi va korporativ uslub yaratish',
      'Sayt yaratish va SEO optimallashtirish',
      'SMM va digital reklama',
      'Korporativ mijozlar bilan shartnomalar',
      'Email marketing va CRM tizim',
    ],
    faq: [
      { q: 'Qaysi OTA platformalarida ishlaysiz?', a: 'Booking.com, Expedia, Agoda, Trip.com va boshqa 50+ xalqaro va mahalliy platformalarda.' },
      { q: 'Marketing natijalarini qancha vaqtda ko\'rish mumkin?', a: 'Dastlabki natijalar 1-3 oyda ko\'rinadi, to\'liq effekt 6-12 oyda namoyon bo\'ladi.' },
    ]
  },
  {
    id: 'training',
    icon: FaUserGraduate,
    title: 'Kadrlar O\'qitish',
    shortDesc: 'Front-office, housekeeping, F&B xodimlari uchun xalqaro standartlar bo\'yicha treninglar.',
    fullDesc: 'Otel xodimlarini xalqaro mehmonnavozlik standartlariga muvofiq tayyorlaymiz va sertifikatlashtramiz.',
    features: [
      'Front-office va resepshn treninglari',
      'Housekeeping standartlari',
      'F&B xodimlari uchun dasturlar',
      'Xalqaro sertifikatsiya',
      'Menejment uchun maxsus dasturlar',
      'On-site va online ta\'lim formatlari',
    ],
    faq: [
      { q: 'Treninglar qancha davom etadi?', a: 'Standart trening 3-5 kun, kengaytirilgan dastur 2-4 hafta davom etadi.' },
      { q: 'Sertifikat beriladi mi?', a: 'Ha, xalqaro standartlarga mos sertifikatlar beriladi.' },
    ]
  },
  {
    id: 'design',
    icon: FaPaintBrush,
    title: 'Dizayn va Loyihalash',
    shortDesc: 'Otel interyer dizayni, brend identiteti va arxitektura bilan hamkorlik.',
    fullDesc: 'Xalqaro standartlar asosida otel interyer dizayni va brend identitetini yaratamiz, arxitektura byurolariga maslahat beramiz.',
    features: [
      'Otel interyer dizayni',
      'Arxitektura bilan hamkorlik',
      'Brend identiteti: logo, ranglar, uslub',
      'Boshqaruv hujjatlari dizayni',
      'Signage va wayfinding tizimi',
      'FF&E spetsifikatsiyasi',
    ],
    faq: [
      { q: 'Dizayn loyiha qancha vaqt oladi?', a: 'Loyihaning hajmiga qarab 2 oydan 6 oygacha.' },
      { q: 'Xorijiy dizaynerlar bilan ishlaysizmi?', a: 'Ha, xalqaro hamkorlarimiz bilan birga ishlaymiz.' },
    ]
  },
  {
    id: 'franchise',
    icon: FaHandshake,
    title: 'Franchise',
    shortDesc: '70+ xalqaro brenddan (Hilton, Wyndham, IHG) franchise olishda to\'liq yordam.',
    fullDesc: 'Xalqaro otel brendlaridan franchise lisenziyasini olish jarayonida boshidan oxirigacha yordam beramiz.',
    features: [
      '70+ xalqaro brendlar bilan tajriba',
      'Hilton, Wyndham, IHG, Accor va boshqalar',
      'Muvofiqlik audit va baholash',
      'Ariza tayyorlash va ko\'rib chiqish',
      'Sertifikatsiya jarayoni',
      'Franchise shartnomasi bo\'yicha maslahat',
    ],
    faq: [
      { q: 'Franchise olish qancha turadi?', a: 'Brend va otel hajmiga qarab $50,000 dan $500,000 gacha boshlang\'ich to\'lov bo\'lishi mumkin.' },
      { q: 'Jarayon qancha vaqt oladi?', a: 'Odatda 6 oydan 18 oygacha, brendga va muvofiqlik darajasiga qarab.' },
    ]
  },
];
