import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ru';

interface Translations {
  [key: string]: string | string[] | Translations;
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      projects: 'Projects',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      cta: 'Book Consultation'
    },
    hero: {
      label: 'Uzbekistan\'s #1 Hospitality Management Company',
      title: {
        line1: 'Hotel Management —',
        line2: 'Our Art of Excellence'
      },
      desc: 'We provide international standard professional management, consulting, and marketing services to hotel owners. 15+ years of experience, 60+ successful projects.',
      proof: 'Trusted by 60+ global properties',
      btn: {
        services: 'View Services',
        consult: 'Free Consultation'
      },
      scroll: 'Scroll Down'
    },
    stats: {
      hotels: 'Managed Hotels',
      years: 'Years of Experience',
      regions: 'Regions Covered',
      staff: 'Trained Professionals',
      brands: 'International Brands',
      satisfaction: 'Client Satisfaction'
    },
    about: {
      label: 'About Us',
      badge: 'Since 2009',
      title: 'We created a new standard of hospitality in Uzbekistan',
      p1: 'HotelPro was founded with a single mission: to revolutionize the hospitality industry in Uzbekistan by bringing world-class management standards to local properties.',
      p2: 'Our journey began in 2009, and over the past 15 years, we have grown into the most trusted partner for hotel investors and owners across the country. We don\'t just manage hotels; we create sustainable value.',
      p3: 'Our approach combines deep local market knowledge with international operational excellence, ensuring that every property we touch becomes a leader in its segment.',
      value1: { title: 'Transparency', desc: 'Detailed monthly financial reports' },
      value2: { title: 'Results', desc: 'KPI-driven management philosophy' },
      value3: { title: 'Partnership', desc: 'Owner interests always come first' },
      btn: 'Learn More About Us',
      history: {
        title: 'Our Journey Through Time',
        2009: 'Foundation of HotelPro and first consulting project in Tashkent.',
        2012: 'Signed our first full operational management contract for a 4-star property.',
        2015: 'Launched the Hospitality Training Academy for local professionals.',
        2018: 'Reached the milestone of 30 managed properties across Uzbekistan.',
        2021: 'Became an accredited partner for top-tier international franchise brands.',
        2024: 'Expanding horizons with 60+ projects and new digital management tools.'
      },
      philosophy: {
        title: 'Our Core Philosophy',
        desc: 'We believe that hospitality is not just about service; it\'s about creating emotional connections while maintaining strict financial discipline.',
        points: [
          'Attention to the smallest operational details.',
          'Constant innovation in guest experience.',
          'Empowering staff through education and mentorship.',
          'Data-driven decision making in revenue management.'
        ]
      },
      team: {
        title: 'Meet the visionaries behind HotelPro',
        role1: 'Chief Executive Officer',
        role2: 'Director of Operations',
        role3: 'Director of Marketing',
        role4: 'Head of Quality Control'
      }
    },
    services: {
      label: 'Our Services',
      title: 'Full-Cycle Solutions for Your Hotel',
      desc: 'From the initial design phase to daily operational management — we are with you at every step of the journey.',
      popular: 'Most Requested',
      btn: 'View All Services',
      management: {
        title: 'Hotel Management',
        desc: 'Full operational management of your hotel through a professional team. Staff, finance, quality control — we handle it all.',
        features: ['24/7 Operational Oversight', 'Financial Planning & Audit', 'HR Management & Payroll', 'Quality Standards Implementation']
      },
      preopening: {
        title: 'Pre-Opening Services',
        desc: 'Complete preparation starting 12 months before opening: staff recruitment, systems, OTA placement, branding.',
        features: ['Timeline Management', 'Staff Recruitment & Training', 'Pre-opening Marketing', 'IT Systems Setup (PMS/POS)']
      },
      consulting: {
        title: 'Consulting & Analysis',
        desc: 'Market research, competitor analysis, ROI calculations. Make the right decisions before investing.',
        features: ['Feasibility Studies', 'Concept Development', 'Technical Advisory', 'Financial Projections']
      },
      marketing: {
        title: 'Marketing & Revenue',
        desc: 'OTA platform management, pricing strategy, digital marketing, and brand building for maximum profit.',
        features: ['Yield Optimization', 'Digital Presence Audit', 'Social Media Management', 'Direct Booking Strategies']
      },
      training: {
        title: 'Staff Training',
        desc: 'International standard training and certification for Front-office, Housekeeping, and F&B staff.',
        features: ['Soft Skills Mastery', 'Standard Operating Procedures', 'Upselling Techniques', 'Service Culture Workshop']
      },
      franchise: {
        title: 'Franchise Brands',
        desc: 'Full assistance and support in obtaining franchises from Hilton, Wyndham, IHG, and 70+ other international brands.',
        features: ['Brand Selection Advice', 'Contract Negotiation', 'Design Compliance', 'Brand Standards Audit']
      },
      faq: {
        title: 'Frequently Asked Questions',
        q1: 'How long does the pre-opening process take?',
        a1: 'The ideal pre-opening process takes 10 to 12 months, but we can customize it depending on the project complexity.',
        q2: 'What is the fee structure for management?',
        a2: 'We generally use a combination of a base fee and an incentive fee based on the Net Operating Income (GOP).',
        q3: 'Do you work in all regions of Uzbekistan?',
        a3: 'Yes, we have successful projects in every region from Fergana Valley to Karakalpakstan.'
      }
    },
    process: {
      label: 'Work Process',
      title: 'Working With Us is Simple and Transparent',
      desc: 'From the first call to the successful operation of the hotel — every step is clearly defined.',
      step1: { title: 'Inquiry', time: '1 Day', desc: 'You contact us, and we gather basic info about your property.' },
      step2: { title: 'Audit', time: '3-7 Days', desc: 'Our experts visit the site to analyze the building, team, and market.' },
      step3: { title: 'Proposal', time: '2-3 Days', desc: 'We present an individual management plan and partnership terms.' },
      step4: { title: 'Implementation', time: '30-60 Days', desc: 'Management team, IT systems, and standards are deployed.' },
      step5: { title: 'Operational Management', time: 'Ongoing', desc: 'The hotel operates under our daily oversight and strategy.' },
      step6: { title: 'Analysis & Growth', time: 'Every Quarter', desc: 'We conduct deep KPI analysis and update the growth strategy.' }
    },
    projects: {
      label: 'Our Projects',
      title: 'Hotels Managed and Launched by Us',
      desc: 'Successful properties across Uzbekistan that thrive under our professional guidance.',
      btn: 'View All Projects',
      filters: {
        all: 'All Projects',
        management: 'Management',
        preopening: 'Pre-Opening',
        consulting: 'Consulting',
        marketing: 'Marketing & Sales'
      },
      metrics: {
        rooms: 'Rooms',
        growth: 'Revenue Growth',
        occ: 'Occupancy Rate'
      }
    },
    why: {
      label: 'Why Us?',
      title: 'Not Just Management — Shared Success',
      adv1: { title: 'International Experience, Local Knowledge', desc: 'We adapt global standards to the unique characteristics of the Uzbek market.' },
      adv2: { title: 'Transparent Financial Reporting', desc: 'Every month you receive clear reports on Revenue, RevPAR, ADR, and GOP.' },
      adv3: { title: 'KPI-Based Work', desc: 'We link our compensation to results. We grow when your revenue grows.' },
      adv4: { title: 'Constant Quality Control', desc: 'Monitoring through real feedback and "Secret Guest" audits.' },
      adv5: { title: 'Full Tech Support', desc: 'Installation and management of PMS, Channel Manager, and Revenue systems.' },
      adv6: { title: 'Local Legal Support', desc: 'Ensuring full compliance with local tax, labor, and star-rating laws.' }
    },
    testimonials: {
      label: 'Testimonials',
      title: 'What Hotel Owners Say About Us'
    },
    partners: {
      label: 'Partners & Brands',
      title: 'We help you work with 70+ international brands',
      desc: 'We are an accredited partner for Hilton, Wyndham, IHG, Marriott, and other leading global chains.',
      note: 'Want to implement one of these brands in your hotel? We help at every stage.',
      btn: 'More About Franchise'
    },
    media: {
      title: 'See How We Work',
      desc: 'A 2-minute video overview of our approach to modern hospitality management.'
    },
    blog: {
      label: 'Blog & News',
      title: 'Latest Articles in Hospitality',
      btn: 'All Articles',
      read: 'Read More'
    },
    geo: {
      label: 'Coverage',
      title: 'Serving the Entire Republic',
      projects: 'Projects',
      note: 'Availability for services in other regions is also possible. Contact us.'
    },
    cta: {
      label: 'Free First Step',
      title: 'Take Your Hotel to the Next Level With Us',
      desc: 'In a 30-minute free consultation, we will analyze your property and propose an optimal management model. No obligations.',
      btn: {
        write: 'Write on Telegram',
        call: 'Call Us Now'
      },
      or: 'Or via'
    },
    footer: {
      desc: 'Leading hospitality management company in Uzbekistan. Since 2009, 60+ hotels successfully managed.',
      pages: 'Pages',
      services: 'Services',
      contact: 'Contact Us',
      worktime: { label: 'Working Hours', value: 'Mon-Fri, 9:00–18:00' },
      copyright: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      dev: 'Developed by'
    },
    contact: {
      title: 'Contact Us',
      desc: 'Ready to discuss your project? Our experts are here to help you build a profitable hotel business.',
      map: { label: 'Our Location' },
      form: {
        title: 'Send a Message',
        desc: 'Fill out the form below and we will contact you within 24 hours.',
        name: 'Full Name',
        phone: 'Phone Number',
        service: 'Interested Service',
        message: 'Your Message',
        submit: 'Send Request',
        success: 'Thank you! Your message has been sent successfully.'
      }
    }
  },
  ru: {
    nav: {
      home: 'Главная',
      services: 'Услуги',
      projects: 'Проекты',
      about: 'О компании',
      blog: 'Блог',
      contact: 'Контакты',
      cta: 'Заказать консультацию'
    },
    hero: {
      label: '№1 в управлении отелями в Узбекистане',
      title: {
        line1: 'Управление Отелями —',
        line2: 'Наше Искусство Совершенства'
      },
      desc: 'Мы предоставляем профессиональные услуги управления, консалтинга и маркетинга по международным стандартам. 15+ лет опыта, 60+ успешных проектов.',
      proof: 'Нам доверяют более 60 объектов по всему миру',
      btn: {
        services: 'Посмотреть услуги',
        consult: 'Бесплатная консультация'
      },
      scroll: 'Листайте вниз'
    },
    stats: {
      hotels: 'Отелей в управлении',
      years: 'Лет опыта',
      regions: 'Регионов охвачено',
      staff: 'Обученных специалистов',
      brands: 'Международных брендов',
      satisfaction: 'Удовлетворенность клиентов'
    },
    about: {
      label: 'О компании',
      badge: 'С 2009 года',
      title: 'Мы создали новый стандарт гостеприимства в Узбекистане',
      p1: 'Компания HotelPro была основана с одной миссией: революционизировать индустрию гостеприимства в Узбекистане, внедрив стандарты управления мирового уровня в местные объекты.',
      p2: 'Наш путь начался в 2009 году, и за последние 15 лет мы выросли в самого надежного партнера для инвесторов и владельцев отелей по всей стране. Мы не просто управляем отелями; мы создаем долгосрочную ценность.',
      p3: 'Наш подход сочетает глубокое знание местного рынка с международным операционным совершенством, гарантируя, что каждый объект становится лидером в своем сегменте.',
      value1: { title: 'Прозрачность', desc: 'Детальные ежемесячные финансовые отчеты' },
      value2: { title: 'Результат', desc: 'Управленческая философия на основе KPI' },
      value3: { title: 'Партнерство', desc: 'Интересы владельца всегда на первом месте' },
      btn: 'Узнать больше о нас',
      history: {
        title: 'Наш путь во времени',
        2009: 'Основание HotelPro и первый консалтинговый проект в Ташкенте.',
        2012: 'Подписание первого контракта на полное операционное управление 4-звездочным отелем.',
        2015: 'Запуск Академии Гостеприимства для обучения местных специалистов.',
        2018: 'Достижение отметки в 30 управляемых объектов по всему Узбекистану.',
        2021: 'Статус аккредитованного партнера ведущих международных франчайзинговых брендов.',
        2024: 'Расширение горизонтов: 60+ проектов и новые цифровые инструменты управления.'
      },
      philosophy: {
        title: 'Наша Философия',
        desc: 'Мы верим, что гостеприимство — это не просто сервис; это создание эмоциональных связей при соблюдении строгой финансовой дисциплины.',
        points: [
          'Внимание к мельчайшим операционным деталям.',
          'Постоянные инновации в опыте гостей.',
          'Развитие персонала через обучение и наставничество.',
          'Принятие решений на основе данных в управлении доходами.'
        ]
      },
      team: {
        title: 'Познакомьтесь с визионерами HotelPro',
        role1: 'Генеральный директор (CEO)',
        role2: 'Операционный директор',
        role3: 'Директор по маркетингу',
        role4: 'Руководитель контроля качества'
      }
    },
    services: {
      label: 'Наши услуги',
      title: 'Комплексные решения для вашего отеля',
      desc: 'От начальной фазы проектирования до ежедневного операционного управления — мы с вами на каждом этапе пути.',
      popular: 'Самое востребованное',
      btn: 'Все услуги',
      management: {
        title: 'Управление Отелем',
        desc: 'Полное операционное управление вашим отелем силами профессиональной команды. Персонал, финансы, контроль качества — мы берем все на себя.',
        features: ['Круглосуточный операционный надзор', 'Финансовое планирование и аудит', 'Управление HR и расчет зарплат', 'Внедрение стандартов качества']
      },
      preopening: {
        title: 'Pre-Opening Услуги',
        desc: 'Полная подготовка за 12 месяцев до открытия: найм персонала, системы, размещение в OTA, брендинг.',
        features: ['Управление графиком открытия', 'Подбор и обучение персонала', 'Маркетинг перед открытием', 'Настройка IT-систем (PMS/POS)']
      },
      consulting: {
        title: 'Консалтинг и Анализ',
        desc: 'Исследование рынка, анализ конкурентов, расчет ROI. Принимайте правильные решения перед инвестированием.',
        features: ['ТЭО (Технико-экономическое обоснование)', 'Разработка концепции', 'Технический консалтинг', 'Финансовые прогнозы']
      },
      marketing: {
        title: 'Маркетинг и Продажи',
        desc: 'Управление OTA-платформами, стратегия ценообразования, цифровой маркетинг и создание бренда для максимальной прибыли.',
        features: ['Оптимизация доходности (Yield)', 'Аудит цифрового присутствия', 'Управление социальными сетями', 'Стратегии прямых бронирований']
      },
      training: {
        title: 'Обучение Персонала',
        desc: 'Обучение и сертификация персонала Front-office, Housekeeping и F&B по международным стандартам.',
        features: ['Мастерство Soft Skills', 'Стандартные операционные процедуры (SOP)', 'Техники апселлинга', 'Тренинг по культуре сервиса']
      },
      franchise: {
        title: 'Франчайзинговые бренды',
        desc: 'Полная помощь и поддержка в получении франшиз от Hilton, Wyndham, IHG и еще 70+ международных брендов.',
        features: ['Консультации по выбору бренда', 'Переговоры по контракту', 'Соответствие дизайну', 'Аудит стандартов бренда']
      },
      faq: {
        title: 'Часто задаваемые вопросы',
        q1: 'Сколько времени занимает процесс pre-opening?',
        a1: 'Идеальный процесс pre-opening занимает от 10 до 12 месяцев, но мы можем адаптировать его под сложность проекта.',
        q2: 'Какова структура оплаты за управление?',
        a2: 'Обычно мы используем комбинацию базового вознаграждения и поощрительного бонуса на основе валовой операционной прибыли (GOP).',
        q3: 'Работаете ли вы во всех регионах Узбекистана?',
        a3: 'Да, у нас есть успешные проекты в каждом регионе от Ферганской долины до Каракалпакстана.'
      }
    },
    process: {
      label: 'Процесс работы',
      title: 'Работать с нами просто и прозрачно',
      desc: 'От первого звонка до успешной работы отеля — каждый шаг четко определен.',
      step1: { title: 'Заявка', time: '1 день', desc: 'Вы связываетесь с нами, и мы собираем базовую информацию о вашем объекте.' },
      step2: { title: 'Аудит', time: '3-7 дней', desc: 'Наши эксперты посещают объект для анализа здания, команды и рынка.' },
      step3: { title: 'Предложение', time: '2-3 дня', desc: 'Мы представляем индивидуальный план управления и условия партнерства.' },
      step4: { title: 'Внедрение', time: '30-60 дней', desc: 'Развертывается команда управления, IT-системы и стандарты.' },
      step5: { title: 'Операционное управление', time: 'Постоянно', desc: 'Отель работает под нашим ежедневным контролем и стратегией.' },
      step6: { title: 'Анализ и Рост', time: 'Каждый квартал', desc: 'Мы проводим глубокий анализ KPI и обновляем стратегию роста.' }
    },
    projects: {
      label: 'Наши проекты',
      title: 'Отели, которыми мы управляем и которые запустили',
      desc: 'Успешные объекты по всему Узбекистану, процветающие под нашим профессиональным руководством.',
      btn: 'Все проекты',
      filters: {
        all: 'Все проекты',
        management: 'Управление',
        preopening: 'Pre-Opening',
        consulting: 'Консалтинг',
        marketing: 'Маркетинг и Продажи'
      },
      metrics: {
        rooms: 'Номеров',
        growth: 'Рост выручки',
        occ: 'Загрузка'
      }
    },
    why: {
      label: 'Почему мы?',
      title: 'Не просто управление — общий успех',
      adv1: { title: 'Международный опыт, местные знания', desc: 'Мы адаптируем глобальные стандарты под уникальные особенности рынка Узбекистана.' },
      adv2: { title: 'Прозрачная финансовая отчетность', desc: 'Ежемесячно вы получаете четкие отчеты по Revenue, RevPAR, ADR и GOP.' },
      adv3: { title: 'Работа на основе KPI', desc: 'Мы привязываем оплату к результату. Мы растем только тогда, когда растут ваши доходы.' },
      adv4: { title: 'Постоянный контроль качества', desc: 'Мониторинг через реальные отзывы и аудит "Тайный гость".' },
      adv5: { title: 'Полная техподдержка', desc: 'Установка и управление PMS, Channel Manager и системами Revenue.' },
      adv6: { title: 'Юридическая поддержка', desc: 'Гарантируем полное соответствие налоговому, трудовому законодательству и стандартам звездности.' }
    },
    testimonials: {
      label: 'Отзывы',
      title: 'Что говорят владельцы отелей о нас'
    },
    partners: {
      label: 'Партнеры и бренды',
      title: 'Помогаем работать с 70+ мировыми брендами',
      desc: 'Мы являемся аккредитованным партнером Hilton, Wyndham, IHG, Marriott и других глобальных сетей.',
      note: 'Хотите внедрить один из этих брендов в своем отеле? Мы поможем на каждом этапе.',
      btn: 'Подробнее о франшизе'
    },
    media: {
      title: 'Посмотрите как мы работаем',
      desc: '2-минутный обзор нашего подхода к современному управлению гостеприимством.'
    },
    blog: {
      label: 'Блог и новости',
      title: 'Последние статьи о гостеприимстве',
      btn: 'Все статьи',
      read: 'Читать'
    },
    geo: {
      label: 'Охват',
      title: 'Работаем по всей республике',
      projects: 'проектов',
      note: 'Возможно оказание услуг и в других регионах. Свяжитесь с нами.'
    },
    cta: {
      label: 'Бесплатный первый шаг',
      title: 'Выведите свой отель на новый уровень с нами',
      desc: 'На 30-минутной бесплатной консультации мы проанализируем ваш объект и предложим оптимальную модель управления. Без обязательств.',
      btn: {
        write: 'Написать в Telegram',
        call: 'Позвонить нам'
      },
      or: 'Или через'
    },
    footer: {
      desc: 'Ведущая компания по управлению гостеприимством в Узбекистане. С 2009 года успешно управляется 60+ отелей.',
      pages: 'Страницы',
      services: 'Услуги',
      contact: 'Контакты',
      worktime: { label: 'Рабочие часы', value: 'Пн-Пт, 9:00–18:00' },
      copyright: 'Все права защищены.',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      dev: 'Разработка'
    },
    contact: {
      title: 'Связаться с нами',
      desc: 'Готовы обсудить ваш проект? Наши эксперты помогут вам построить прибыльный гостиничный бизнес.',
      map: { label: 'Наше местоположение' },
      form: {
        title: 'Отправить сообщение',
        desc: 'Заполните форму ниже, и мы свяжемся с вами в течение 24 часов.',
        name: 'ФИО',
        phone: 'Номер телефона',
        service: 'Интересующая услуга',
        message: 'Ваше сообщение',
        submit: 'Отправить запрос',
        success: 'Спасибо! Ваше сообщение успешно отправлено.'
      }
    }
  }
};

interface I18nContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => any;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = translations[lang];
    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key];
      } else {
        return path;
      }
    }
    return current || path;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
