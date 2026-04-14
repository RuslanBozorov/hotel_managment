import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ru' | 'uz';

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
      label: 'Strategic Partners',
      title: 'Our Key Industry Collaborators',
      desc: 'We work with leading technology, legal, and operational partners to ensure excellence.',
      brands_label: 'Global Brands',
      brands_title: 'Helping you manage 70+ international chains',
      brands_desc: 'We are an accredited partner for Hilton, Wyndham, IHG, Marriott, and other leading global chains.',
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
    },
    admin: {
      sidebar: {
        dashboard: 'Dashboard',
        home: 'Home Management',
        services: 'Services',
        projects: 'Projects',
        about: 'About Page',
        blog: 'Blog Management',
        media: 'Media gallery',
        applications: 'Applications',
        categories: 'Categories',
        partners: 'Partners',
        hero: 'Banner Ads (Hero)',
        stats: 'Statistics',
        users: 'Users & Roles',
        settings: 'Settings',
        logout: 'Logout'
      },
      dashboard: {
        welcome: 'Welcome back',
        stats: {
          users: 'Total Users',
          messages: 'New Messages',
          posts: 'Blog Posts',
          projects: 'Live Projects',
          services: 'Active Services'
        },
        activity: 'Recent Activity',
        analytics: 'Weekly Analytics',
        quickActions: {
          title: 'Quick Actions',
          newPost: 'New News',
          newPostDesc: 'Add article to blog',
          slider: 'Main Images',
          sliderDesc: 'Update slider images',
          clients: 'Clients',
          clientsDesc: 'Read new messages'
        }
      },
      common: {
        save: 'Save Changes',
        cancel: 'Cancel',
        add: 'Add New',
        edit: 'Edit',
        delete: 'Delete',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        actions: 'Actions',
        search: 'Search...',
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error'
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
      label: 'Стратегические партнеры',
      title: 'Наши ключевые отраслевые партнеры',
      desc: 'Мы работаем с ведущими технологическими и операционными партнерами для достижения совершенства.',
      brands_label: 'Мировые бренды',
      brands_title: 'Помогаем управлять 70+ мировыми сетями',
      brands_desc: 'Мы являемся аккредитованным партнером Hilton, Wyndham, IHG, Marriott и других глобальных сетей.',
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
    },
    admin: {
      sidebar: {
        dashboard: 'Дашборд',
        home: 'Главная страница',
        services: 'Услуги',
        projects: 'Проекты',
        about: 'О компании',
        blog: 'Блог',
        media: 'Медиа галерея',
        applications: 'Заявки и сообщения',
        categories: 'Категории',
        partners: 'Партнеры',
        hero: 'Баннеры (Hero)',
        stats: 'Статистика',
        users: 'Пользователи и роли',
        settings: 'Настройки',
        logout: 'Выйти'
      },
      dashboard: {
        welcome: 'Добро пожаловать',
        stats: {
          users: 'Пользователи',
          messages: 'Сообщения',
          posts: 'Статьи',
          projects: 'Проекты',
          services: 'Услуги'
        },
        activity: 'Последняя активность',
        analytics: 'Аналитика (Еженедельно)',
        quickActions: {
          title: 'Быстрые действия',
          newPost: 'Новая новость',
          newPostDesc: 'Добавить статью в блог',
          slider: 'Главные фото',
          sliderDesc: 'Обновить фото слайдера',
          clients: 'Клиенты',
          clientsDesc: 'Читать новые сообщения'
        }
      },
      common: {
        save: 'Сохранить',
        cancel: 'Отмена',
        add: 'Добавить',
        edit: 'Изменить',
        delete: 'Удалить',
        status: 'Статус',
        active: 'Активен',
        inactive: 'Неактивен',
        actions: 'Действия',
        search: 'Поиск...',
        loading: 'Загрузка...',
        success: 'Успешно!',
        error: 'Ошибка'
      }
    }
  },
  uz: {
    nav: {
      home: 'Bosh sahifa',
      services: 'Xizmatlar',
      projects: 'Loyihalar',
      about: 'Biz haqimizda',
      blog: 'Blog',
      contact: 'Aloqa',
      cta: 'Maslahat olish'
    },
    hero: {
      label: 'O\'zbekistonda mehmonxona boshqaruvida №1',
      title: {
        line1: 'Mehmonxona boshqaruvi —',
        line2: 'Bizning kamolot san\'atimiz'
      },
      desc: 'Biz xalqaro standartlar asosida professional boshqaruv, konsalting va marketing xizmatlarini taqdim etamiz. 15+ yillik tajriba, 60+ muvaffaqiyatli loyiha.',
      proof: '60+ dan ortiq global ob\'ektlar ishonadi',
      btn: {
        services: 'Xizmatlarni ko\'rish',
        consult: 'Bepul konsultatsiya'
      },
      scroll: 'Pastga tushing'
    },
    stats: {
      hotels: 'Boshqariladigan mehmonxonalar',
      years: 'Yillik tajriba',
      regions: 'Qamrab olingan hududlar',
      staff: 'O\'qitilgan mutaxassislar',
      brands: 'Xalqaro brendlar',
      satisfaction: 'Mijoz mamnuniyati'
    },
    about: {
      label: 'Biz haqimizda',
      badge: '2009-yildan beri',
      title: 'Biz O\'zbekistonda mehmondo\'stlikning yangi standartini yaratdik',
      p1: 'HotelPro birinchi bo\'lib O\'zbekistonda mehmondo\'stlik sanoatini inqilob qilish uchun tashkil etilgan.',
      p2: 'Bizning safarimiz 2009-yilda boshlangan va so\'nggi 15 yil ichida biz mamlakat bo\'ylab mehmonxona investorlari va egalari uchun eng ishonchli hamkorga aylandik.',
      p3: 'Bizning yondashuvimiz chuqur mahalliy bozor bilimlarini xalqaro operatsion mukammallik bilan birlashtiradi.',
      value1: { title: 'Shaffoflik', desc: 'Batafsil oylik moliyaviy hisobotlar' },
      value2: { title: 'Natija', desc: 'KPI asosidagi boshqaruv falsafasi' },
      value3: { title: 'Hamkorlik', desc: 'Egalarining manfaatlari doimo birinchi o\'rinda' },
      btn: 'Biz haqimizda ko\'proq bilib oling',
      history: {
        title: 'Vaqt bo\'ylab qilgan safarimiz',
        2009: 'HotelPro tashkil etilishi va Toshkentdagi birinchi konsalting loyihasi.',
        2012: '4-yulduzli ob\'ekt uchun birinchi to\'liq operatsion boshqaruv shartnomasini imzolash.',
        2015: 'Mahalliy mutaxassislar uchun Mehmondo\'stlik O\'quv Akademiyasining ochilishi.',
        2018: 'O\'zbekiston bo\'ylab 30 ta boshqariladigan ob\'ektlar marrasiga yetish.',
        2021: 'Yuqori darajadagi xalqaro franchayzing brendlarining akkreditatsiyalangan hamkori bo\'lish.',
        2024: '60+ loyihalar va yangi raqamli boshqaruv vositalari bilan ufqlarni kengaytirish.'
      },
      philosophy: {
        title: 'Bizning asosiy falsafamiz',
        desc: 'Biz ishonamizki, mehmondo\'stlik bu shunchaki xizmat emas; u qat\'iy moliyaviy intizomni saqlab qolgan holda hissiy aloqalar yaratishdir.',
        points: [
          'Eng kichik operatsion detallarga e\'tibor qaratish.',
          'Mehmonlar tajribasida doimiy innovatsiyalar.',
          'Ta\'lim va mentorlik orqali xodimlarning imkoniyatlarini kengaytirish.',
          'Daromadlarni boshqarishda ma\'lumotlarga asoslangan qarorlar qabul qilish.'
        ]
      },
      team: {
        title: 'HotelPro ortidagi vizionerlar bilan tanishing',
        role1: 'Bosh ijrochi direktor (CEO)',
        role2: 'Operatsiyalar bo\'yicha direktor',
        role3: 'Marketing bo\'yicha direktor',
        role4: 'Sifat nazorati bo\'limi rahbari'
      }
    },
    services: {
      label: 'Bizning xizmatlar',
      title: 'Mehmonxonangiz uchun to\'liq siklli yechimlar',
      desc: 'Dastlabki dizayn bosqichidan boshlab kundalik operatsion boshqaruvgacha — biz har bir qadamda siz bilan birgamiz.',
      popular: 'Eng ko\'p so\'ralgan',
      btn: 'Barcha xizmatlarni ko\'rish',
      management: {
        title: 'Mehmonxona boshqaruvi',
        desc: 'Professional jamoa orqali mehmonxonangizni to\'liq operatsion boshqarish. Xodimlar, moliya, sifat nazorati — biz hammasini o\'z zimmamizga olamiz.',
        features: ['24/7 operatsion nazorat', 'Moliyaviy rejalashtirish va audit', 'HR boshqaruvi va ish haqi', 'Sifat standartlarini joriy etish']
      },
      preopening: {
        title: 'Pre-Opening xizmatlari',
        desc: 'Ochilishdan 12 oy oldin to\'liq tayyorgarlik: xodimlarni yollash, tizimlar, OTA joylashtirish, brending.',
        features: ['Timeline boshqaruvi', 'Xodimlarni yollash va o\'qitish', 'Ochilishdan oldingi marketing', 'IT tizimlarini sozlash (PMS/POS)']
      },
      consulting: {
        title: 'Konsalting va tahlil',
        desc: 'Bozorni o\'rganish, raqobatchilar tahlili, ROI hisob-kitoblari. Investitsiya qilishdan oldin to\'g\'ri qarorlar qabul qiling.',
        features: ['Texnik-iqtisodiy asoslar', 'Konseptsiyani ishlab chiqish', 'Texnik maslahatlar', 'Moliyaviy prognozlar']
      },
      marketing: {
        title: 'Marketing va daromad',
        desc: 'OTA platformalarini boshqarish, narxlash strategiyasi, raqamli marketing va maksimal foyda uchun brend yaratish.',
        features: ['Daromadni optimallashtirish', 'Raqamli audit', 'Ijtimoiy tarmoqlarni boshqarish', 'To\'g\'ridan-to\'g\'ri bron qilish strategiyalari']
      },
      training: {
        title: 'Xodimlarni o\'qitish',
        desc: 'Front-office, Housekeeping va F&B xodimlari uchun xalqaro standartdagi o\'qitish va sertifikatlash.',
        features: ['Soft Skills mahorati', 'Standard Operating Procedures', 'Upselling texnikasi', 'Xizmat madaniyati bo\'yicha seminar']
      },
      franchise: {
        title: 'Franchise brendlar',
        desc: 'Hilton, Wyndham, IHG va 70 dan ortiq boshqa xalqaro brendlardan franchayzing olishda to\'liq yordam va qo\'llab-quvvatlash.',
        features: ['Brend tanlash bo\'yicha maslahat', 'Shartnoma muzokaralari', 'Dizayn muvofiqligi', 'Brend standartlari auditi']
      },
      faq: {
        title: 'Ko\'p so\'raladigan savollar',
        q1: 'Pre-opening jarayoni qancha davom etadi?',
        a1: 'Ideal pre-opening jarayoni 10 dan 12 oygacha davom etadi, ammo biz uni loyiha murakkabligiga qarab moslashtirishimiz mumkin.',
        q2: 'Boshqaruv uchun to\'lov qanday hisoblanadi?',
        a2: 'Biz odatda asosiy to\'lov va yalpi operatsion foydaga (GOP) asoslangan rag\'batlantiruvchi to\'lov kombinatsiyasidan foydalanamiz.',
        q3: 'O\'zbekistonning barcha hududlarida ishlaysizmi?',
        a3: 'Ha, bizning Farg\'ona vodiysidan Qoraqalpog\'istongacha bo\'lgan har bir viloyatda muvaffaqiyatli loyihalarimiz mavjud.'
      }
    },
    process: {
      label: 'Ish jarayoni',
      title: 'Biz bilan ishlash sodda va shaffof',
      desc: 'Birinchi qo\'ng\'iroqdan muvaffaqiyatli ishga tushirishgacha — har bir qadam aniq belgilangan.',
      step1: { title: 'So\'rov', time: '1 kun', desc: 'Siz biz bilan bog\'lanasiz va biz ob\'ektingiz haqida asosiy ma\'lumotlarni to\'playmiz.' },
      step2: { title: 'Audit', time: '3-7 kun', desc: 'Bizning ekspertlarimiz bino, jamoa va bozorni tahlil qilish uchun tashrif buyurishadi.' },
      step3: { title: 'Taklif', time: '2-3 kun', desc: 'Biz individual boshqaruv rejasi va hamkorlik shartlarini taqdim etamiz.' },
      step4: { title: 'Amalga oshirish', time: '30-60 kun', desc: 'Boshqaruv jamoasi, IT tizimlari va standartlar o\'rnatiladi.' },
      step5: { title: 'Operatsion boshqaruv', time: 'Davomli', desc: 'Mehmonxona bizning kundalik nazoratimiz va strategiyamiz ostida ishlaydi.' },
      step6: { title: 'Tahlil va o\'sish', time: 'Har chorakda', desc: 'Biz chuqur KPI tahlilini o\'tkazamiz va o\'sish strategiyasini yangilaymiz.' }
    },
    projects: {
      label: 'Bizning loyihalar',
      title: 'Biz boshqargan va ishga tushirgan mehmonxonalar',
      desc: 'O\'zbekiston bo\'ylab professional rahbarligimiz ostida gullab-yashnayotgan muvaffaqiyatli ob\'ektlar.',
      btn: 'Barcha loyihalarni ko\'rish',
      filters: {
        all: 'Barcha loyihalar',
        management: 'Boshqaruv',
        preopening: 'Pre-Opening',
        consulting: 'Konsalting',
        marketing: 'Marketing va sotuvlar'
      },
      metrics: {
        rooms: 'Xonalar',
        growth: 'Daromad o\'sishi',
        occ: 'Bandlik darajasi'
      }
    },
    why: {
      label: 'Nima uchun biz?',
      title: 'Shunchaki boshqaruv emas — umumiy muvaffaqiyat',
      adv1: { title: 'Xalqaro tajriba, mahalliy bilim', desc: 'Biz global standartlarni O\'zbekiston bozorining o\'ziga xos xususiyatlariga moslashtiramiz.' },
      adv2: { title: 'Shaffof moliyaviy hisobot', desc: 'Har oyda siz Daromad, RevPAR, ADR va GOP bo\'yicha aniq hisobotlarni olasiz.' },
      adv3: { title: 'KPI asosida ishlash', desc: 'Biz natija bo\'yicha haq olamiz. Biz sizning daromadingiz o\'sgandagina o\'samiz.' },
      adv4: { title: 'Doimiy sifat nazorati', desc: 'Haqiqiy fikr-mulohazalar va "Maxfiy mehmon" auditlari orqali nazorat.' },
      adv5: { title: 'To\'liq texnik yordam', desc: 'PMS, Channel Manager va Revenue tizimlarini o\'rnatish va boshqarish.' },
      adv6: { title: 'Huquqiy qo\'llab-quvvatlash', desc: 'Soliq, mehnat va yulduz standartlariga to\'liq muvofiqlikni ta\'minlash.' }
    },
    testimonials: {
      label: 'Mijozlarimiz',
      title: 'Mehmonxona egalari biz haqimizda nima deyishadi'
    },
    partners: {
      label: 'Strategik hamkorlar',
      title: 'Asosiy sanoat hamkorlarimiz',
      desc: 'Biz mukammallikka erishish uchun yetakchi texnologiya, huquqiy va operatsion hamkorlar bilan ishlaymiz.',
      brands_label: 'Global brendlar',
      brands_title: '70 dan ortiq xalqaro tarmoqlarni boshqarishga yordam beramiz',
      brands_desc: 'Biz Hilton, Wyndham, IHG, Marriott va boshqa jahon yetakchi tarmoqlari uchun akkreditatsiyadan o\'tgan hamkormiz.',
      note: 'Mehmonxonangizda ushbu brendlardan birini joriy qilmoqchimisiz? Biz har bir bosqichda yordam beramiz.',
      btn: 'Franchayzing haqida batafsil'
    },
    media: {
      title: 'Qanday ishlashimizni ko\'ring',
      desc: 'Zamonaviy mehmondo\'stlik boshqaruviga bo\'lgan yondashuvimiz haqida 2 daqiqalik video sharh.'
    },
    blog: {
      label: 'Blog va yangiliklar',
      title: 'Mehmondo\'stlik sohasidagi so\'nggi maqolalar',
      btn: 'Barcha maqolalar',
      read: 'Batafsil o\'qish'
    },
    geo: {
      label: 'Qamrov',
      title: 'Butun respublika bo\'ylab xizmat qilamiz',
      projects: 'loyihalar',
      note: 'Boshqa hududlarda ham xizmat ko\'rsatish imkoniyati mavjud. Biz bilan bog\'laning.'
    },
    cta: {
      label: 'Bepul birinchi qadam',
      title: 'Mehmonxonangizni biz bilan keyingi bosqichga olib chiqing',
      desc: '30 daqiqalik bepul konsultatsiyada biz ob\'ektingizni tahlil qilamiz va optimal boshqaruv modelini taklif qilamiz.',
      btn: {
        write: 'Telegramda yozing',
        call: 'Hozir qo\'ng\'iroq qiling'
      },
      or: 'Yoki'
    },
    footer: {
      desc: 'O\'zbekistondagi yetakchi mehmondo\'stlik boshqaruv kompaniyasi. 2009-yildan beri 60+ mehmonxona muvaffaqiyatli boshqarildi.',
      pages: 'Sahifalar',
      services: 'Xizmatlar',
      contact: 'Biz bilan bog\'lanish',
      worktime: { label: 'Ish vaqti', value: 'Du-Ju, 9:00–18:00' },
      copyright: 'Barcha huquqlar himoyalangan.',
      privacy: 'Maxfiylik siyosati',
      terms: 'Foydalanish shartlari',
      dev: 'Dasturlagan'
    },
    contact: {
      title: 'Biz bilan bog\'lanish',
      desc: 'Loyihangizni muhokama qilishga tayyormisiz? Bizning ekspertlarimiz foydali mehmonxona biznesini qurishda yordam berishadi.',
      map: { label: 'Bizning manzilimiz' },
      form: {
        title: 'Xabar yuboring',
        desc: 'Quyidagi shaklni to\'ldiring va biz 24 soat ichida siz bilan bog\'lanamiz.',
        name: 'To\'liq ismingiz',
        phone: 'Telefon raqamingiz',
        service: 'Qiziqtirgan xizmat',
        message: 'Xabaringiz',
        submit: 'So\'rov yuborish',
        success: 'Rahmat! Xabaringiz muvaffaqiyatli yuborildi.'
      }
    },
    admin: {
      sidebar: {
        dashboard: 'Bosh boshqaruv',
        home: 'Asosiy sahifa',
        services: 'Xizmatlar',
        projects: 'Loyihalar',
        about: 'Biz haqimizda',
        blog: 'Yangiliklar',
        media: 'Media galereya',
        applications: 'Mijoz xabarlari',
        categories: 'Kategoriyalar',
        partners: 'Hamkorlar',
        hero: 'Bannerlar (Hero)',
        stats: 'Statistika',
        users: 'Foydalanuvchilar',
        settings: 'Sozlamalar',
        logout: 'Chiqish'
      },
      dashboard: {
        welcome: 'Xush kelibsiz',
        stats: {
          users: 'Foydalanuvchilar',
          messages: 'Yangi xabarlar',
          posts: 'Postlar',
          projects: 'Loyihalar',
          services: 'Xizmatlar'
        },
        activity: 'Oxirgi harakatlar',
        analytics: 'Haftalik tahlil',
        quickActions: {
          title: 'Tezkor amallar',
          newPost: 'Yangi yangilik',
          newPostDesc: 'Blogga yangi maqola qo\'shish',
          slider: 'Asosiy rasmlar',
          sliderDesc: 'Slayder rasmlarini yangilash',
          clients: 'Mijozlar',
          clientsDesc: 'Kelgan xabarlarni o\'qish'
        }
      },
      common: {
        save: 'O\'zgarishlarni saqlash',
        cancel: 'Bekor qilish',
        add: 'Yangi qo\'shish',
        edit: 'Tahrirlash',
        delete: 'O\'chirish',
        status: 'Holat',
        active: 'Faol',
        inactive: 'Nofaol',
        actions: 'Amallar',
        search: 'Qidirish...',
        loading: 'Yuklanmoqda...',
        success: 'Muvaffaqiyatli!',
        error: 'Xatolik'
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
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'ru' || saved === 'uz') return saved as Language;
    return 'uz'; // Default to Uzbek for this project as requested previously
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
