import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import './Contact.css';

export default function Contact() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <section className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1445019980597-93fa8acb246c)' }}>
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="page-hero__label">{t('nav.contact')}</span>
            <h1 className="page-hero__title">{t('contact.title')}</h1>
            <p className="page-hero__desc">{t('contact.desc')}</p>
          </motion.div>
        </div>
      </section>

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
                    <select name="service_type" className="form-select">
                      <option value="">{t('contact.form.service')}</option>
                      <option>{t('services.management.title')}</option>
                      <option>{t('services.consulting.title')}</option>
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
