import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import HeroSection from '../components/common/HeroSection';
import './Contact.css';

export default function Contact() {
  const { t, lang } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbSettings, setDbSettings] = useState<Record<string, api.Setting>>({});
  const [categories, setCategories] = useState<api.Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sett, cats] = await Promise.all([
          api.settingsApi.getAll(""),
          api.categoriesApi.getAll()
        ]);
        
        const sMap: Record<string, api.Setting> = {};
        if (Array.isArray(sett)) {
          sett.forEach(s => sMap[s.key] = s);
        }
        setDbSettings(sMap);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) { 
        console.error("Data fetch error in Contact:", err); 
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const data = {
      fullname: fd.get('fullname') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string || '',
      service_type: fd.get('service_type') as string || '',
      message: fd.get('message') as string || '',
      status: 'pending'
    };
    try {
      await api.applicationsApi.create(data);
      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <HeroSection 
        variant="page"
        content={{
          titleLine1: (lang === 'ru' ? dbSettings['contact_hero_title']?.value_ru : dbSettings['contact_hero_title']?.value_en) || t('contact.title'),
          description: (lang === 'ru' ? dbSettings['contact_hero_desc']?.value_ru : dbSettings['contact_hero_desc']?.value_en) || t('contact.desc'),
          images: [(lang === 'ru' ? dbSettings['contact_hero_image']?.value_ru : dbSettings['contact_hero_image']?.value_en) || 'https://media.istockphoto.com/id/2217340726/photo/hotel-reception-desk-with-vintage-silver-bell.webp?a=1&b=1&s=612x612&w=0&k=20&c=wGqtsj35-a-GvnpbMZX_W1ESOFR4hTbFnAX12XAFPE8='],
          label: t('nav.contact'),
          breadcrumbs: [{ label: t('nav.contact'), path: '/contact' }]
        }}
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <ScrollReveal direction="left">
              <div className="contact-form-wrap">
                <h3>{t('contact.form.title')}</h3>
                <p>{t('contact.form.desc')}</p>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t('contact.form.name')}</label>
                    <input name="fullname" type="text" className="form-input" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.form.phone')}</label>
                    <input name="phone" type="tel" className="form-input" placeholder="+998 XX XXX XX XX" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.form.service')}</label>
                    <select name="service_type" className="form-select" disabled={isCategoriesLoading}>
                      <option value="">{isCategoriesLoading ? 'Loading service list...' : t('contact.form.service')}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name_en}>
                          {lang === 'ru' ? cat.name_ru : cat.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.form.message')}</label>
                    <textarea name="message" className="form-textarea" placeholder="..." rows={4}></textarea>
                  </div>
                  <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Sending...' : t('contact.form.submit')}
                  </button>
                  {submitted && <p className="form-success">{t('contact.form.success')}</p>}
                  {error && <p className="form-error" style={{color: 'red', marginTop: '10px'}}>{error}</p>}
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="contact-info">
                <h3 className="contact-info__title">{t('about.label')}</h3>
                <div className="contact-info__items">
                  <div className="contact-info__item">
                    <div className="contact-info__icon-wrap"><FaPhone /></div>
                    <div className="contact-info__text">
                      <span className="contact-info__label">{t('about.team.role3')}</span>
                      <strong className="contact-info__value">+998 90 123 45 67</strong>
                    </div>
                  </div>
                  <div className="contact-info__item">
                    <div className="contact-info__icon-wrap"><FaEnvelope /></div>
                    <div className="contact-info__text">
                      <span className="contact-info__label">Email</span>
                      <strong className="contact-info__value">info@hotelpro.uz</strong>
                    </div>
                  </div>
                  <div className="contact-info__item">
                    <div className="contact-info__icon-wrap"><FaMapMarkerAlt /></div>
                    <div className="contact-info__text">
                      <span className="contact-info__label">{t('contact.map.label')}</span>
                      <strong className="contact-info__value">Tashkent, Uzbekistan</strong>
                    </div>
                  </div>
                </div>
                
                <div className="contact-info__cta">
                  <h4>{t('cta.title')}</h4>
                  <p>{t('about.p3')}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
