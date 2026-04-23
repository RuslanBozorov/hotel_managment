import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTelegram, FaLinkedin, FaYoutube, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { formatTelegramLink } from '../utils/formatters';
import './Footer.css';

export default function Footer() {
  const { t, lang } = useI18n();
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settingsApi.getAll();
        const settingsMap: Record<string, any> = {};
        if (Array.isArray(data)) {
          data.forEach(s => settingsMap[s.key] = s);
        }
        setSettings(settingsMap);
      } catch (err) {
        console.error("Failed to fetch footer settings", err);
      }
    };
    fetchSettings();
  }, []);

  const getS = (key: string) => settings[key]?.[`value_${lang}`] || settings[key]?.value_en || '';

  return (
    <footer className="footer">
      <div className="container footer__grid">
        {/* Column 1: Brand */}
        <div className="footer__col">
          <Link to="/" className="footer__logo">
            {getS('site_logo') ? (
              <img
                src={getS('site_logo')}
                alt={getS('site_name') || 'HotelConsulting'}
                className="footer__logo-img"
              />
            ) : (
              getS('site_name') || 'HotelConsulting'
            )}
          </Link>
          <p className="footer__desc">{t('footer.desc')}</p>
          <div className="footer__socials">
            {getS('social_instagram') && <a href={getS('social_instagram')} target="_blank" rel="noreferrer" className="footer__social"><FaInstagram /></a>}
            {getS('social_telegram') && <a href={formatTelegramLink(getS('social_telegram'))} target="_blank" rel="noreferrer" className="footer__social"><FaTelegram /></a>}
            {getS('social_linkedin') && <a href={getS('social_linkedin')} target="_blank" rel="noreferrer" className="footer__social"><FaLinkedin /></a>}
            {getS('social_youtube') && <a href={getS('social_youtube')} target="_blank" rel="noreferrer" className="footer__social"><FaYoutube /></a>}
            {getS('social_facebook') && <a href={getS('social_facebook')} target="_blank" rel="noreferrer" className="footer__social"><FaFacebook /></a>}
          </div>
        </div>

        {/* Column 2: Pages */}
        <div className="footer__col">
          <h4 className="footer__heading">{t('footer.pages')}</h4>
          <ul className="footer__links">
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/services">{t('nav.services')}</Link></li>
            <li><Link to="/projects">{t('nav.projects')}</Link></li>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/blog">{t('nav.blog')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="footer__col">
          <h4 className="footer__heading">{t('footer.services')}</h4>
          <ul className="footer__links">
            <li><Link to="/services">{t('services.management.title')}</Link></li>
            <li><Link to="/services">{t('services.preopening.title')}</Link></li>
            <li><Link to="/services">{t('services.consulting.title')}</Link></li>
            <li><Link to="/services">{t('services.marketing.title')}</Link></li>
            <li><Link to="/services">{t('services.training.title')}</Link></li>
            <li><Link to="/services">{t('services.franchise.title')}</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer__col">
          <h4 className="footer__heading">{t('footer.contact')}</h4>
          <div className="footer__contacts">
            <div className="footer__contact">
              <FaMapMarkerAlt /> <span>{getS('contact_address') || 'Tashkent, Yunusabad district, Business Center "Elite"'}</span>
            </div>
            <a href={`tel:${(getS('contact_phone') || '+998711234567').replace(/\s+/g, '')}`} className="footer__contact">
              <FaPhone /> <span>{getS('contact_phone') || '+998 71 XXX XX XX'}</span>
            </a>
            <a href={`mailto:${getS('support_email') || 'info@hotelconsulting.uz'}`} className="footer__contact">
              <FaEnvelope /> <span>{getS('support_email') || 'info@hotelconsulting.uz'}</span>
            </a>
            {getS('social_telegram') && (
              <a href={formatTelegramLink(getS('social_telegram'))} target="_blank" rel="noreferrer" className="footer__contact">
                <FaTelegram /> <span>{getS('social_telegram').startsWith('http') ? getS('social_telegram').split('/').pop() : getS('social_telegram')}</span>
              </a>
            )}
            <div className="footer__contact">
              <FaClock /> <span>{t('footer.worktime.value')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <a href="https://myweb.uz/" target="_blank" rel="noopener noreferrer" className="footer__dev">
          {t('footer.dev')}: <span className="text-gold">MyWeb.uz</span>
        </a>
        <div className="footer__bottom-links">
          <Link to="#">{t('footer.privacy')}</Link>
          <Link to="#">{t('footer.terms')}</Link>
          <p className="footer__copyright-text">&copy; 2025 HotelConsulting. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
