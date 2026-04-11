export interface TeamMember {
  id: number;
  name: string;
  position: string;
  experience: string;
}

export const team: TeamMember[] = [
  { id: 1, name: 'Sardor Ibroximov', position: 'Bosh direktor (CEO)', experience: '15+ yillik tajriba' },
  { id: 2, name: 'Nodira Karimova', position: 'Operatsion direktor (COO)', experience: '12+ yillik tajriba' },
  { id: 3, name: 'Jamshid Tursunov', position: 'Konsalting bo\'limi rahbari', experience: '10+ yillik tajriba' },
  { id: 4, name: 'Gulnora Azimova', position: 'Marketing direktori', experience: '8+ yillik tajriba' },
  { id: 5, name: 'Timur Raxmatullayev', position: 'Pre-Opening menejeri', experience: '9+ yillik tajriba' },
  { id: 6, name: 'Malika Xasanova', position: 'Kadrlar va trening menejeri', experience: '7+ yillik tajriba' },
];

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'O\'zbekistonda otel biznesi: 2024 yil tendensiyalari',
    excerpt: 'Otel industriyasidagi so\'nggi o\'zgarishlar va investorlarga tavsiyalar haqida batafsil tahlil.',
    author: 'Sardor Ibroximov',
    date: '2024-12-15',
    category: 'Tahlil',
  },
  {
    id: 2,
    title: 'Revenue Management: daromadni oshirishning 5 ta strategiyasi',
    excerpt: 'Otel daromadini oshirish uchun ishlatiladigan zamonaviy Revenue Management usullari.',
    author: 'Gulnora Azimova',
    date: '2024-11-28',
    category: 'Marketing',
  },
  {
    id: 3,
    title: 'Mehmonnavozlik standartlari: xalqaro tajriba',
    excerpt: 'Dunyo bo\'ylab eng yaxshi otellarning mehmonnavozlik standartlari va ulardan o\'rganish.',
    author: 'Nodira Karimova',
    date: '2024-11-10',
    category: 'Standartlar',
  },
  {
    id: 4,
    title: 'Pre-Opening: otel ochilishidan oldin nima qilish kerak?',
    excerpt: 'Otel ochilishidan oldingi tayyorgarlikning to\'liq rejasi va muhim bosqichlar.',
    author: 'Timur Raxmatullayev',
    date: '2024-10-22',
    category: 'Pre-Opening',
  },
  {
    id: 5,
    title: 'Franchise yoki mustaqil boshqaruv: qaysi biri yaxshiroq?',
    excerpt: 'Xalqaro brend franchise va mustaqil boshqaruv modellarini taqqoslash va tahlil.',
    author: 'Jamshid Tursunov',
    date: '2024-10-05',
    category: 'Konsalting',
  },
  {
    id: 6,
    title: 'OTA platformalarida reyting oshirish yo\'llari',
    excerpt: 'Booking.com va Expedia reytingini oshirish uchun amaliy maslahatlar.',
    author: 'Gulnora Azimova',
    date: '2024-09-18',
    category: 'Marketing',
  },
];
