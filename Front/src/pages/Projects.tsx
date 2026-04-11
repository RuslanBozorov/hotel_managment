import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import './Projects.css';

export default function Projects() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>('all');
  const [dbProjects, setDbProjects] = useState<api.Project[]>([]);

  const initialProjects: any[] = [
    { id: 101, name: 'Hilton Tashkent City', city: 'Tashkent', stars: 5, role: 'Full Management', category: 'management', image_url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791' },
    { id: 102, name: 'Registan Plaza', city: 'Samarkand', stars: 4, role: 'Pre-Opening', category: 'preopening', image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' },
    { id: 103, name: 'Bukhara Palace Resort', city: 'Bukhara', stars: 5, role: 'Profit Optimization', category: 'management', image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d' },
    { id: 104, name: 'Fergana Grand Hotel', city: 'Fergana', stars: 4, role: 'Marketing Strategy', category: 'marketing', image_url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c' },
    { id: 105, name: 'Silk Road Boutique', city: 'Khiva', stars: 4, role: 'Concept Design', category: 'consulting', image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427' },
    { id: 106, name: 'Chimyon Alpine Resort', city: 'Tashkent Region', stars: 4, role: 'Technical Audit', category: 'consulting', image_url: 'https://images.unsplash.com/photo-1551882547-ff43c639f675' },
    { id: 107, name: 'Namangan Royal Inn', city: 'Namangan', stars: 3, role: 'Franchise Acquisition', category: 'consulting', image_url: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a' },
    { id: 108, name: 'Andijan Business Plaza', city: 'Andijan', stars: 3, role: 'Crisis Management', category: 'management', image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4' },
    { id: 109, name: 'Termez Archeo Hotel', city: 'Termez', stars: 4, role: 'Digital Marketing', category: 'marketing', image_url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3' },
    { id: 110, name: 'Nukus Desert Oasis', city: 'Nukus', stars: 3, role: 'Staff Training', category: 'preopening', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.projectsApi.getAll(""); // Backend doesn't strictly need token for GET if we want public access
        setDbProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'all' 
    ? (dbProjects.length > 0 ? dbProjects : initialProjects) 
    : (dbProjects.length > 0 ? dbProjects : initialProjects).filter(p => {
        const cat = p.category?.toLowerCase() || '';
        if (filter === 'marketingandsales') return cat.includes('marketing') || cat.includes('sales');
        return cat.includes(filter);
      });

  const filters = [
    { id: 'all', label: t('projects.filters.all') },
    { id: 'management', label: t('projects.filters.management') },
    { id: 'preopening', label: t('projects.filters.preopening') },
    { id: 'consulting', label: t('projects.filters.consulting') },
    { id: 'marketing', label: 'Marketing & Sales' },
  ];

  return (
    <main className="projects-page">
      {/* 1. HERO */}
      <section className="projects-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945)' }}>
        <div className="projects-hero__overlay" />
        <div className="container projects-hero__content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <nav className="breadcrumbs">
              <Link to="/">{t('nav.home')}</Link> / <span>{t('nav.projects')}</span>
            </nav>
            <h1 className="projects-hero__title">{t('projects.title')}</h1>
            <p className="projects-hero__desc">{t('projects.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <section className="projects-filters">
        <div className="container">
          <div className="filters-container">
            {filters.map((f) => (
              <button
                key={f.id}
                className={`filter-btn ${filter === f.id ? 'filter-btn--active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROJECT GRID */}
      <section className="section projects-grid-section">
        <div className="container">
          <motion.div 
            layout
            className="portfolio-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="portfolio-card"
                >
                  <div className="portfolio-card__image img-placeholder">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{project.name.substring(0, 2).toUpperCase()}</span>
                    )}
                    <div className="portfolio-card__badge">
                      {project.category}
                    </div>
                  </div>
                  
                  <div className="portfolio-card__content">
                    <div className="portfolio-card__top">
                      <h3>{project.name}</h3>
                      <div className="stars">
                        {[...Array(project.stars)].map((_, i) => (
                          <FaStar key={i} className="text-gold" />
                        ))}
                      </div>
                    </div>
                    
                    <p className="portfolio-card__loc">
                      <FaMapMarkerAlt /> {project.city}
                    </p>
                    
                    <div className="portfolio-card__metrics">
                       <div className="metric">
                        <span className="metric-label">Role</span>
                        <span className="metric-value">
                          {t('nav.home') === 'Home' ? (project.role_en || project.role) : (project.role_ru || project.role)}
                        </span>
                      </div>
                    </div>
                    
                    <Link to="/contact" className="portfolio-card__link">
                      {t('nav.cta')} <FaArrowRight />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 4. CTA */}
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
