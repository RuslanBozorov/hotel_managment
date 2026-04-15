import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone } from 'react-icons/fa';
import { useI18n } from '../i18n';
import type { Language } from '../i18n';
import * as api from '../services/api';
import './Header.css';

const langs: { code: Language; label: string; name: string; icon: string }[] = [
  { code: 'en', label: 'EN', name: 'English', icon: 'https://hatscripts.github.io/circle-flags/flags/gb.svg' },
  { code: 'ru', label: 'RU', name: 'Русский', icon: 'https://hatscripts.github.io/circle-flags/flags/ru.svg' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
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

  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [siteName, setSiteName] = useState({ en: 'HotelPro', ru: 'HotelPro' });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settingsApi.getAll();
        const settingsMap: Record<string, any> = {};
        if (Array.isArray(data)) {
          data.forEach(s => settingsMap[s.key] = s);
        }
        if (settingsMap['contact_phone']?.value_en) {
          setPhone(settingsMap['contact_phone'].value_en);
        }
        if (settingsMap['site_name']) {
          setSiteName({
            en: settingsMap['site_name'].value_en || 'HotelPro',
            ru: settingsMap['site_name'].value_ru || 'HotelPro'
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const currentLang = langs.find(l => l.code === lang);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''} ${isMobileOpen ? 'header--mobile-open' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">{(lang === 'ru' ? siteName.ru : siteName.en).charAt(0)}</span>
          <span className="header__logo-text">
            {lang === 'ru' ? siteName.ru : siteName.en}
          </span>
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
          <div className="header__lang-dropdown" ref={langRef}>
            <button className="header__lang-toggle--round" onClick={() => setIsLangOpen(!isLangOpen)}>
              <img src={currentLang?.icon} alt={currentLang?.label} className="lang-icon-img" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div className="header__lang-menu"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}>
                  {langs.map((l) => (
                    <button key={l.code}
                      className={`header__lang-item ${lang === l.code ? 'header__lang-item--active' : ''}`}
                      onClick={() => { setLang(l.code); setIsLangOpen(false); }}>
                      <img src={l.icon} alt={l.label} className="lang-icon-img-sm" />
                      <span className="item-name">{l.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="header__phone">
            <FaPhone size={11} /> {phone}
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
