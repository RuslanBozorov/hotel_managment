import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaChevronDown, FaStar, FaChevronRight } from 'react-icons/fa';
import { useI18n } from '../../i18n';
import './HeroSection.css';

export interface HeroContent {
  label: string;
  titleLine1: string;
  titleLine2?: string;
  description: string;
  images: string[];
  proofText?: string;
  breadcrumbs?: { label: string; path: string }[];
}

interface HeroSectionProps {
  content: HeroContent;
  variant?: 'home' | 'page';
}

const HeroSection: React.FC<HeroSectionProps> = ({ content, variant = 'home' }) => {
  const { t } = useI18n();
  const [heroBgIndex, setHeroBgIndex] = useState(0);

  const images = content.images.length > 0 ? content.images : [
    'https://t4.ftcdn.net/jpg/12/13/53/87/1000_F_1213538740_UY2n8RKPcTYOCkdq5Jiv7zfa8p2WvPLZ.jpg'
  ];

  useEffect(() => {
    if (variant !== 'home' || images.length <= 1) return;
    const timer = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length, variant]);

  // Home Variant
  if (variant === 'home') {
    return (
      <section className="hero">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={heroBgIndex}
            className="hero__bg-image"
            style={{ backgroundImage: `url(${images[heroBgIndex]})` }}
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
            <span className="hero__label">
              {content.label}
            </span>
            <h1 className="hero__title">
              {content.titleLine1}<br />
              {content.titleLine2 && (
                <span className="text-gradient">
                  {content.titleLine2}
                </span>
              )}
            </h1>
            <p className="hero__desc">
              {content.description}
            </p>
            <div className="hero__proof">
              <div className="hero__proof-stars">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <span>{content.proofText || t('hero.proof')}</span>
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

        {images.length > 1 && (
          <div className="hero__dots">
            {images.map((_, i) => (
              <button 
                key={i} 
                className={`hero__dot ${heroBgIndex === i ? 'hero__dot--active' : ''}`}
                onClick={() => setHeroBgIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // Page Variant (Standard for internal pages)
  const backgroundImage = images[0] || 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3';

  return (
    <section className="page-hero">
      <div className="page-hero__bg-image" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="page-hero__overlay" />
      <div className="container page-hero__content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          {content.breadcrumbs && (
            <nav className="breadcrumbs">
              <Link to="/">{t('nav.home')}</Link>
              {content.breadcrumbs.map((bc, i) => (
                <React.Fragment key={i}>
                  <FaChevronRight className="bc-separator" />
                  {i === content.breadcrumbs!.length - 1 ? (
                    <span>{bc.label}</span>
                  ) : (
                    <Link to={bc.path}>{bc.label}</Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="page-hero__title">{content.titleLine1}</h1>
          <p className="page-hero__desc">{content.description}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
