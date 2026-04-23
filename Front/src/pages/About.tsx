import { FaBullseye, FaArrowRight, FaQuoteLeft, FaCheckCircle, FaAward, FaGlobeAmericas, FaLightbulb, FaLinkedin, FaTelegram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import { useState, useEffect } from 'react';
import { formatTelegramLink } from '../utils/formatters';
import HeroSection from '../components/common/HeroSection';
import './About.css';

export default function About() {
  const { t, lang } = useI18n();
  const [teamMembers, setTeamMembers] = useState<api.TeamMember[]>([]);
  const [dbTimeline, setDbTimeline] = useState<api.Timeline[]>([]);
  const [dbSettings, setDbSettings] = useState<Record<string, api.Setting>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, tlData, settingsData] = await Promise.all([
          api.teamApi.getAll(""),
          api.timelinesApi.getAll(""),
          api.settingsApi.getAll("")
        ]);
        setTeamMembers(teamData);
        if (tlData.length > 0) setDbTimeline(tlData);
        
        const sMap: Record<string, api.Setting> = {};
        if (Array.isArray(settingsData)) {
          settingsData.forEach(s => sMap[s.key] = s);
        }
        setDbSettings(sMap);
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
      <HeroSection 
        variant="page"
        content={{
          titleLine1: (lang === 'ru' ? dbSettings['about_hero_title']?.value_ru : dbSettings['about_hero_title']?.value_en) || t('about.title'),
          description: (lang === 'ru' ? dbSettings['about_main_desc']?.value_ru : dbSettings['about_main_desc']?.value_en) || t('about.p1'),
          images: [(lang === 'ru' ? dbSettings['about_hero_image']?.value_ru : dbSettings['about_hero_image']?.value_en) || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf'],
          label: t('nav.about'),
          breadcrumbs: [{ label: t('nav.about'), path: '/about' }]
        }}
      />

      {/* 2. MISSION & VISION */}
      <section className="section about-mission">
        <div className="container">
          <div className="about-mission__grid">
            <ScrollReveal direction="left">
              <div className="about-mission__image">
                <img 
                  src={(lang === 'ru' ? dbSettings['about_mission_image']?.value_ru : dbSettings['about_mission_image']?.value_en) || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"} 
                  alt="Hospitality Excellence" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="about-mission__exp">
                  <strong>{(lang === 'ru' ? dbSettings['about_mission_badge_n']?.value_ru : dbSettings['about_mission_badge_n']?.value_en) || '15+'}</strong>
                  <span>{(lang === 'ru' ? dbSettings['about_mission_badge_t']?.value_ru : dbSettings['about_mission_badge_t']?.value_en) || t('stats.years')}</span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="about-mission__content">
                <span className="section-label">
                  {(lang === 'ru' ? dbSettings['about_mission_label']?.value_ru : dbSettings['about_mission_label']?.value_en) || t('about.label')}
                </span>
                <h2>
                  {(lang === 'ru' ? dbSettings['about_mission_title']?.value_ru : dbSettings['about_mission_title']?.value_en) || t('about.title')}
                </h2>
                <p className="lead">
                  {(lang === 'ru' ? dbSettings['about_mission_p1']?.value_ru : dbSettings['about_mission_p1']?.value_en) || t('about.p2')}
                </p>
                {!dbSettings['about_mission_p1'] && <p>{t('about.p3')}</p>}
                
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
            <div className="section-header ">
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
                  <div className="team-card__image">
                    {member.image_url ? (
                       <img src={member.image_url} alt={member.fullname} />
                    ) : (
                      <div className="flex-center" style={{ height: '100%' }}>
                        <span>{member.fullname.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    )}
                  </div>
                  <div className="team-card__info">
                    <h3 className="text-clamp-1">{member.fullname}</h3>
                    <p className="text-clamp-1">
                      {lang === 'ru' ? member.role_ru : member.role_en}
                    </p>
                    <div className="team-card__social">
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <FaLinkedin />
                        </a>
                      )}
                      {member.telegram && (
                        <a href={formatTelegramLink(member.telegram)} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                          <FaTelegram />
                        </a>
                      )}
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
                  <span>— HotelConsulting Founding Philosophy</span>
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
