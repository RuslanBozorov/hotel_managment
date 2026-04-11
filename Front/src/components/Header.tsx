import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone } from 'react-icons/fa';
import { useI18n } from '../i18n';
import type { Language } from '../i18n';
import './Header.css';

const langs: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useI18n();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/about', label: t('nav.about') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''} ${isMobileOpen ? 'header--mobile-open' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">H</span>
          <span className="header__logo-text">Hotel<span className="text-gold">Pro</span></span>
          <span className="header__logo-since">Since 2009</span>
        </Link>

        <nav className="header__nav">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={`header__link ${location.pathname === link.path ? 'header__link--active' : ''}`}>
              {link.label}
              {location.pathname === link.path && (
                <motion.div className="header__link-indicator" layoutId="nav-indicator" />
              )}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <div className="header__lang">
            {langs.map((l) => (
              <button key={l.code}
                className={`header__lang-btn ${lang === l.code ? 'header__lang-btn--active' : ''}`}
                onClick={() => setLang(l.code)}>{l.label}</button>
            ))}
          </div>
          <a href="tel:+998901234567" className="header__phone">
            <FaPhone size={11} /> +998 90 123 45 67
          </a>
          <Link to="/contact" className="btn btn--primary btn--sm header__cta">{t('nav.cta')}</Link>
          <button className="header__burger" onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label="Menu">
            {isMobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div className="header__mobile"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <nav className="header__mobile-nav">
              {navLinks.map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={link.path}
                    className={`header__mobile-link ${location.pathname === link.path ? 'header__mobile-link--active' : ''}`}
                    onClick={() => setIsMobileOpen(false)}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="header__mobile-lang">
              {langs.map((l) => (
                <button key={l.code}
                  className={`header__lang-btn ${lang === l.code ? 'header__lang-btn--active' : ''}`}
                  onClick={() => setLang(l.code)}>{l.label}</button>
              ))}
            </div>
            <Link to="/contact" className="btn btn--primary btn--lg" style={{ width: '100%' }}
              onClick={() => setIsMobileOpen(false)}>
              <FaPhone size={14} /> {t('nav.cta')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
