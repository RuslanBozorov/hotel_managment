import { FaCalendarAlt, FaUser, FaArrowRight, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HeroSection from '../components/common/HeroSection';
import ScrollReveal from '../components/ScrollReveal';
import { useI18n } from '../i18n';
import { useState, useEffect } from 'react';
import * as api from '../services/api';
import './Blog.css';

export default function Blog() {
  const { t, lang } = useI18n();
  const [dbPosts, setDbPosts] = useState<api.Blog[]>([]);
  const [dbSettings, setDbSettings] = useState<Record<string, api.Setting>>({});
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postsData, settingsData] = await Promise.all([
          api.blogsApi.getAll(""),
          api.settingsApi.getAll("")
        ]);
        setDbPosts(postsData);
        const sMap: Record<string, api.Setting> = {};
        if (Array.isArray(settingsData)) {
          settingsData.forEach(s => sMap[s.key] = s);
        }
        setDbSettings(sMap);
      } catch (err) { console.error(err); }
    };
    fetchPosts();
  }, []);

  const fallbackPosts: any[] = [
    {
      id: 1,
      title: 'The Future of Hospitality in Uzbekistan 2025',
      titleRu: 'Будущее гостеприимства в Узбекистане 2025',
      category: 'Industry', author: 'Alexandr Volkov', date: 'March 15, 2025',
      excerpt: 'Exploring the rapid growth of tourism and the digitalization of boutique hotels across the region...',
      excerptRu: 'Исследование быстрого роста туризма и цифровизации бутик-отелей по всему региону...',
      image_url: 'https://images.unsplash.com/photo-1517840901100-8179e982ad41'
    },
    {
      id: 2,
      title: 'Maximizing Hotel Revenue During Off-Season',
      titleRu: 'Максимизация доходов отеля в низкий сезон',
      category: 'Management', author: 'Elena Petrova', date: 'February 28, 2025',
      excerpt: 'Practical strategies for revenue management, packages, and local marketing to bridge the gap...',
      excerptRu: 'Практические стратегии управления доходами, пакеты и местный маркетинг для преодоления разрыва...',
      image_url: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a'
    },
    {
      id: 3,
      title: 'International Franchise in Uzbekistan: Complete Guide',
      titleRu: 'Международная франшиза в Узбекистане: Полное руководство',
      category: 'Franchise', author: 'Admin', date: 'February 10, 2025',
      excerpt: 'Everything you need to know about bringing a global brand to your local property...',
      excerptRu: 'Все, что вам нужно знать о привлечении мирового бренда в ваш локальный объект...',
      image_url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c'
    }
  ];

  const displayPosts = dbPosts.length > 0 ? dbPosts : fallbackPosts;
  
  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = displayPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(displayPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <main>
      <HeroSection 
        variant="page"
        content={{
          titleLine1: (lang === 'ru' ? dbSettings['blog_hero_title']?.value_ru : dbSettings['blog_hero_title']?.value_en) || t('blog.title'),
          description: (lang === 'ru' ? dbSettings['blog_hero_desc']?.value_ru : dbSettings['blog_hero_desc']?.value_en) || '',
          images: [(lang === 'ru' ? dbSettings['blog_hero_image']?.value_ru : dbSettings['blog_hero_image']?.value_en) || 'https://plus.unsplash.com/premium_photo-1774104900417-a83ed915ed1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmxvZ3xlbnwwfHwyfHx8MA%3D%3D'],
          label: t('nav.blog'),
          breadcrumbs: [{ label: t('nav.blog'), path: '/blog' }]
        }}
      />

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {currentPosts.map((post: any, i) => {
              const linkUrl = post.id ? `/blog/${post.id}` : '/blog';
              return (
                <ScrollReveal key={post.id || i} delay={i * 0.1}>
                  <Link to={linkUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article className="blog-card card-flex-col">
                      <div className="blog-card__image img-placeholder">
                        {post.image_url ? (
                          <img src={post.image_url} alt={post.title_en} className="card-img-resilient" />
                        ) : (
                          <div className="card-img-resilient flex-center"><FaTag /></div>
                        )}
                      </div>
                      <div className="blog-card__body card-flex-col" style={{ flex: 1 }}>
                        <div className="blog-card__meta">
                          <span className="blog-card__category">{post.category}</span>
                          <span className="blog-card__date"><FaCalendarAlt /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : post.date}</span>
                        </div>
                        <h3 className="blog-card__title text-clamp-2">{lang === 'ru' ? (post.title_ru || post.titleRu) : (post.title_en || post.title)}</h3>
                        <p className="blog-card__excerpt text-clamp-3">{lang === 'ru' ? (post.content_ru?.slice(0, 150) || post.excerptRu) : (post.content_en?.slice(0, 150) || post.excerpt)}...</p>
                        <div className="blog-card__footer" style={{ marginTop: 'auto' }}>
                          <span className="blog-card__author"><FaUser /> {post.author || 'Admin'}</span>
                          <span className="blog-card__read-more">{t('blog.read')} <FaArrowRight /></span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '60px' }}>
              <button 
                className={`btn btn--outline ${currentPage === 1 ? 'disabled' : ''}`}
                style={{ padding: '8px 16px', minWidth: 'auto' }}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn ${currentPage === i + 1 ? 'btn--primary' : 'btn--outline'}`}
                  style={{ width: '40px', height: '40px', padding: 0, minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                className={`btn btn--outline ${currentPage === totalPages ? 'disabled' : ''}`}
                style={{ padding: '8px 16px', minWidth: 'auto' }}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
