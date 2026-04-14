import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useI18n } from '../i18n';
import { useState, useEffect } from 'react';
import * as api from '../services/api';
import './Blog.css';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useI18n();
  const [post, setPost] = useState<api.Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const blogs = await api.blogsApi.getAll("");
        const found = blogs.find(b => b.id === Number(id));
        setPost(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="loader-full">Loading...</div>;
  if (!post) return (
    <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
      <h2>Post not found</h2>
      <Link to="/blog" className="btn btn--primary" style={{ marginTop: '20px' }}>Back to Blog</Link>
    </div>
  );

  const formatContent = (text?: string) => {
    if (!text) return null;
    
    // Fallback if the content genuinely contains HTML tags (e.g. from a future WYSIWYG editor)
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    // Otherwise treat as plain text: split by double newlines into paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((para, index) => (
      <p key={index}>
        {para.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i !== para.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
  };

  return (
    <main>
      <section className="blog-detail-hero" style={{ 
        backgroundImage: `url(${post.image_url || 'https://images.unsplash.com/photo-1517840901100-8179e982ad41'})`,
        height: '60vh',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="page-hero__overlay" style={{ background: 'rgba(0,0,0,0.6)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="blog-card__category" style={{ background: 'var(--color-gold)', color: 'white', padding: '5px 15px', borderRadius: '20px', marginBottom: '20px', display: 'inline-block' }}>
              {post.category}
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em' }}>
              {lang === 'ru' ? post.title_ru : post.title_en}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.9rem', opacity: 0.9, fontWeight: 500 }}>
              <span><FaCalendarAlt /> {new Date(post.created_at).toLocaleDateString()}</span>
              <span><FaUser /> {post.author || 'Admin'}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link to="/blog" className="btn-back" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: 'var(--color-gold)', fontWeight: 600 }}>
            <FaArrowLeft /> Back to Articles
          </Link>
          
          <article className="blog-content">
            {formatContent(lang === 'ru' ? post.content_ru : post.content_en)}
          </article>
          
          <div className="blog-footer-tags" style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontWeight: 700 }}>Category:</span>
              <span style={{ color: 'var(--primary-color)' }}>{post.category}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
