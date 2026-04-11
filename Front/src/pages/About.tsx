import { motion } from 'framer-motion';
import { FaBullseye, FaArrowRight, FaQuoteLeft, FaCheckCircle, FaAward, FaGlobeAmericas, FaLightbulb, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { useState, useEffect } from 'react';
import './About.css';

export default function About() {
  const { t, lang } = useI18n();
  const [teamMembers, setTeamMembers] = useState<api.TeamMember[]>([]);
  const [dbTimeline, setDbTimeline] = useState<api.Timeline[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, tlData] = await Promise.all([
          api.teamApi.getAll(""),
          api.timelinesApi.getAll("")
        ]);
        setTeamMembers(teamData);
        if (tlData.length > 0) setDbTimeline(tlData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const timeline = [
    { year: '2009', desc: t('about.history.2009') },
    { year: '2012', desc: t('about.history.2012') },
    { year: '2015', desc: t('about.history.2015') },
    { year: '2018', desc: t('about.history.2018') },
    { year: '2021', desc: t('about.history.2021') },
    { year: '2024', desc: t('about.history.2024') },
  ];

  return (
    <main className="about-page">
      {/* 1. HERO */}
      <section className="about-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b)' }}>
        <div className="about-hero__overlay" />
        <div className="container about-hero__content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <nav className="breadcrumbs">
              <Link to="/">{t('nav.home')}</Link>
              <FaChevronRight />
              <span>{t('nav.about')}</span>
            </nav>
            <h1 className="about-hero__title">{t('about.title')}</h1>
            <p className="about-hero__desc">{t('about.p1')}</p>
          </motion.div>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="section about-mission">
        <div className="container">
          <div className="about-mission__grid">
            <ScrollReveal direction="left">
              <div className="about-mission__image">
                <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df" alt="Hospitality Excellence" />
                <div className="about-mission__exp">
                  <strong>15+</strong>
                  <span>{t('stats.years')}</span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="about-mission__content">
                <span className="section-label">{t('about.label')}</span>
                <h2>{t('about.title')}</h2>
                <p className="lead">{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
                
                <div className="about-mission__values">
                  <div className="about-mission__value">
                    <div className="value-icon"><FaBullseye /></div>
                    <div>
                      <h4>{t('about.value1.title')}</h4>
                      <p>{t('about.value1.desc')}</p>
                    </div>
                  </div>
                  <div className="about-mission__value">
                    <div className="value-icon"><FaAward /></div>
                    <div>
                      <h4>{t('about.value2.title')}</h4>
                      <p>{t('about.value2.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. TIMELINE */}
      <section className="section section--alt about-timeline">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('about.history.title')}</span>
              <h2 className="section-header__title">{t('about.history.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>
          
          <div className="timeline">
            <div className="timeline__line" />
            {(dbTimeline.length > 0 ? dbTimeline : timeline).map((item: any, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className={`timeline__item ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}>
                  <div className="timeline__dot" />
                  <div className="timeline__content">
                    <span className="timeline__year">{item.year}</span>
                    <p>{item.desc || (lang === 'ru' ? item.desc_ru : item.desc_en)}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEAM */}
      <section className="section about-team">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-header__label">{t('nav.about')}</span>
              <h2 className="section-header__title">{t('about.team.title')}</h2>
              <div className="section-header__line" />
            </div>
          </ScrollReveal>

          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.id} delay={i * 0.1}>
                <div className="team-card">
                  <div className="team-card__image img-placeholder">
                    {member.image_url ? (
                       <img src={member.image_url} alt={member.fullname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{member.fullname.split(' ').map(n => n[0]).join('')}</span>
                    )}
                  </div>
                  <div className="team-card__info">
                    <h3>{member.fullname}</h3>
                    <p>{lang === 'ru' ? member.role_ru : member.role_en}</p>
                    <div className="team-card__social">
                      {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener">LinkedIn</a>}
                      {member.linkedin && member.email && " | "}
                      {member.email && <a href={`mailto:${member.email}`}>Email</a>}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PHILOSOPHY */}
      <section className="section section--dark about-philosophy">
        <div className="container">
          <div className="philosophy-grid">
            <ScrollReveal direction="left">
              <div className="philosophy-content">
                <span className="section-label">{t('about.label')}</span>
                <h2>{t('about.philosophy.title')}</h2>
                <p className="philosophy-desc">{t('about.philosophy.desc')}</p>
                <ul className="philosophy-list">
                  {(t('about.philosophy.points') as string[]).map((point, i) => (
                    <li key={i}>
                      <FaCheckCircle className="text-gold" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="philosophy-visual">
                <div className="quote-box">
                  <FaQuoteLeft className="quote-icon" />
                  <p>"Hospitality is where empathy meets excellence."</p>
                  <span>— HotelPro Founding Philosophy</span>
                </div>
                <div className="philosophy-stats">
                  <div className="p-stat">
                    <FaGlobeAmericas />
                    <strong><AnimatedCounter end={12} /></strong>
                    <span>{t('stats.regions')}</span>
                  </div>
                  <div className="p-stat">
                    <FaLightbulb />
                    <strong><AnimatedCounter end={60} suffix="+" /></strong>
                    <span>{t('stats.hotels')}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="cta-banner">
        <div className="container text-center">
          <ScrollReveal>
            <h2 className="cta-banner__title">{t('cta.title')}</h2>
            <Link to="/contact" className="btn btn--primary btn--lg">
              {t('nav.cta')} <FaArrowRight />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
