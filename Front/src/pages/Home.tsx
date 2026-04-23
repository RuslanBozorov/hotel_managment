import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight, FaHotel, FaGlobeAmericas,
  FaShieldAlt, FaChartLine, FaAward,
  FaCertificate, FaPhone, FaTelegramPlane, FaSearch, FaFileContract,
  FaCogs, FaRocket, FaQuoteLeft, FaChevronLeft, FaChevronRight,
  FaDoorOpen, FaBullhorn, FaUserGraduate, FaPaintBrush, FaPlayCircle,
  FaCalendarAlt, FaTag, FaMapMarkerAlt, FaKey
} from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import ProjectCard from '../components/ProjectCard';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { getIcon } from '../utils/iconMap';
import { formatTelegramLink } from '../utils/formatters';
import HeroSection from '../components/common/HeroSection';
import './Home.css';

export default function Home() {
  const { t, lang } = useI18n();
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dbProjects, setDbProjects] = useState<api.Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<api.Project[]>([]);
  const [dbServices, setDbServices] = useState<api.Service[]>([]);
  const [dbStats, setDbStats] = useState<api.Stat[]>([]);
  const [dbTestimonials, setDbTestimonials] = useState<api.Testimonial[]>([]);
  const [dbPartners, setDbPartners] = useState<api.Partner[]>([]);
  const [dbBlogs, setDbBlogs] = useState<api.Blog[]>([]);
  const [dbSettings, setDbSettings] = useState<Record<string, api.Setting>>({});
  const [isLoading, setIsLoading] = useState(true);

  // === DATA ===
  const defaultHeroImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920&auto=format&fit=crop'
  ];

  const heroImages = [
    dbSettings['hero_image_1']?.value_en || defaultHeroImages[0],
    dbSettings['hero_image_2']?.value_en || defaultHeroImages[1]
  ];



  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, serv, st, tst, prt, blg, sett] = await Promise.all([
          api.projectsApi.getAll(""),
          api.servicesApi.getAll(""),
          api.statsApi.getAll(""),
          api.testimonialsApi.getAll(""),
          api.partnersApi.getAll(""),
          api.blogsApi.getAll(""),
          api.settingsApi.getAll("")
        ]);
        // For coverage/projects, use ALL projects from database
        setDbProjects(proj);
        // For featured section on home, filter only featured projects
        setFeaturedProjects(proj.filter((p: api.Project) => p.is_featured).slice(0, 6));
        setDbServices(serv.slice(0, 6));
        if (st.length > 0) setDbStats(st);
        if (tst.length > 0) setDbTestimonials(tst);
        if (prt.length > 0) setDbPartners(prt);
        setDbBlogs(blg.slice(0, 3));
        
        const settingsMap: Record<string, api.Setting> = {};
        sett.forEach((s: api.Setting) => settingsMap[s.key] = s);
        setDbSettings(settingsMap);
      } catch (err) {
        console.error("Home data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultStats = [
    { icon: 'FaHotel', value: '60+', label_en: 'Hotels', label_ru: 'Отели' },
    { icon: 'FaGlobeAmericas', value: '15+', label_en: 'Experience', label_ru: 'Опыт' },
    { icon: 'FaMapMarkerAlt', value: '12', label_en: 'Regions', label_ru: 'Регионы' },
    { icon: 'FaUsers', value: '500+', label_en: 'Staff', label_ru: 'Сотрудники' },
    { icon: 'FaHandshake', value: '70+', label_en: 'Brands', label_ru: 'Бренды' },
    { icon: 'FaAward', value: '98%', label_en: 'Satisfaction', label_ru: 'Удовлетворённость' },
  ];

  const services = [
    { icon: FaKey, titleKey: 'services.management.title', descKey: 'services.management.desc', popular: true },
    { icon: FaDoorOpen, titleKey: 'services.preopening.title', descKey: 'services.preopening.desc' },
    { icon: FaChartLine, titleKey: 'services.consulting.title', descKey: 'services.consulting.desc' },
    { icon: FaBullhorn, titleKey: 'services.marketing.title', descKey: 'services.marketing.desc' },
    { icon: FaUserGraduate, titleKey: 'services.training.title', descKey: 'services.training.desc' },
    { icon: FaPaintBrush, titleKey: 'services.franchise.title', descKey: 'services.franchise.desc' },
  ];

  const processSteps = [
    { icon: FaPhone, titleKey: 'process.step1.title', timeKey: 'process.step1.time', descKey: 'process.step1.desc' },
    { icon: FaSearch, titleKey: 'process.step2.title', timeKey: 'process.step2.time', descKey: 'process.step2.desc' },
    { icon: FaFileContract, titleKey: 'process.step3.title', timeKey: 'process.step3.time', descKey: 'process.step3.desc' },
    { icon: FaCogs, titleKey: 'process.step4.title', timeKey: 'process.step4.time', descKey: 'process.step4.desc' },
    { icon: FaChartLine, titleKey: 'process.step5.title', timeKey: 'process.step5.time', descKey: 'process.step5.desc' },
    { icon: FaRocket, titleKey: 'process.step6.title', timeKey: 'process.step6.time', descKey: 'process.step6.desc' },
  ];

  const fallbackProjects = [
    { id: 101, name: 'Hilton Tashkent City', city: 'Tashkent', stars: 5, role: 'Full Management', image_url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791' },
    { id: 102, name: 'Registan Plaza Samarkand', city: 'Samarkand', stars: 4, role: 'Pre-Opening', image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' },
    { id: 103, name: 'Bukhara Palace Resort', city: 'Bukhara', stars: 5, role: 'Profit Optimization', image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d' },
    { id: 104, name: 'Silk Road Boutique', city: 'Khiva', stars: 4, role: 'Concept Design', image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427' },
    { id: 105, name: 'Chimyon Alpine Resort', city: 'Tashkent Region', stars: 4, role: 'Technical Audit', image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427' },
    { id: 106, name: 'Namangan Royal Inn', city: 'Namangan', stars: 3, role: 'Franchise Acquisition', image_url: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a' },
  ];

  const advantages = [
    { titleKey: 'why.adv1.title', descKey: 'why.adv1.desc', icon: FaGlobeAmericas },
    { titleKey: 'why.adv2.title', descKey: 'why.adv2.desc', icon: FaChartLine },
    { titleKey: 'why.adv3.title', descKey: 'why.adv3.desc', icon: FaAward },
    { titleKey: 'why.adv4.title', descKey: 'why.adv4.desc', icon: FaShieldAlt },
    { titleKey: 'why.adv5.title', descKey: 'why.adv5.desc', icon: FaCogs },
    { titleKey: 'why.adv6.title', descKey: 'why.adv6.desc', icon: FaCertificate },
  ];

  const testimonials = [
    {
      text: 'Thanks to HotelConsulting\'s revenue management, our occupancy rate increased by 40% in the first 6 months. Their transparent reporting gives us full visibility into performance.',
      textRu: 'Благодаря revenue management от HotelConsulting, наша заполняемость выросла на 40% за первые 6 месяцев. Их прозрачная отчётность даёт полную картину.',
      author: 'Akbar Toshmatov',
      position: 'Bukhara Heritage Hotel Owner',
      positionRu: 'Владелец Bukhara Heritage Hotel',
    },
    {
      text: 'We planned to open a 4-star hotel in Bukhara. The HotelConsulting team was with us from pre-opening to the arrival of the first guest. Now our hotel has the highest rating in the region.',
      textRu: 'Мы планировали открыть 4-звёздочный отель в Бухаре. Команда HotelConsulting была с нами от pre-opening до прибытия первого гостя. Теперь наш отель имеет самый высокий рейтинг в регионе.',
      author: 'Dilnoza Rashidova',
      position: 'Samarkand Grand Resort Investor',
      positionRu: 'Инвестор Samarkand Grand Resort',
    },
    {
      text: 'The franchise acquisition process seemed impossible, but HotelConsulting guided us through every step. We are now a proud Hilton property in Uzbekistan.',
      textRu: 'Процесс получения франшизы казался невозможным, но HotelConsulting провели нас через каждый этап. Теперь мы — отель Hilton в Узбекистане.',
      author: 'Bobur Mamatov',
      position: 'Hilton Tashkent Director',
      positionRu: 'Директор Hilton Tashkent',
    },
  ];

  const defaultPartners1 = [
    { name: 'Hilton', logo_url: '' }, { name: 'Wyndham', logo_url: '' }, 
    { name: 'IHG', logo_url: '' }, { name: 'Marriott', logo_url: '' }, 
    { name: 'Accor', logo_url: '' }, { name: 'Best Western', logo_url: '' }, 
    { name: 'Radisson', logo_url: '' }, { name: 'Hyatt', logo_url: '' }
  ];
  
  const defaultPartners2 = [
    { name: 'Choice Hotels', logo_url: '' }, { name: 'NH Hotels', logo_url: '' }, 
    { name: 'Mövenpick', logo_url: '' }, { name: 'Kempinski', logo_url: '' }, 
    { name: 'Rotana', logo_url: '' }, { name: 'Dusit', logo_url: '' }, 
    { name: 'Rixos', logo_url: '' }, { name: 'Premier Inn', logo_url: '' }
  ];

  // Dynamic distribution by category if dbPartners has items
  const dynamicPartners1 = dbPartners.length > 0 
    ? dbPartners.filter(p => p.category === 'partner')
    : defaultPartners1;
    
  const dynamicPartners2 = dbPartners.length > 0
    ? dbPartners.filter(p => p.category === 'brand')
    : defaultPartners2;

  const blogArticles = [
    {
      title: 'The Future of Hospitality in Uzbekistan 2025',
      titleRu: 'Будущее гостеприимства в Узбекистане 2025',
      category: 'Industry', date: 'March 15, 2025',
      image_url: 'https://images.unsplash.com/photo-1517840901100-8179e982ad41'
    },
    {
      title: 'Maximizing Hotel Revenue During Off-Season',
      titleRu: 'Максимизация доходов отеля в низкий сезон',
      category: 'Management', date: 'February 28, 2025',
      image_url: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a'
    },
    {
      title: 'International Franchise in Uzbekistan: Complete Guide',
      titleRu: 'Международная франшиза в Узбекистане: Полное руководство',
      category: 'Franchise', date: 'February 10, 2025',
    },
  ];

  const fallbackRegionsData = [
    { name: 'Tashkent', count: 15 }, { name: 'Samarkand', count: 8 },
    { name: 'Bukhara', count: 6 }, { name: 'Khorezm', count: 4 },
    { name: 'Kashkadarya', count: 3 }, { name: 'Surkhandarya', count: 2 },
    { name: 'Fergana', count: 5 }, { name: 'Namangan', count: 3 },
    { name: 'Andijan', count: 2 }, { name: 'Jizzakh', count: 2 }, 
    { name: 'Sirdarya', count: 1 }, { name: 'Navoiy', count: 1 }
  ];

  const dynamicRegionsData = React.useMemo(() => {
    if (!dbProjects || dbProjects.length === 0) return fallbackRegionsData;
    
    const counts: Record<string, number> = {};
    
    // Normalize city names to match coordinates mapping
    const mapCity = (c: string) => {
      if (!c) return 'Tashkent';
      const cl = c.toLowerCase();
      if (cl.includes('tash') || cl.includes('tosh') || cl.includes('тошк')) return 'Tashkent';
      if (cl.includes('sam') || cl.includes('самарк')) return 'Samarkand';
      if (cl.includes('bux') || cl.includes('bukh') || cl.includes('бухар')) return 'Bukhara';
      if (cl.includes('xor') || cl.includes('khor') || cl.includes('хорез')) return 'Khorezm';
      if (cl.includes('qash') || cl.includes('kash') || cl.includes('кашк')) return 'Kashkadarya';
      if (cl.includes('surx') || cl.includes('surk') || cl.includes('сурх')) return 'Surkhandarya';
      if (cl.includes('farg') || cl.includes('ferg') || cl.includes('ферг')) return 'Fergana';
      if (cl.includes('nam') || cl.includes('наман')) return 'Namangan';
      if (cl.includes('and') || cl.includes('андиж')) return 'Andijan';
      if (cl.includes('jiz') || cl.includes('жиз')) return 'Jizzakh';
      if (cl.includes('sir') || cl.includes('syr') || cl.includes('сырд')) return 'Sirdarya';
      if (cl.includes('nav') || cl.includes('наво')) return 'Navoiy';
      return 'Tashkent';
    };

    dbProjects.forEach(proj => {
      const city = mapCity(proj.city);
      counts[city] = (counts[city] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [dbProjects]);

  const nextTestimonial = () => {
    const len = dbTestimonials.length > 0 ? dbTestimonials.length : testimonials.length;
    setTestimonialIndex((i) => (i + 1) % len);
  };
  const prevTestimonial = () => {
    const len = dbTestimonials.length > 0 ? dbTestimonials.length : testimonials.length;
    setTestimonialIndex((i) => (i - 1 + len) % len);
  };

  if (isLoading) {
    return (
      <div className="home-loader">
        <div className="home-loader__spinner">
          <div className="home-loader__circle"></div>
          <FaHotel className="home-loader__icon" />
        </div>
        <p className="home-loader__text">{t('loading') || 'Loading...'}</p>
      </div>
    );
  }

  return (
    <main>
      <HeroSection 
        content={{
          label: (lang === 'ru' ? dbSettings['hero_label']?.value_ru : dbSettings['hero_label']?.value_en) || t('hero.label'),
          titleLine1: (lang === 'ru' ? dbSettings['hero_title_l1']?.value_ru : dbSettings['hero_title_l1']?.value_en) || t('hero.title.line1'),
          titleLine2: (lang === 'ru' ? dbSettings['hero_title_l2']?.value_ru : dbSettings['hero_title_l2']?.value_en) || t('hero.title.line2'),
          description: (lang === 'ru' ? dbSettings['hero_desc']?.value_ru : dbSettings['hero_desc']?.value_en) || t('hero.desc'),
          images: heroImages,
          proofText: t('hero.proof')
        }}
      />

      {/* ===== 2. STATS ===== */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {isLoading ? (
              // Skeleton Loader
              [1, 2, 3, 4].map((n) => (
                <div key={`skel-${n}`} className="stat-card skeleton pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', opacity: 0.7 }} />
                  <div style={{ width: '80%', height: '36px', borderRadius: '4px', background: '#e2e8f0', opacity: 0.7 }} />
                  <div style={{ width: '60%', height: '16px', borderRadius: '4px', background: '#e2e8f0', opacity: 0.7 }} />
                </div>
              ))
            ) : (
              (dbStats.length > 0 ? dbStats : defaultStats).map((stat: any, i) => {
                const valStr = String(stat.value);
                const numPart = parseInt(valStr.replace(/[^0-9]/g, '')) || 0;
                const suffixPart = valStr.replace(/[0-9]/g, '') || '';
                const label = lang === 'ru' ? stat.label_ru : stat.label_en;
                const Icon = getIcon(stat.icon);
                
                return (
                  <ScrollReveal key={stat.id || `stat-${i}`} delay={i * 0.08}>
                    <div className="stat-card">
                      <Icon className="stat-card__icon" />
                      <div className="stat-card__value">
                        <AnimatedCounter end={numPart} suffix={suffixPart} />
                      </div>
                      <div className="stat-card__label">{label}</div>
                    </div>
                  </ScrollReveal>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ===== 3. STRATEGIC PARTNERS (Marquee: Logo + Name) ===== */}
      <section className="section section--alt partners-marquee-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header section-header--compact">
              <span className="section-header__label">{t('partners.label')}</span>
              <h2 className="section-header__title">{t('partners.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>
        </div>
        
        <div className="partners-track-wrapper partners-track-wrapper--partners">
          <div className="partners-track partners-track--left partners-track--slow">
            {dynamicPartners1.concat(dynamicPartners1).map((p: any, i) => (
              <div key={`partner-rich-${i}`} className="partner-logo partner-logo--rich">
                <div className="partner-logo__img-box">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} loading="lazy" />
                  ) : (
                    <FaHotel className="fallback-icon" />
                  )}
                </div>
                <span className="partner-logo__name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3.1 GLOBAL BRANDS (Marquee: Text Only) ===== */}
      <section className="partners-section brands-marquee-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header section-header--compact">
              <span className="section-header__label">{t('partners.brands_label')}</span>
              <h2 className="section-header__title">{t('partners.brands_title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>
        </div>
        <div className="partners-track-wrapper partners-track-wrapper--brands">
          <div className="partners-track partners-track--right">
            {dynamicPartners2.concat(dynamicPartners2).map((p: any, i) => (
              <div key={`brand-text-${i}`} className="partner-logo partner-logo--text">
                <span className="partner-logo__name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. ABOUT TEASER ===== */}
      <section className="section about-teaser">
        <div className="container">
          <div className="about-teaser__grid">
            <ScrollReveal direction="left">
              <div className="about-teaser__image-wrap">
                <div className="about-teaser__image">
                  <img 
                    src={(lang === 'ru' ? dbSettings['home_about_image']?.value_ru : dbSettings['home_about_image']?.value_en) || "https://media.istockphoto.com/id/1320779330/photo/detail-of-a-five-stars-hotel.jpg?s=612x612&w=0&k=20&c=BPoqGxvmF3lGMGyuf0DAlQ7no9UGZ7s80Kiwn7nYSCo="} 
                    alt="About HotelConsulting" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="about-teaser__badge">
                   {(lang === 'ru' ? dbSettings['home_about_badge']?.value_ru : dbSettings['home_about_badge']?.value_en) || t('about.badge')}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="about-teaser__content">
                <span className="section-label">
                  {(lang === 'ru' ? dbSettings['home_about_label']?.value_ru : dbSettings['home_about_label']?.value_en) || t('about.label')}
                </span>
                <h2>
                  {(lang === 'ru' ? dbSettings['home_about_title']?.value_ru : dbSettings['home_about_title']?.value_en) || t('about.title')}
                </h2>
                <p>
                  {(lang === 'ru' ? dbSettings['home_about_p1']?.value_ru : dbSettings['home_about_p1']?.value_en) || t('about.p1')}
                </p>
                {!dbSettings['home_about_p1'] && (
                  <>
                    <p>{t('about.p2')}</p>
                    <p>{t('about.p3')}</p>
                  </>
                )}
                <div className="about-teaser__values">
                  <div className="about-teaser__value-item">
                    <span className="about-teaser__value-icon">✦</span>
                    <div>
                      <strong>{(lang === 'ru' ? dbSettings['home_about_v1_t']?.value_ru : dbSettings['home_about_v1_t']?.value_en) || t('about.value1.title')}</strong>
                      <span>{(lang === 'ru' ? dbSettings['home_about_v1_d']?.value_ru : dbSettings['home_about_v1_d']?.value_en) || t('about.value1.desc')}</span>
                    </div>
                  </div>
                  <div className="about-teaser__value-item">
                    <span className="about-teaser__value-icon">✦</span>
                    <div>
                      <strong>{(lang === 'ru' ? dbSettings['home_about_v2_t']?.value_ru : dbSettings['home_about_v2_t']?.value_en) || t('about.value2.title')}</strong>
                      <span>{(lang === 'ru' ? dbSettings['home_about_v2_d']?.value_ru : dbSettings['home_about_v2_d']?.value_en) || t('about.value2.desc')}</span>
                    </div>
                  </div>
                  <div className="about-teaser__value-item">
                    <span className="about-teaser__value-icon">✦</span>
                    <div>
                      <strong>{(lang === 'ru' ? dbSettings['home_about_v3_t']?.value_ru : dbSettings['home_about_v3_t']?.value_en) || t('about.value3.title')}</strong>
                      <span>{(lang === 'ru' ? dbSettings['home_about_v3_d']?.value_ru : dbSettings['home_about_v3_d']?.value_en) || t('about.value3.desc')}</span>
                    </div>
                  </div>
                </div>
                <Link to="/about" className="btn btn--primary">{t('about.btn')} <FaArrowRight /></Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== 5. SERVICES ===== */}
      <section className="section section--alt">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('services.label')}</span>
              <h2 className="section-header__title">{t('services.title')}</h2>
              <div className="section-header__line" />
              <p className="section-header__desc">{t('services.desc')}</p>
            </div>
          </ScrollReveal>
          <div className="services-grid">
            {(dbServices.length > 0 ? dbServices : services).map((s: any, i) => {
              const isDb = !!s.id;
              const title = isDb ? (lang === 'ru' ? s.title_ru : s.title_en) : t(s.titleKey);
              const desc = isDb ? (lang === 'ru' ? s.desc_ru : s.desc_en) : t(s.descKey);
              const Icon = isDb ? getIcon(s.icon) : s.icon;
              const isPopular = isDb ? s.is_popular : s.popular;

              return (
                <ScrollReveal key={isDb ? s.id : i} delay={i * 0.08}>
                  <Link to="/services" className="service-preview-card card-flex-col">
                    {isPopular && <span className="service-preview-card__badge">{t('services.popular')}</span>}
                    <div className="service-preview-card__icon-wrap">
                      <Icon className="service-preview-card__icon" />
                    </div>
                    <h3 className="service-preview-card__title text-clamp-1">{title}</h3>
                    <p className="service-preview-card__desc text-clamp-3">{desc}</p>
                    <div style={{ marginTop: 'auto' }}>
                      <span className="service-preview-card__link">{t('services.btn')} <FaArrowRight /></span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal>
            <div className="text-center" style={{ marginTop: 48 }}>
              <Link to="/services" className="btn btn--dark">{t('services.btn')} <FaArrowRight /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== 6. PROCESS ===== */}
      <section className="section section--dark">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('process.label')}</span>
              <h2 className="section-header__title">{t('process.title')}</h2>
              <div className="section-header__line" />
              <p className="section-header__desc">{t('process.desc')}</p>
            </div>
          </ScrollReveal>
          <div className="process-grid">
            {processSteps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="process-card">
                  <div className="process-card__number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="process-card__icon-wrap">
                    <step.icon className="process-card__icon" />
                  </div>
                  <h4 className="process-card__title">{t(step.titleKey)}</h4>
                  <span className="process-card__time">{t(step.timeKey)}</span>
                  <p className="process-card__desc">{t(step.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. PROJECTS ===== */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('projects.label')}</span>
              <h2 className="section-header__title">{t('projects.title')}</h2>
              <div className="section-header__line" />
              <p className="section-header__desc">{t('projects.desc')}</p>
            </div>
          </ScrollReveal>
          <div className="portfolio-grid">
            {/* If projects haven't loaded yet, but we want skeletons, wait... Home uses featuredProjects as fallback immediately.
                So we can either show the data or skeletons. Let's just map it smoothly. */}
            {(featuredProjects.length > 0 ? featuredProjects : fallbackProjects).slice(0, isMobile ? 4 : undefined)
              .map((project: any, i) => (
              <ProjectCard key={project.id || `feat-${i}`} project={project} lang={lang} />
            ))}
          </div>
          <ScrollReveal>
            <div className="text-center" style={{ marginTop: 48 }}>
              <Link to="/projects" className="btn btn--primary">{t('projects.btn')} <FaArrowRight /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== 8. WHY US ===== */}
      <section className="section section--alt">
        <div className="container">
          <div className="why-grid">
            <ScrollReveal direction="left">
              <div className="why-content">
                <span className="section-label">
                    {(lang === 'ru' ? dbSettings['home_why_label']?.value_ru : dbSettings['home_why_label']?.value_en) || t('why.label')}
                </span>
                <h2>
                    {(lang === 'ru' ? dbSettings['home_why_title']?.value_ru : dbSettings['home_why_title']?.value_en) || t('why.title')}
                </h2>
                <div className="why-list">
                  {advantages.map((adv, i) => {
                    const idx = i + 1;
                    const dbTitle = lang === 'ru' ? dbSettings[`home_why_a${idx}_t`]?.value_ru : dbSettings[`home_why_a${idx}_t`]?.value_en;
                    const dbDesc = lang === 'ru' ? dbSettings[`home_why_a${idx}_d`]?.value_ru : dbSettings[`home_why_a${idx}_d`]?.value_en;
                    
                    return (
                      <div key={i} className="why-item">
                        <div className="why-item__icon-wrap"><adv.icon /></div>
                        <div>
                          <h4>{dbTitle || t(adv.titleKey)}</h4>
                          <p>{dbDesc || t(adv.descKey)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="why-visual">
                 <div className="why-visual__image">
                   <img 
                    src={(lang === 'ru' ? dbSettings['home_why_image']?.value_ru : dbSettings['home_why_image']?.value_en) || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0"} 
                    alt="Team Work" 
                   />
                 </div>
                <div className="why-visual__badge">
                    {(lang === 'ru' ? dbSettings['home_why_badge']?.value_ru : dbSettings['home_why_badge']?.value_en) || `15+ ${lang === 'ru' ? 'лет опыта' : 'years experience'}`}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== 9. TESTIMONIALS ===== */}
      <section className="section section--dark testimonials-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('testimonials.label')}</span>
              <h2 className="section-header__title">{t('testimonials.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>
          <div className="testimonials-slider">
            <AnimatePresence mode="wait">
              {dbTestimonials.length > 0 ? (
                <motion.div key={testimonialIndex} className="testimonial-card"
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
                  <FaQuoteLeft className="testimonial-card__quote" />
                  <p className="testimonial-card__text">
                    {lang === 'ru' ? dbTestimonials[testimonialIndex].text_ru : dbTestimonials[testimonialIndex].text_en}
                  </p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">
                      {dbTestimonials[testimonialIndex].author.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <strong>{dbTestimonials[testimonialIndex].author}</strong>
                      <span>{lang === 'ru' ? dbTestimonials[testimonialIndex].position_ru : dbTestimonials[testimonialIndex].position_en}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={testimonialIndex} className="testimonial-card"
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
                  <FaQuoteLeft className="testimonial-card__quote" />
                  <p className="testimonial-card__text">
                    {lang === 'ru' ? testimonials[testimonialIndex].textRu : testimonials[testimonialIndex].text}
                  </p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">
                      {testimonials[testimonialIndex].author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <strong>{testimonials[testimonialIndex].author}</strong>
                      <span>{lang === 'ru' ? testimonials[testimonialIndex].positionRu : testimonials[testimonialIndex].position}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="testimonials-nav">
              <button onClick={prevTestimonial} className="testimonials-nav__btn"><FaChevronLeft /></button>
              <div className="testimonials-dots">
                {(dbTestimonials.length > 0 ? dbTestimonials : testimonials).map((_, i) => (
                  <button key={i} className={`testimonials-dot ${i === testimonialIndex ? 'testimonials-dot--active' : ''}`}
                    onClick={() => setTestimonialIndex(i)} />
                ))}
              </div>
              <button onClick={nextTestimonial} className="testimonials-nav__btn"><FaChevronRight /></button>
            </div>
          </div>
        </div>
      </section>



      {/* ===== 10. MEDIA / VIDEO ===== */}
      <section className="section section--dark media-section">
        <div className="container">
          <ScrollReveal>
            <div className="media-block">
              <a 
                href={dbSettings['home_media_video_link']?.value_en || '#'} 
                target="_blank" 
                rel="noreferrer" 
                className="media-block__video img-placeholder"
                style={dbSettings['home_media_image']?.value_en ? { backgroundImage: `url(${dbSettings['home_media_image'].value_en})`, backgroundSize: 'cover', backgroundPosition: 'center', borderColor: 'transparent' } : {}}
              >
                <FaPlayCircle className="media-block__play" />
              </a>
              <div className="media-block__text">
                <h2>{(lang === 'ru' ? dbSettings['home_media_title']?.value_ru : dbSettings['home_media_title']?.value_en) || t('media.title')}</h2>
                <p>{(lang === 'ru' ? dbSettings['home_media_desc']?.value_ru : dbSettings['home_media_desc']?.value_en) || t('media.desc')}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== 11. BLOG ===== */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('blog.label')}</span>
              <h2 className="section-header__title">{t('blog.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>
          <div className="blog-preview-grid">
            {(dbBlogs.length > 0 ? dbBlogs : blogArticles).map((article: any, i) => {
              const linkUrl = article.id ? `/blog/${article.id}` : '/blog';
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <Link to={linkUrl} className="blog-preview-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="blog-preview-card__image img-placeholder">
                      {article.image_url ? <img src={article.image_url} alt={article.title_en} /> : <FaTag />}
                    </div>
                    <div className="blog-preview-card__body">
                      <div className="blog-preview-card__meta">
                        <span className="blog-preview-card__category">{article.category}</span>
                        <span className="blog-preview-card__date">
                          <FaCalendarAlt /> {article.created_at ? new Date(article.created_at).toLocaleDateString() : article.date}
                        </span>
                      </div>
                      <h3>{lang === 'ru' ? (article.title_ru || article.titleRu) : (article.title_en || article.title)}</h3>
                      <span className="blog-preview-card__link">
                        {t('blog.read')} <FaArrowRight />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal>
            <div className="text-center" style={{ marginTop: 48 }}>
              <Link to="/blog" className="btn btn--dark">{t('blog.btn')} <FaArrowRight /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== 12. GEOGRAPHY ===== */}
      <section className="section section--alt geo-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('geo.label')}</span>
              <h2 className="section-header__title">{t('geo.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>
          <div className="geo-grid">
            <ScrollReveal direction="left">
              <div className="geo-map" id="yandex-map-container" style={{ width: '100%', height: '100%', minHeight: '350px' }}>
                {!isLoading && (
                   <YandexMapComponent regions={dynamicRegionsData} />
                )}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="geo-regions">
                {dynamicRegionsData.map((r, i) => (
                  <div key={i} className="geo-region-item">
                    <FaMapMarkerAlt className="geo-region-item__icon" />
                    <span className="geo-region-item__name">{r.name}</span>
                    <span className="geo-region-item__count">{r.count} {t('geo.projects')}</span>
                  </div>
                ))}
              </div>
              <p className="geo-note">{t('geo.note')}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== 13. CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="cta-banner__bg" />
        <div className="container cta-banner__content">
          <ScrollReveal>
            <span className="cta-banner__label">{t('cta.label')}</span>
            <h2 className="cta-banner__title">{t('cta.title')}</h2>
            <p className="cta-banner__desc">{t('cta.desc')}</p>
            <div className="cta-banner__btns">
              <a 
                href={formatTelegramLink(dbSettings['social_telegram']?.value_en || "https://t.me/hotelconsulting_uz")} 
                className="btn btn--primary btn--lg" 
                target="_blank" 
                rel="noopener"
              >
                <FaTelegramPlane /> {t('cta.btn.write')}
              </a>
              <a 
                href={`tel:${(dbSettings['contact_phone']?.value_en || "+998711234567").replace(/\s+/g, '')}`} 
                className="btn btn--outline btn--lg"
              >
                <FaPhone /> {t('cta.btn.call')}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

// === HELPER COMPONENT FOR YANDEX MAPS ===
declare global {
  interface Window {
    ymaps: any;
  }
}

function YandexMapComponent({ regions }: { regions: { name: string, count: number }[] }) {
  const { lang } = useI18n();
  useEffect(() => {
    const init = () => {
      if (!window.ymaps) return;
      
      const container = document.getElementById('yandex-map-container');
      if (!container) return;
      container.innerHTML = ''; // Clear for re-init

      const myMap = new window.ymaps.Map('yandex-map-container', {
        center: [41.3111, 69.2797], // Toshkent — asosiy shahrimiz
        zoom: 6,
        controls: ['zoomControl', 'fullscreenControl']
      }, {
        searchControlProvider: 'yandex#search'
      });

      // Coordinates mapping
      const coordsMap: Record<string, number[]> = {
        'Tashkent': [41.2995, 69.2401],
        'Samarkand': [39.6270, 66.9750],
        'Bukhara': [39.7747, 64.4286],
        'Khorezm': [41.3789, 60.3644], // Khiva
        'Kashkadarya': [38.8610, 65.7847], // Karshi
        'Surkhandarya': [37.2283, 67.2753], // Termez
        'Fergana': [40.3842, 71.7843],
        'Namangan': [40.9983, 71.6726],
        'Andijan': [40.7821, 72.3442],
        'Jizzakh': [40.1158, 67.8422],
        'Sirdarya': [40.4858, 68.7836], // Gulistan
        'Navoiy': [40.0844, 65.3792]
      };

      regions.forEach(reg => {
        const point = coordsMap[reg.name];
        if (point) {
          const placemark = new window.ymaps.Placemark(point, {
            balloonContent: `<strong>${reg.name}</strong><br/>${reg.count} ${lang === 'ru' ? 'проектов' : 'projects'}`,
            hintContent: reg.name
          }, {
            preset: 'islands#goldDotIconWithCaption',
            iconColor: '#C9A84C'
          });
          myMap.geoObjects.add(placemark);
        }
      });

      // Enable scroll zoom only on focus
      myMap.behaviors.disable('scrollZoom');
    };

    if (window.ymaps) {
      window.ymaps.ready(init);
    }
  }, [regions]);

  return null;
}
