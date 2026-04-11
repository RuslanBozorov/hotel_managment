import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowRight, FaTag } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import { useI18n } from '../i18n';
import { useState, useEffect } from 'react';
import * as api from '../services/api';
import './Blog.css';

export default function Blog() {
  const { t, lang } = useI18n();
  const [dbPosts, setDbPosts] = useState<api.Blog[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.blogsApi.getAll("");
        setDbPosts(data);
      } catch (err) { console.error(err); }
    };
    fetchPosts();
  }, []);

  const posts: any[] = [
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

  return (
    <main>
      <section className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4)' }}>
        <div className="page-hero__overlay" />
        <div className="container page-hero__content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="page-hero__label">{t('nav.blog')}</span>
            <h1 className="page-hero__title">{t('blog.title')}</h1>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {(dbPosts.length > 0 ? dbPosts : posts).map((post: any, i) => (
              <ScrollReveal key={post.id || i} delay={i * 0.1}>
                <article className="blog-card">
                  <div className="blog-card__image img-placeholder">
                    {post.image_url ? (
                      <img src={post.image_url} alt={post.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FaTag />
                    )}
                  </div>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span className="blog-card__category">{post.category}</span>
                      <span className="blog-card__date"><FaCalendarAlt /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : post.date}</span>
                    </div>
                    <h3 className="blog-card__title">{lang === 'ru' ? (post.title_ru || post.titleRu) : (post.title_en || post.title)}</h3>
                    <p className="blog-card__excerpt">{lang === 'ru' ? (post.content_ru?.slice(0, 100) || post.excerptRu) : (post.content_en?.slice(0, 100) || post.excerpt)}...</p>
                    <div className="blog-card__footer">
                      <span className="blog-card__author"><FaUser /> {post.author || 'Admin'}</span>
                      <span className="blog-card__read-more">{t('blog.read')} <FaArrowRight /></span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
