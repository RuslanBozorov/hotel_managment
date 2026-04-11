import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight, FaChevronDown, FaStar, FaHotel, FaGlobeAmericas, FaUsers,
  FaShieldAlt, FaHandshake, FaChartLine, FaAward,
  FaCertificate, FaPhone, FaTelegramPlane, FaSearch, FaFileContract,
  FaCogs, FaRocket, FaQuoteLeft, FaChevronLeft, FaChevronRight,
  FaDoorOpen, FaBullhorn, FaUserGraduate, FaPaintBrush, FaPlayCircle,
  FaCalendarAlt, FaTag, FaMapMarkerAlt, FaKey
} from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import './Home.css';

export default function Home() {
  const { t, lang } = useI18n();
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [dbProjects, setDbProjects] = useState<api.Project[]>([]);
  const [dbServices, setDbServices] = useState<api.Service[]>([]);
  const [dbStats, setDbStats] = useState<api.Stat[]>([]);
  const [dbTestimonials, setDbTestimonials] = useState<api.Testimonial[]>([]);
  const [dbPartners, setDbPartners] = useState<api.Partner[]>([]);
  const [dbBlogs, setDbBlogs] = useState<api.Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // === DATA ===
  const heroImages = [
    'https://avatars.mds.yandex.net/i?id=521bfc2d883b6f15195e47d11789e37fa85b9138-10119934-images-thumbs&n=13', // Hotel Exterior (Yandex)
    'https://img.freepik.com/premium-photo/interior-space-big-bed-room-luxury-hotel_1112-7131.jpg'          // Hotel Bedroom (Freepik)
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, serv, st, tst, prt, blg] = await Promise.all([
          api.projectsApi.getAll(""),
          api.servicesApi.getAll(""),
          api.statsApi.getAll(""),
          api.testimonialsApi.getAll(""),
          api.partnersApi.getAll(""),
          api.blogsApi.getAll("")
        ]);
        setDbProjects(proj.filter(p => p.is_featured).slice(0, 6));
        setDbServices(serv.slice(0, 6));
        if (st.length > 0) setDbStats(st);
        if (tst.length > 0) setDbTestimonials(tst);
        if (prt.length > 0) setDbPartners(prt);
        setDbBlogs(blg.slice(0, 3));
      } catch (err) {
        console.error("Home data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: FaHotel, value: 60, suffix: '+', label: t('stats.hotels') },
    { icon: FaGlobeAmericas, value: 15, suffix: '+', label: t('stats.years') },
    { icon: FaMapMarkerAlt, value: 12, suffix: '', label: t('stats.regions') },
    { icon: FaUsers, value: 500, suffix: '+', label: t('stats.staff') },
    { icon: FaHandshake, value: 70, suffix: '+', label: t('stats.brands') },
    { icon: FaAward, value: 98, suffix: '%', label: t('stats.satisfaction') },
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

  const featuredProjects = [
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
      text: 'Thanks to HotelPro\'s revenue management, our occupancy rate increased by 40% in the first 6 months. Their transparent reporting gives us full visibility into performance.',
      textRu: 'Благодаря revenue management от HotelPro, наша заполняемость выросла на 40% за первые 6 месяцев. Их прозрачная отчётность даёт полную картину.',
      author: 'Akbar Toshmatov',
      position: 'Bukhara Heritage Hotel Owner',
      positionRu: 'Владелец Bukhara Heritage Hotel',
    },
    {
      text: 'We planned to open a 4-star hotel in Bukhara. The HotelPro team was with us from pre-opening to the arrival of the first guest. Now our hotel has the highest rating in the region.',
      textRu: 'Мы планировали открыть 4-звёздочный отель в Бухаре. Команда HotelPro была с нами от pre-opening до прибытия первого гостя. Теперь наш отель имеет самый высокий рейтинг в регионе.',
      author: 'Dilnoza Rashidova',
      position: 'Samarkand Grand Resort Investor',
      positionRu: 'Инвестор Samarkand Grand Resort',
    },
    {
      text: 'The franchise acquisition process seemed impossible, but HotelPro guided us through every step. We are now a proud Hilton property in Uzbekistan.',
      textRu: 'Процесс получения франшизы казался невозможным, но HotelPro провели нас через каждый этап. Теперь мы — отель Hilton в Узбекистане.',
      author: 'Bobur Mamatov',
      position: 'Hilton Tashkent Director',
      positionRu: 'Директор Hilton Tashkent',
    },
  ];

  const partnersRow1 = ['Hilton', 'Wyndham', 'IHG', 'Marriott', 'Accor', 'Best Western', 'Radisson', 'Hyatt'];
  const partnersRow2 = ['Choice Hotels', 'NH Hotels', 'Mövenpick', 'Kempinski', 'Rotana', 'Dusit', 'Rixos', 'Premier Inn'];

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

  const regionsData = [
    { name: 'Tashkent', count: 15 }, { name: 'Samarkand', count: 8 },
    { name: 'Bukhara', count: 6 }, { name: 'Khorezm', count: 4 },
    { name: 'Kashkadarya', count: 3 }, { name: 'Surkhandarya', count: 2 },
    { name: 'Fergana', count: 5 }, { name: 'Namangan', count: 3 },
    { name: 'Andijan', count: 2 }, { name: 'Tashkent Region', count: 7 },
    { name: 'Jizzakh', count: 2 }, { name: 'Sirdarya', count: 1 },
  ];

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
      {/* ===== 1. HERO (WITH SLIDER) ===== */}
      <section className="hero">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={heroBgIndex}
            className="hero__bg-image"
            style={{ backgroundImage: `url(${heroImages[heroBgIndex]})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="hero__overlay" />
        <div className="container hero__content">
          <motion.div className="hero__text"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="hero__label">{t('hero.label')}</span>
            <h1 className="hero__title">
              {t('hero.title.line1')}<br />
              <span className="text-gradient">{t('hero.title.line2')}</span>
            </h1>
            <p className="hero__desc">{t('hero.desc')}</p>
            <div className="hero__proof">
              <div className="hero__proof-stars">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <span>{t('hero.proof')}</span>
            </div>
            <div className="hero__btns">
              <Link to="/services" className="btn btn--primary btn--lg">
                {t('hero.btn.services')} <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn btn--outline btn--lg">
                {t('hero.btn.consult')}
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div className="hero__scroll"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <span>{t('hero.scroll')}</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <FaChevronDown />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== 2. STATS ===== */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {(dbStats.length > 0 ? dbStats : stats).map((stat: any, i) => {
              const valStr = String(stat.value);
              const numPart = parseInt(valStr.replace(/[^0-9]/g, '')) || 0;
              const suffixPart = valStr.replace(/[0-9]/g, '') || (stat.suffix || '');
              const label = stat.label || (lang === 'ru' ? stat.label_ru : stat.label_en);
              
              return (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="stat-card">
                    <FaHotel className="stat-card__icon" />
                    <div className="stat-card__value">
                      <AnimatedCounter end={numPart} suffix={suffixPart} />
                    </div>
                    <div className="stat-card__label">{label}</div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 3. PARTNERS ===== */}
      <section className="partners-section partners-section--top">
        <div className="container">
          <ScrollReveal>
            <div className="section-header section-header--compact">
              <span className="section-header__label">{t('partners.label')}</span>
              <h2 className="section-header__title">{t('partners.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>
        </div>
        <div className="partners-track-wrapper">
          <div className="partners-track partners-track--left">
            {(dbPartners.length > 0 ? dbPartners.map(p => p.name) : partnersRow1).concat(dbPartners.length > 0 ? dbPartners.map(p => p.name) : partnersRow1).map((b, i) => (
              <div key={i} className="partner-logo"><span>{b}</span></div>
            ))}
          </div>
          <div className="partners-track partners-track--right">
            {(dbPartners.length > 0 ? dbPartners.map(p => p.name) : partnersRow2).concat(dbPartners.length > 0 ? dbPartners.map(p => p.name) : partnersRow2).map((b, i) => (
              <div key={i} className="partner-logo"><span>{b}</span></div>
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
                  <img src="https://images.unsplash.com/photo-1541336032412-2048a678540d" alt="Hotel Lobby Interior" />
                </div>
                <div className="about-teaser__badge">{t('about.badge')}</div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="about-teaser__content">
                <span className="section-label">{t('about.label')}</span>
                <h2>{t('about.title')}</h2>
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
                <div className="about-teaser__values">
                  <div className="about-teaser__value-item">
                    <span className="about-teaser__value-icon">✦</span>
                    <div><strong>{t('about.value1.title')}</strong><span>{t('about.value1.desc')}</span></div>
                  </div>
                  <div className="about-teaser__value-item">
                    <span className="about-teaser__value-icon">✦</span>
                    <div><strong>{t('about.value2.title')}</strong><span>{t('about.value2.desc')}</span></div>
                  </div>
                  <div className="about-teaser__value-item">
                    <span className="about-teaser__value-icon">✦</span>
                    <div><strong>{t('about.value3.title')}</strong><span>{t('about.value3.desc')}</span></div>
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
              const Icon = isDb ? FaHotel : s.icon;
              const isPopular = isDb ? s.is_popular : s.popular;

              return (
                <ScrollReveal key={isDb ? s.id : i} delay={i * 0.08}>
                  <Link to="/services" className="service-preview-card">
                    {isPopular && <span className="service-preview-card__badge">{t('services.popular')}</span>}
                    <div className="service-preview-card__icon-wrap">
                      <Icon className="service-preview-card__icon" />
                    </div>
                    <h3 className="service-preview-card__title">{title}</h3>
                    <p className="service-preview-card__desc">{desc}</p>
                    <span className="service-preview-card__link">{t('services.btn')} <FaArrowRight /></span>
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
            {(dbProjects.length > 0 ? dbProjects : featuredProjects).map((project: any, i) => (
              <ScrollReveal key={project.id} delay={i * 0.08}>
                <div className="portfolio-card">
                  <div className="portfolio-card__image img-placeholder">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FaHotel />
                    )}
                  </div>
                  <div className="portfolio-card__overlay">
                    <div className="portfolio-card__stars">
                      {[...Array(project.stars)].map((_, j) => <FaStar key={j} />)}
                    </div>
                    <h3 className="portfolio-card__title">{project.name}</h3>
                    <p className="portfolio-card__location">{project.city}</p>
                    <span className="portfolio-card__role">
                      {lang === 'ru' ? (project.role_ru || project.role) : (project.role_en || project.role)}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
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
                <span className="section-label">{t('why.label')}</span>
                <h2>{t('why.title')}</h2>
                <div className="why-list">
                  {advantages.map((adv, i) => (
                    <div key={i} className="why-item">
                      <div className="why-item__icon-wrap"><adv.icon /></div>
                      <div>
                        <h4>{t(adv.titleKey)}</h4>
                        <p>{t(adv.descKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="why-visual">
                 <div className="why-visual__image">
                   <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0" alt="Team Work" />
                 </div>
                <div className="why-visual__badge">15+ {lang === 'ru' ? 'лет опыта' : 'years experience'}</div>
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
                      {dbTestimonials[testimonialIndex].author.split(' ').map(n => n[0]).join('')}
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
              <div className="media-block__video img-placeholder">
                <FaPlayCircle className="media-block__play" />
              </div>
              <div className="media-block__text">
                <h2>{t('media.title')}</h2>
                <p>{t('media.desc')}</p>
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
            {(dbBlogs.length > 0 ? dbBlogs : blogArticles).map((article: any, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <article className="blog-preview-card">
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
                    <span className="blog-preview-card__link">{t('blog.read')} <FaArrowRight /></span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
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
              <div className="geo-map img-placeholder"><FaGlobeAmericas /></div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="geo-regions">
                {regionsData.map((r, i) => (
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
              <a href="https://t.me/hotelpro_uz" className="btn btn--primary btn--lg" target="_blank" rel="noopener">
                <FaTelegramPlane /> {t('cta.btn.write')}
              </a>
              <a href="tel:+998711234567" className="btn btn--outline btn--lg">
                <FaPhone /> {t('cta.btn.call')}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
