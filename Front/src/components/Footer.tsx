import { Link } from 'react-router-dom';
import { FaInstagram, FaTelegram, FaLinkedin, FaYoutube, FaFacebook, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { useI18n } from '../i18n';
import './Footer.css';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        {/* Column 1: Brand */}
        <div className="footer__col">
          <Link to="/" className="footer__logo">
            Hotel<span className="text-gold">Pro</span>
          </Link>
          <p className="footer__desc">{t('footer.desc')}</p>
          <div className="footer__socials">
            <a href="#" className="footer__social"><FaInstagram /></a>
            <a href="#" className="footer__social"><FaTelegram /></a>
            <a href="#" className="footer__social"><FaLinkedin /></a>
            <a href="#" className="footer__social"><FaYoutube /></a>
            <a href="#" className="footer__social"><FaFacebook /></a>
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
              <FaMapMarkerAlt /> <span>Tashkent, Yunusabad district, Business Center "Elite"</span>
            </div>
            <a href="tel:+998711234567" className="footer__contact">
              <FaPhone /> <span>+998 71 XXX XX XX</span>
            </a>
            <a href="mailto:info@hotelpro.uz" className="footer__contact">
              <FaEnvelope /> <span>info@hotelpro.uz</span>
            </a>
            <a href="https://t.me/hotelpro_uz" target="_blank" rel="noreferrer" className="footer__contact">
              <FaTelegram /> <span>@hotelpro_uz</span>
            </a>
            <div className="footer__contact">
              <FaClock /> <span>{t('footer.worktime.value')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>&copy; 2025 HotelPro. {t('footer.copyright')}</p>
        <div className="footer__bottom-links">
          <Link to="#">{t('footer.privacy')}</Link>
          <Link to="#">{t('footer.terms')}</Link>
          <a href="https://myweb.uz/" target="_blank" rel="noopener noreferrer" className="footer__dev">
            {t('footer.dev')}: <span className="text-gold">MyWeb.uz</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
