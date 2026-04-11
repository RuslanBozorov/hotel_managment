import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaHotel, FaDoorOpen, FaChartLine, FaBullhorn, FaUserGraduate, FaKey, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import './Services.css';

export default function Services() {
  const { t, lang } = useI18n();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [dbServices, setDbServices] = useState<api.Service[]>([]);
  const [dbFaqs, setDbFaqs] = useState<api.Faq[]>([]);

  const initialServices: any[] = [
    {
      id: 1, title_en: 'Hotel Management', title_ru: 'Управление Отелем', 
      desc_en: 'Full operational management including staff recruitment, financial oversight, and international quality standards.', desc_ru: 'Полное операционное управление, включая подбор персонала, финансовый надзор и международные стандарты.',
      icon: 'management', image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd', is_popular: true
    },
    {
      id: 2, title_en: 'Pre-Opening Support', title_ru: 'Pre-Opening Поддержка', 
      desc_en: 'Comprehensive 12-month preparation strategy covering licensing, procurement, systems setup, and launch marketing.', desc_ru: 'Комплексная 12-месячная стратегия подготовки, охватывающая лицензирование, закупки и предпусковой маркетинг.',
      icon: 'preopening', image_url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3', is_popular: true
    },
    {
      id: 3, title_en: 'Strategic Consulting', title_ru: 'Стратегический Консалтинг', 
      desc_en: 'In-depth market research, competition analysis, and feasibility studies to ensure maximum ROI.', desc_ru: 'Глубокое исследование рынка, анализ конкуренции и технико-экономическое обоснование для максимальной прибыли.',
      icon: 'consulting', image_url: 'https://images.unsplash.com/photo-1454165833267-fe9019457027', is_popular: false
    },
    {
      id: 4, title_en: 'Marketing & Sales', title_ru: 'Маркетинг и Продажи', 
      desc_en: 'Digital presence optimization, revenue management, and global OTA distribution strategies.', desc_ru: 'Оптимизация цифрового присутствия, управление доходами и стратегии глобального распространения OTA.',
      icon: 'marketing', image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', is_popular: false
    },
    {
      id: 5, title_en: 'Staff Training', title_ru: 'Обучение Персонала', 
      desc_en: 'Masterclasses on international service standards, guest psychology, and operational excellence.', desc_ru: 'Мастер-классы по международным стандартам обслуживания, психологии гостей и операционному совершенству.',
      icon: 'training', image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', is_popular: false
    },
    {
      id: 6, title_en: 'Asset Management', title_ru: 'Управление Активами', 
      desc_en: 'Strategic oversight to enhance property value and ensure long-term sustainability for owners.', desc_ru: 'Стратегический надзор для повышения стоимости недвижимости и обеспечения долгосрочной устойчивости для владельцев.',
      icon: 'franchise', image_url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df', is_popular: false
    }
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serv, faqData] = await Promise.all([
          api.servicesApi.getAll(""),
          api.faqsApi.getAll("")
        ]);
        setDbServices(serv);
        if (faqData.length > 0) setDbFaqs(faqData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'management': return FaHotel;
      case 'preopening': return FaDoorOpen;
      case 'consulting': return FaChartLine;
      case 'marketing': return FaBullhorn;
      case 'training': return FaUserGraduate;
      case 'franchise': return FaKey;
      default: return FaHotel;
    }
  };

  const faqs = [
    { q: t('services.faq.q1'), a: t('services.faq.a1') },
    { q: t('services.faq.q2'), a: t('services.faq.a2') },
    { q: t('services.faq.q3'), a: t('services.faq.a3') },
    { q: 'What regions do you cover?', a: 'We operate across all 12 regions of Uzbekistan, including Tashkent, Samarkand, Bukhara, and even more remote areas.' },
    { q: 'Do you provide international certification?', a: 'Yes, our training academy provides certifications that meet international hospitality standards.' },
    { q: 'Can you help with Hilton or Marriott franchises?', a: 'Absolutely, we are accredited partners for top-tier international brands and help with the entire acquisition process.' },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <main className="services-page">
      {/* 1. HERO */}
      <section className="services-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3)' }}>
        <div className="services-hero__overlay" />
        <div className="container services-hero__content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <nav className="breadcrumbs">
              <Link to="/">{t('nav.home')}</Link> / <span>{t('nav.services')}</span>
            </nav>
            <h1 className="services-hero__title">{t('services.title')}</h1>
            <p className="services-hero__desc">{t('services.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* 2. DETAILED SECTIONS */}
      {(dbServices.length > 0 ? dbServices : initialServices).map((s, i) => {
        const Icon = getIcon(s.icon || '');
        return (
          <section key={s.id} className={`section ${i % 2 === 0 ? '' : 'section--alt'} service-detail`}>
            <div className="container">
              <div className={`service-detail__grid ${i % 2 === 0 ? '' : 'service-detail__grid--reverse'}`}>
                <ScrollReveal direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="service-detail__image img-placeholder">
                    {s.image_url ? (
                      <img src={s.image_url} alt={lang === 'ru' ? s.title_ru : s.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Icon size={100} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    )}
                    {s.is_popular && <div className="service-detail__badge">{t('services.popular')}</div>}
                  </div>
                </ScrollReveal>
                <ScrollReveal direction={i % 2 === 0 ? 'right' : 'left'}>
                  <div className="service-detail__content">
                    <span className="section-label">{t('services.label')} 0{i + 1}</span>
                    <h2>{lang === 'ru' ? s.title_ru : s.title_en}</h2>
                    <p className="lead">{lang === 'ru' ? s.desc_ru : s.desc_en}</p>
                    
                    <Link to="/contact" className="btn btn--outline">
                      {t('nav.cta')} <FaArrowRight />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* 4. FAQ SECTION */}
      <section className="section services-faq">
        <div className="container container--narrow">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">FAQ</span>
              <h2 className="section-header__title">{t('services.faq.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>

          <div className="faq-list">
            {(dbFaqs.length > 0 ? dbFaqs : faqs).map((faq: any, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={`faq-item ${activeFaq === i ? 'faq-item--active' : ''}`}>
                  <button className="faq-item__question" onClick={() => toggleFaq(i)}>
                    <span>{faq.q || (lang === 'ru' ? faq.question_ru : faq.question_en)}</span>
                    {activeFaq === i ? <FaMinus /> : <FaPlus />}
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div 
                        className="faq-item__answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{faq.a || (lang === 'ru' ? faq.answer_ru : faq.answer_en)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="cta-banner">
        <div className="container text-center">
          <ScrollReveal>
            <h2 className="cta-banner__title">{t('cta.title')}</h2>
            <p className="cta-banner__desc">{t('cta.desc')}</p>
            <Link to="/contact" className="btn btn--primary btn--lg">
              {t('nav.cta')} <FaArrowRight />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
