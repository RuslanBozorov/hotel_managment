import React, { useState, useEffect } from 'react';
import { FaChartLine, FaEnvelope, FaBriefcase, FaLightbulb, FaPlusCircle, FaNewspaper, FaImage, FaProjectDiagram, FaUsers, FaHandshake, FaQuestionCircle, FaBlog, FaStar, FaClock } from 'react-icons/fa';
import * as api from '../../../services/api';
import { useI18n } from '../../../i18n';

const DashboardOverview: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const [counts, setCounts] = useState({
    services: 0, projects: 0, apps: 0, categories: 0,
    testimonials: 0, partners: 0, team: 0, blogs: 0, faqs: 0, stats: 0
  });
  const [recentProjects, setRecentProjects] = useState<api.Project[]>([]);
  const [recentApps, setRecentApps] = useState<api.Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();
  const token = localStorage.getItem('admin_token') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, p, a, c, t_, part, team, b, f, st] = await Promise.all([
          api.servicesApi.getAll(token),
          api.projectsApi.getAll(token),
          api.applicationsApi.getAll(token),
          api.categoriesApi.getAll(token),
          api.testimonialsApi.getAll(token),
          api.partnersApi.getAll(token),
          api.teamApi.getAll(token),
          api.blogsApi.getAll(token),
          api.faqsApi.getAll(token),
          api.statsApi.getAll(token),
        ]);

        setCounts({
          services: Array.isArray(s) ? s.length : 0,
          projects: Array.isArray(p) ? p.length : 0,
          apps: Array.isArray(a) ? a.length : 0,
          categories: Array.isArray(c) ? c.length : 0,
          testimonials: Array.isArray(t_) ? t_.length : 0,
          partners: Array.isArray(part) ? part.length : 0,
          team: Array.isArray(team) ? team.length : 0,
          blogs: Array.isArray(b) ? b.length : 0,
          faqs: Array.isArray(f) ? f.length : 0,
          stats: Array.isArray(st) ? st.length : 0,
        });

        // So'nggi 5 ta loyiha
        if (Array.isArray(p)) {
          setRecentProjects(p.slice(0, 5));
        }

        // So'nggi 5 ta ariza
        if (Array.isArray(a)) {
          const sortedApps = a.sort((x: api.Application, y: api.Application) =>
            new Date(y.created_at).getTime() - new Date(x.created_at).getTime()
          );
          setRecentApps(sortedApps.slice(0, 5));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const allStats = [
    { label: t('admin.dashboard.stats.services') || 'Xizmatlar', value: counts.services.toString(), icon: <FaBriefcase />, color: '#6366f1' },
    { label: t('admin.dashboard.stats.projects') || 'Loyihalar', value: counts.projects.toString(), icon: <FaProjectDiagram />, color: '#10b981' },
    { label: t('admin.dashboard.stats.messages') || 'Xabarlar', value: counts.apps.toString(), icon: <FaEnvelope />, color: '#f59e0b' },
    { label: 'Kategoriyalar', value: counts.categories.toString(), icon: <FaStar />, color: '#8b5cf6' },
    { label: 'Mijoz fikrlari', value: counts.testimonials.toString(), icon: <FaStar />, color: '#ec4899' },
    { label: 'Hamkorlar', value: counts.partners.toString(), icon: <FaHandshake />, color: '#06b6d4' },
    { label: 'Jamoa', value: counts.team.toString(), icon: <FaUsers />, color: '#f97316' },
    { label: 'Blog postlar', value: counts.blogs.toString(), icon: <FaBlog />, color: '#84cc16' },
    { label: 'FAQ', value: counts.faqs.toString(), icon: <FaQuestionCircle />, color: '#a855f7' },
    { label: 'Statistika', value: counts.stats.toString(), icon: <FaChartLine />, color: '#14b8a6' },
  ];

  if (loading) return <div className="adm-loader">{t('admin.common.loading')}</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="adm-heading">{t('admin.dashboard.welcome')}!</h1>
      <p className="adm-subheading">{t('admin.dashboard.welcome_desc') || 'Saytda bo\'layotgan ishlar haqida ma\'lumot.'}</p>

      {/* Help Banner */}
      <div className="adm-help-banner">
        <div className="adm-help-icon"><FaLightbulb /></div>
        <div className="adm-help-content">
          <h4>{t('admin.dashboard.help_title') || 'Qanday foydalanish kerak?'}</h4>
          <p>
            {t('admin.dashboard.help_desc') || 'Chap tomondagi menyudan turli bo\'limlarni boshqaring. O\'zgarishlarni saqlashni unutmang.'}
          </p>
        </div>
      </div>

      {/* Asosiy statistikalar */}
      <h3 style={{ fontWeight: 800, marginBottom: '16px', marginTop: '24px', letterSpacing: '-0.02em' }}>Umumiy statistika</h3>
      <div className="adm-stats-grid">
        {allStats.slice(0, 4).map((stat, i) => (
          <div key={i} className="stat-box" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ marginTop: '4px' }}>{stat.value}</div>
              </div>
              <div style={{
                width: '48px', height: '48px',
                background: `${stat.color}15`, color: stat.color,
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Qo'shimcha statistikalar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px', marginBottom: '32px' }}>
        {allStats.slice(4).map((stat, i) => (
          <div key={i} style={{
            background: 'var(--adm-card-bg)',
            border: '1px solid var(--adm-border)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px', height: '36px',
              background: `${stat.color}15`, color: stat.color,
              borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem'
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{stat.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ikki ustunli layout: So'nggi loyihalar va So'nggi arizalar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* So'nggi loyihalar */}
        <div style={{
          background: 'var(--adm-card-bg)',
          border: '1px solid var(--adm-border)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>So'nggi loyihalar</h3>
            <button
              onClick={() => onNavigate?.('projects')}
              style={{
                background: 'var(--adm-primary)', color: 'white',
                border: 'none', borderRadius: '8px', padding: '6px 12px',
                fontSize: '0.75rem', cursor: 'pointer'
              }}
            >
              Hammasi
            </button>
          </div>
          {recentProjects.length === 0 ? (
            <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem' }}>Loyihalar yo'q</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentProjects.map((project) => (
                <div key={project.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', background: 'var(--adm-bg)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px', height: '40px',
                    background: project.is_featured ? '#f59e0b' : '#6366f1',
                    borderRadius: '8px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {project.stars}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{project.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{project.city} - {project.role_en}</div>
                  </div>
                  {project.is_featured && (
                    <span style={{
                      fontSize: '0.65rem', padding: '2px 8px',
                      background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b',
                      borderRadius: '10px', fontWeight: 600
                    }}>Featured</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* So'nggi arizalar */}
        <div style={{
          background: 'var(--adm-card-bg)',
          border: '1px solid var(--adm-border)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>So'nggi arizalar</h3>
            <button
              onClick={() => onNavigate?.('applications')}
              style={{
                background: 'var(--adm-primary)', color: 'white',
                border: 'none', borderRadius: '8px', padding: '6px 12px',
                fontSize: '0.75rem', cursor: 'pointer'
              }}
            >
              Hammasi
            </button>
          </div>
          {recentApps.length === 0 ? (
            <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem' }}>Arizalar yo'q</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentApps.map((app) => (
                <div key={app.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', background: 'var(--adm-bg)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: app.status === 'pending' ? '#f59e0b' : app.status === 'processed' ? '#10b981' : '#ef4444',
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.7rem'
                  }}>
                    <FaEnvelope />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{app.fullname}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                      {app.service_type || 'Umumiy so\'rov'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '0.65rem', padding: '2px 8px',
                      background: app.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : app.status === 'processed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: app.status === 'pending' ? '#f59e0b' : app.status === 'processed' ? '#10b981' : '#ef4444',
                      borderRadius: '10px', fontWeight: 600
                    }}>
                      {app.status === 'pending' ? 'Yangi' : app.status === 'processed' ? 'Qabul qilingan' : 'Rad etilgan'}
                    </span>
                    <div style={{ fontSize: '0.65rem', color: 'var(--adm-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaClock style={{ fontSize: '0.6rem' }} />
                      {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tezkor harakatlar */}
      <h3 style={{ fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>{t('admin.dashboard.quickActions.title')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <QuickActionCard
          title={t('admin.dashboard.quickActions.newPost') || 'Yangi blog post'}
          desc={t('admin.dashboard.quickActions.newPostDesc') || 'Sayt uchun yangi maqola qo\'shish'}
          icon={<FaNewspaper />}
          color="#8b5cf6"
          onClick={() => onNavigate?.('blog')}
        />
        <QuickActionCard
          title={t('admin.dashboard.quickActions.slider') || 'Slayder sozlamalari'}
          desc={t('admin.dashboard.quickActions.sliderDesc') || 'Bosh sahifa slayderini boshqarish'}
          icon={<FaImage />}
          color="#3b82f6"
          onClick={() => onNavigate?.('hero')}
        />
        <QuickActionCard
          title={t('admin.dashboard.quickActions.clients') || 'Mijoz arizalari'}
          desc={t('admin.dashboard.quickActions.clientsDesc') || 'Yangi so\'rovlarni ko\'rib chiqish'}
          icon={<FaEnvelope />}
          color="#ec4899"
          onClick={() => onNavigate?.('applications')}
        />
        <QuickActionCard
          title="Xizmatlarni boshqarish"
          desc="Saytdagi xizmatlarni qo'shish yoki tahrirlash"
          icon={<FaBriefcase />}
          color="#10b981"
          onClick={() => onNavigate?.('services')}
        />
        <QuickActionCard
          title="Loyihalarni boshqarish"
          desc="Portfolio bo'limini yangilash"
          icon={<FaProjectDiagram />}
          color="#f59e0b"
          onClick={() => onNavigate?.('projects')}
        />
        <QuickActionCard
          title="Jamoa a'zolarini boshqarish"
          desc="Jamoa sahifasini yangilash"
          icon={<FaUsers />}
          color="#f97316"
          onClick={() => onNavigate?.('about')}
        />
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<{ title: string; desc: string; icon: any; color: string; onClick?: () => void }> = ({ title, desc, icon, color, onClick }) => (
  <div className="adm-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }} onClick={onClick}>
    <div style={{
      width: '48px', height: '48px',
      background: color, color: 'white',
      borderRadius: '12px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: '1.2rem', flexShrink: 0,
      boxShadow: `0 4px 12px ${color}40`
    }}>
      {icon}
    </div>
    <div>
      <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{title}</h4>
      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>{desc}</p>
    </div>
    <FaPlusCircle style={{ marginLeft: 'auto', color: 'var(--adm-border)', fontSize: '1rem' }} />
  </div>
);

export default DashboardOverview;
