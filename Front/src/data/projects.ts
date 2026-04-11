
export interface Project {
  id: number;
  name: string;
  location: string;
  region: string;
  stars: number;
  role: string;
  roleTag: string;
  description: string;
  year: number;
  review?: { author: string; text: string };
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Grand Palace Hotel',
    location: 'Toshkent, O\'zbekiston',
    region: 'Toshkent',
    stars: 5,
    role: 'To\'liq Boshqaruv',
    roleTag: 'management',
    description: 'Toshkent markazida joylashgan 5 yulduzli mehmonxonani to\'liq boshqaruv jamoasi bilan ta\'minladik. 200+ xonali mehmonxona.',
    year: 2022,
    review: { author: 'Alisher Karimov, Otel egasi', text: 'HotelPro jamoasi bizning otelimizni xalqaro darajaga olib chiqdi. Mehmonlar qoniqishi 40% ga oshdi.' },
  },
  {
    id: 2,
    name: 'Silk Road Boutique',
    location: 'Samarqand, O\'zbekiston',
    region: 'Samarqand',
    stars: 4,
    role: 'Pre-Opening',
    roleTag: 'pre-opening',
    description: 'Registon yaqinida joylashgan boutique otelni pre-opening bosqichidan ochilishgacha tayyorladik.',
    year: 2023,
    review: { author: 'Dilnoza Rashidova, Investor', text: 'Professional yondashuv va o\'z vaqtida ochilish — HotelPro bilan ishlash oson va ishonchli.' },
  },
  {
    id: 3,
    name: 'Bukhara Heritage Inn',
    location: 'Buxoro, O\'zbekiston',
    region: 'Buxoro',
    stars: 3,
    role: 'Konsalting',
    roleTag: 'consulting',
    description: 'Tarixiy binoda joylashgan mehmonxonaga bozor tahlili va operatsion konsalting xizmati ko\'rsatildi.',
    year: 2021,
  },
  {
    id: 4,
    name: 'Amir Temur Resort',
    location: 'Shahrisabz, Qashqadaryo',
    region: 'Qashqadaryo',
    stars: 4,
    role: 'Franchise',
    roleTag: 'franchise',
    description: 'Xalqaro otel brendi franchise lisenziyasini olish va standartlarga moslashtirishda to\'liq yordam.',
    year: 2023,
  },
  {
    id: 5,
    name: 'Ichan Qala Hotel',
    location: 'Xiva, Xorazm',
    region: 'Xorazm',
    stars: 4,
    role: 'To\'liq Boshqaruv',
    roleTag: 'management',
    description: 'Xiva shahrida UNESCO meros zonasida joylashgan mehmonxonaning to\'liq boshqaruvini olib bordik.',
    year: 2020,
    review: { author: 'Bobur Mamatov, Direktor', text: 'Jahon meros zonasida mehmonxona boshqarish tajribasi HotelPro jamoasida bor.' },
  },
  {
    id: 6,
    name: 'Pearl Continental',
    location: 'Toshkent, O\'zbekiston',
    region: 'Toshkent',
    stars: 5,
    role: 'Marketing va Sotish',
    roleTag: 'marketing',
    description: 'OTA platformalaridagi ko\'rsatkichlarni 3 barobar oshirib, Revenue Management tizimini joriy etdik.',
    year: 2024,
  },
  {
    id: 7,
    name: 'Green Valley Resort',
    location: 'Chimyon, Toshkent viloyati',
    region: 'Toshkent',
    stars: 4,
    role: 'Pre-Opening',
    roleTag: 'pre-opening',
    description: 'Tog\' dam olish maskani sifatida loyihalashtirilgan resort otelni ishga tushirishda ishtirok etdik.',
    year: 2024,
  },
  {
    id: 8,
    name: 'Navruz Hotel',
    location: 'Namangan, O\'zbekiston',
    region: 'Boshqa',
    stars: 3,
    role: 'Kadrlar O\'qitish',
    roleTag: 'training',
    description: 'Otel xodimlarini xalqaro mehmonnavozlik standartlariga muvofiq o\'qitish dasturi o\'tkazildi.',
    year: 2023,
  },
];

export const roleFilters = [
  { label: 'Barchasi', value: 'all' },
  { label: 'Boshqaruv', value: 'management' },
  { label: 'Pre-Opening', value: 'pre-opening' },
  { label: 'Konsalting', value: 'consulting' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Franchise', value: 'franchise' },
  { label: 'Trening', value: 'training' },
];

export const regionFilters = [
  { label: 'Barchasi', value: 'all' },
  { label: 'Toshkent', value: 'Toshkent' },
  { label: 'Samarqand', value: 'Samarqand' },
  { label: 'Buxoro', value: 'Buxoro' },
  { label: 'Qashqadaryo', value: 'Qashqadaryo' },
  { label: 'Xorazm', value: 'Xorazm' },
  { label: 'Boshqa', value: 'Boshqa' },
];
