import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HeroSection from '../components/common/HeroSection';
import ScrollReveal from '../components/ScrollReveal';
import ProjectCard from '../components/ProjectCard';
import { useI18n } from '../i18n';
import * as api from '../services/api';
import './Projects.css';

export default function Projects() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<string>('all');
  const [dbProjects, setDbProjects] = useState<api.Project[]>([]);
  const [dbCategories, setDbCategories] = useState<api.Category[]>([]);
  const [dbSettings, setDbSettings] = useState<Record<string, api.Setting>>({});

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, catData, settingsData] = await Promise.all([
          api.projectsApi.getAll(""),
          api.categoriesApi.getAll(""),
          api.settingsApi.getAll("")
        ]);
        setDbProjects(data);
        setDbCategories(Array.isArray(catData) ? catData : []);
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

  const allProjects = dbProjects.length > 0 ? dbProjects : initialProjects;

  const filteredProjects = filter === 'all' 
    ? allProjects 
    : allProjects.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat === filter || cat.includes(filter);
      });

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Build dynamic filter list from categories API
  const dynamicFilters = [
    { id: 'all', label: t('projects.filters.all') || 'All' },
    ...dbCategories.map(cat => ({
      id: cat.slug,
      label: lang === 'ru' ? cat.name_ru : cat.name_en,
    }))
  ];

  // Fallback to hardcoded if no categories from DB
  const fallbackFilters = [
    { id: 'all', label: t('projects.filters.all') },
    { id: 'management', label: t('projects.filters.management') },
    { id: 'preopening', label: t('projects.filters.preopening') },
    { id: 'consulting', label: t('projects.filters.consulting') },
    { id: 'marketing', label: 'Marketing & Sales' },
  ];

  const filters = dbCategories.length > 0 ? dynamicFilters : fallbackFilters;



  return (
    <main className="projects-page">
      <HeroSection 
        variant="page"
        content={{
          titleLine1: (lang === 'ru' ? dbSettings['projects_hero_title']?.value_ru : dbSettings['projects_hero_title']?.value_en) || t('projects.title'),
          description: (lang === 'ru' ? dbSettings['projects_hero_desc']?.value_ru : dbSettings['projects_hero_desc']?.value_en) || t('projects.desc'),
          images: [(lang === 'ru' ? dbSettings['projects_hero_image']?.value_ru : dbSettings['projects_hero_image']?.value_en) || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'],
          label: t('nav.projects'),
          breadcrumbs: [{ label: t('nav.projects'), path: '/projects' }]
        }}
      />

      {/* 2. DYNAMIC FILTER BAR */}
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
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} lang={lang} />
              ))}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '60px' }}>
              <button 
                className={`adm-btn adm-btn-outline ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                disabled={currentPage === 1}
                style={{ padding: '12px 24px', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Prev
              </button>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`adm-btn ${currentPage === i + 1 ? 'adm-btn-primary' : 'adm-btn-outline'}`}
                    onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                    style={{ 
                      minWidth: '45px', 
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                className={`adm-btn adm-btn-outline ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                disabled={currentPage === totalPages}
                style={{ padding: '12px 24px', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
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
