import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaTimes, FaEdit } from 'react-icons/fa';
import * as api from '../../../services/api';
import ImageSelector from '../common/ImageSelector';

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<api.Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<api.Blog> | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const token = localStorage.getItem('admin_token') || '';

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.blogsApi.getAll(token);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await api.blogsApi.delete(id, token);
      fetchPosts();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;

    // Ensure all required fields are present to avoid 422 error
    const dataToSave = {
      title_en: currentPost.title_en || '',
      title_ru: currentPost.title_ru || '',
      content_en: currentPost.content_en || '',
      content_ru: currentPost.content_ru || currentPost.content_en || '', // Fallback to EN if RU is missing
      category: currentPost.category || 'News',
      author: currentPost.author || 'Admin',
      image_url: currentPost.image_url || ''
    };

    try {
      if (currentPost.id) {
        await api.blogsApi.update(currentPost.id, dataToSave, token);
        setStatus({ type: 'success', msg: 'Article updated!' });
      } else {
        await api.blogsApi.create(dataToSave as any, token);
        setStatus({ type: 'success', msg: 'Article published!' });
      }
      setTimeout(() => {
        setShowModal(false);
        setStatus(null);
        fetchPosts();
      }, 1500);
    } catch (error: any) {
      console.error('Save failed:', error);
      setStatus({ type: 'error', msg: 'Failed to save. Please check all fields.' });
    }
  };

  if (loading) return <div className="adm-loader">Loading Articles...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="adm-heading">Blog Posts</h1>
          <p className="adm-subheading" style={{ marginBottom: 0 }}>Create and manage your articles and news.</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => { setCurrentPost({}); setShowModal(true); setStatus(null); }}>
          <FaPlus /> New Article
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-table-wrapper">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 600 }}>{post.title_en}</td>
                  <td>{post.category}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="adm-btn-icon" onClick={() => { setCurrentPost(post); setShowModal(true); setStatus(null); }} style={{ color: 'var(--adm-primary)' }}>
                        <FaEdit />
                      </button>
                      <button className="adm-btn-icon" onClick={() => handleDelete(post.id)} style={{ color: 'var(--adm-error)' }}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-content" style={{ maxWidth: '700px' }}>
            <div className="adm-modal-header">
              <h3>New Article</h3>
              <button className="adm-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="adm-modal-body">
              {status && (
                <div style={{ 
                  padding: '12px', borderRadius: '8px', marginBottom: '20px',
                  background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: status.type === 'success' ? '#10b981' : '#ef4444',
                  fontSize: '0.9rem', textAlign: 'center'
                }}>
                  {status.msg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="adm-form-group">
                  <label>Title (EN)</label>
                  <input className="adm-input" value={currentPost?.title_en || ''} onChange={e => setCurrentPost({...currentPost, title_en: e.target.value})} required />
                </div>
                <div className="adm-form-group">
                  <label>Title (RU)</label>
                  <input className="adm-input" value={currentPost?.title_ru || ''} onChange={e => setCurrentPost({...currentPost, title_ru: e.target.value})} required />
                </div>
              </div>

              <div className="adm-form-group">
                <label>Category</label>
                <select 
                  className="adm-input" 
                  value={currentPost?.category || ''} 
                  onChange={e => setCurrentPost({...currentPost, category: e.target.value})} 
                  required
                >
                  <option value="">Select Category...</option>
                  <option value="Industry">Industry</option>
                  <option value="Management">Management</option>
                  <option value="Franchise">Franchise</option>
                  <option value="News">News</option>
                  <option value="Strategy">Strategy</option>
                </select>
              </div>

              <div className="adm-form-group">
                <label>Author</label>
                <input className="adm-input" value={currentPost?.author || ''} onChange={e => setCurrentPost({...currentPost, author: e.target.value})} placeholder="e.g. Admin, John Doe" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="adm-form-group">
                  <label>Content (EN)</label>
                  <textarea className="adm-input" rows={6} value={currentPost?.content_en || ''} onChange={e => setCurrentPost({...currentPost, content_en: e.target.value})} required />
                </div>
                <div className="adm-form-group">
                  <label>Content (RU)</label>
                  <textarea className="adm-input" rows={6} value={currentPost?.content_ru || ''} onChange={e => setCurrentPost({...currentPost, content_ru: e.target.value})} required />
                </div>
              </div>

              <ImageSelector 
                label="Article Image"
                category="blog"
                value={currentPost?.image_url || ''} 
                onChange={url => setCurrentPost({...currentPost, image_url: url})}
              />
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">
                  {currentPost?.id ? 'Save Changes' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
