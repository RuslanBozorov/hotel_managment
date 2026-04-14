import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheckCircle, FaExclamationCircle, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import * as api from '../../../services/api';
import ImageSelector from '../common/ImageSelector';
import ProjectCard from '../../ProjectCard';

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<api.Project[]>([]);
  const [categories, setCategories] = useState<api.Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [currentProject, setCurrentProject] = useState<Partial<api.Project> | null>(null);
  const [newCategory, setNewCategory] = useState({ name_en: '', name_ru: '', slug: '' });
  const [catStatus, setCatStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const token = localStorage.getItem('admin_token') || '';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projData, catData] = await Promise.all([
        api.projectsApi.getAll(token),
        api.categoriesApi.getAll(token),
      ]);
      setProjects(Array.isArray(projData) ? projData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Loyihani uchirasizmi?")) return;
    try {
      await api.projectsApi.delete(id, token);
      fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Ushbu kategoriyani o\'chirasizmi? Unga biriktirilgan loyihalar toifasiz qoladi.')) return;
    try {
      await api.categoriesApi.delete(id, token);
      fetchData();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    try {
      const dataToSave = {
        ...currentProject,
        stars: currentProject.stars || 5,
        category: currentProject.category || 'management',
        category_id: currentProject.category_id || undefined,
        is_featured: currentProject.is_featured || false,
        name: currentProject.name || '',
        city: currentProject.city || '',
        role_en: currentProject.role_en || '',
        role_ru: currentProject.role_ru || ''
      };

      if (currentProject.id) {
        await api.projectsApi.update(currentProject.id, dataToSave, token);
      } else {
        await api.projectsApi.create(dataToSave as any, token);
      }
      
      setStatus({ type: 'success', msg: 'Loyiha muvaffaqiyatli saqlandi!' });
      setTimeout(() => {
        setShowModal(false);
        setStatus(null);
        fetchData();
      }, 1500);
    } catch (error) {
      console.error('Failed to save project:', error);
      setStatus({ type: 'error', msg: 'Failed to save project. Check all fields.' });
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name_en || !newCategory.slug) {
      setCatStatus({ type: 'error', msg: 'Name EN and Slug are required.' });
      return;
    }
    try {
      const created = await api.categoriesApi.create(newCategory, token);
      // Optimistic update: add to local list immediately
      setCategories(prev => [...prev, created]);
      setCatStatus({ type: 'success', msg: `Category "${created.name_en}" created!` });
      setNewCategory({ name_en: '', name_ru: '', slug: '' });
      setTimeout(() => {
        setShowCategoryModal(false);
        setCatStatus(null);
      }, 1200);
    } catch (error: any) {
      setCatStatus({ type: 'error', msg: error.message || 'Failed to create category.' });
    }
  };

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Uzbekistan cities/regions list for dropdown
  const uzbekistanRegions = [
    'Tashkent', 'Samarkand', 'Bukhara', 'Khiva', 'Khorezm',
    'Kashkadarya', 'Surkhandarya', 'Fergana', 'Namangan', 
    'Andijan', 'Jizzakh', 'Sirdarya', 'Navoiy', 'Karakalpakstan',
    'Tashkent Region', 'Fergana Valley', 'Zarafshan'
  ];

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const handleCityFocus = () => {
    setShowCityDropdown(true);
    setCitySearch(currentProject?.city || '');
  };

  const handleCityBlur = () => {
    setTimeout(() => setShowCityDropdown(false), 200);
  };

  const handleCitySelect = (city: string) => {
    setCurrentProject({...currentProject, city});
    setShowCityDropdown(false);
    setCitySearch(city);
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCitySearch(value);
    setCurrentProject({...currentProject, city: value});
    
    const filtered = uzbekistanRegions.filter(region => 
      region.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);
  };



  if (loading) return <div className="adm-loader">Loyihalar yuklanmoqda...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="adm-heading">Loyihalar (Portfolio)</h1>
          <p className="adm-subheading" style={{ marginBottom: 0 }}>Saytdagi barcha loyihalar va ularning kategoriyalarini boshqarish.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="adm-btn adm-btn-outline" onClick={() => { setShowCategoryModal(true); setCatStatus(null); }}>
            <FaTag /> Kategoriyalar ({categories.length})
          </button>
          <button className="adm-btn adm-btn-primary" onClick={() => { setCurrentProject({ stars: 5, category: 'management', is_featured: false }); setShowModal(true); setStatus(null); }}>
            <FaPlus /> Yangi loyiha
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {currentProjects.map((project) => (
          <div key={project.id} className="adm-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px' }}>
            <div style={{ position: 'relative' }}>
              {project.is_featured && (
                <div style={{ 
                  position: 'absolute', top: '-10px', right: '-10px', zIndex: 10,
                  background: 'var(--color-gold)', color: '#111', 
                  padding: '6px 12px', borderRadius: '100px', fontWeight: 'bold', fontSize: '0.65rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  FEATURED
                </div>
              )}
              <div style={{ pointerEvents: 'none' }}>
                <ProjectCard project={project} lang="en" hideFooter={true} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="adm-btn adm-btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }} onClick={() => { setCurrentProject(project); setShowModal(true); setStatus(null); }}>
                <FaEdit /> Tahrirlash
              </button>
              <button className="adm-btn adm-btn-outline" style={{ flex: '0 0 auto', padding: '8px', color: 'var(--adm-error)' }} onClick={() => handleDelete(project.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== PAGINATION CONTROLS ===== */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', 
          marginTop: '40px', padding: '20px', borderTop: '1px solid var(--adm-border)' 
        }}>
          <button 
            className={`adm-btn adm-btn-outline ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ padding: '8px 16px', opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            Oldingi
          </button>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`adm-btn ${currentPage === i + 1 ? 'adm-btn-primary' : 'adm-btn-outline'}`}
                onClick={() => setCurrentPage(i + 1)}
                style={{ 
                  minWidth: '36px', height: '36px', padding: 0, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            className={`adm-btn adm-btn-outline ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '8px 16px', opacity: currentPage === totalPages ? 0.4 : 1 }}
          >
            Next
          </button>
        </div>
      )}

      {/* ===== PROJECT MODAL ===== */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="adm-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="adm-modal-content" 
              style={{ maxWidth: '650px' }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="adm-modal-header">
                <h3>{currentProject?.id ? 'Edit Project' : 'Add New Project'}</h3>
                <button className="adm-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit} className="adm-modal-body">
                {status && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', 
                      borderRadius: '8px', marginBottom: '20px',
                      background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: status.type === 'success' ? '#10b981' : '#ef4444',
                      fontSize: '0.9rem'
                    }}
                  >
                    {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {status.msg}
                  </motion.div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="adm-form-group">
                    <label>Hotel Name</label>
                    <input className="adm-input" value={currentProject?.name || ''} onChange={e => setCurrentProject({...currentProject, name: e.target.value})} placeholder="e.g. Hilton Tashkent" required />
                  </div>
                  <div className="adm-form-group" style={{ position: 'relative' }}>
                    <label>City / Region</label>
                    <input 
                      className="adm-input" 
                      value={citySearch || currentProject?.city || ''} 
                      onFocus={handleCityFocus}
                      onBlur={handleCityBlur}
                      onChange={handleCityInputChange}
                      placeholder="Select or type city..." 
                      required 
                      autoComplete="off"
                    />
                    {showCityDropdown && filteredCities.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'var(--adm-card-bg)',
                        border: '1px solid var(--adm-border)',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        marginTop: '4px'
                      }}>
                        {filteredCities.map((city) => (
                          <div
                            key={city}
                            style={{
                              padding: '10px 14px',
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--adm-border)',
                              fontSize: '0.9rem',
                              background: currentProject?.city === city ? 'var(--adm-sidebar-active-bg)' : 'transparent'
                            }}
                            onMouseDown={() => handleCitySelect(city)}
                          >
                            <FaMapMarkerAlt style={{ marginRight: '8px', color: 'var(--adm-primary)', fontSize: '0.85rem' }} />
                            {city}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="adm-form-group">
                    <label>Role (EN)</label>
                    <input className="adm-input" value={currentProject?.role_en || ''} onChange={e => setCurrentProject({...currentProject, role_en: e.target.value})} placeholder="e.g. Operator" required />
                  </div>
                  <div className="adm-form-group">
                    <label>Role (RU)</label>
                    <input className="adm-input" value={currentProject?.role_ru || ''} onChange={e => setCurrentProject({...currentProject, role_ru: e.target.value})} placeholder="e.g. Оператор" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div className="adm-form-group">
                    <label>Stars</label>
                    <select className="adm-input" value={currentProject?.stars || 5} onChange={e => setCurrentProject({...currentProject, stars: parseInt(e.target.value)})}>
                      {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Stars</option>)}
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label>Category</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select 
                        className="adm-input" 
                        style={{ flex: 1 }}
                        value={currentProject?.category_id || ''} 
                        onChange={e => {
                          const catId = parseInt(e.target.value);
                          const cat = categories.find(c => c.id === catId);
                          setCurrentProject({
                            ...currentProject, 
                            category_id: catId || undefined,
                            category: cat?.slug || currentProject?.category || 'management'
                          });
                        }}
                      >
                        <option value="">-- Select --</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        className="adm-btn adm-btn-outline"
                        style={{ padding: '8px 12px', minWidth: 'auto', fontSize: '1rem' }}
                        onClick={() => { setShowCategoryModal(true); setCatStatus(null); }}
                        title="Add new category"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="adm-form-group">
                     <label>Show on Home?</label>
                     <div style={{ display: 'flex', alignItems: 'center', height: '42px', gap: '10px' }}>
                       <input 
                         type="checkbox" 
                         id="is_featured"
                         checked={currentProject?.is_featured || false} 
                         onChange={e => setCurrentProject({...currentProject, is_featured: e.target.checked})}
                         style={{ width: '18px', height: '18px' }}
                       />
                       <label htmlFor="is_featured" style={{ margin: 0, fontSize: '0.85rem' }}>Featured</label>
                     </div>
                  </div>
                </div>

                <ImageSelector 
                  label="Project Image"
                  category="hotel"
                  value={currentProject?.image_url || ''}
                  onChange={url => setCurrentProject({...currentProject, image_url: url})}
                />

                <div className="adm-modal-footer">
                  <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="adm-btn adm-btn-primary">
                    {currentProject?.id ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CATEGORY MANAGEMENT MODAL ===== */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div 
            className="adm-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="adm-modal-content" 
              style={{ maxWidth: '520px' }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="adm-modal-header">
                <h3><FaTag style={{ marginRight: '8px' }} /> Category Management</h3>
                <button className="adm-modal-close" onClick={() => setShowCategoryModal(false)}><FaTimes /></button>
              </div>
              <div className="adm-modal-body">
                {/* Existing Categories */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: 'var(--adm-text-muted)' }}>
                    Existing Categories ({categories.length})
                  </h4>
                  {categories.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)' }}>No categories yet. Create your first one below.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <AnimatePresence>
                        {categories.map(cat => (
                          <motion.div 
                            key={cat.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ 
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '10px 14px', background: 'var(--adm-bg)', borderRadius: '8px',
                              border: '1px solid var(--adm-border)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <FaTag style={{ color: 'var(--adm-primary)', fontSize: '0.8rem' }} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name_en}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                                  {cat.name_ru} • <code style={{ fontSize: '0.7rem' }}>{cat.slug}</code>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px',
                                background: 'rgba(99, 102, 241, 0.1)', color: 'var(--adm-primary)'
                              }}>
                                {projects.filter(p => p.category_id === cat.id).length} projects
                              </span>
                              <button 
                                className="adm-btn-icon" 
                                style={{ color: 'var(--adm-error)', fontSize: '0.8rem' }}
                                onClick={() => handleDeleteCategory(cat.id)}
                                title="Delete category"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Add New Category Form */}
                <div style={{ 
                  padding: '20px', background: 'var(--adm-bg)', borderRadius: '12px',
                  border: '1px dashed var(--adm-border)'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaPlus style={{ fontSize: '0.75rem' }} /> Add New Category
                  </h4>
                  
                  {catStatus && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', 
                        borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem',
                        background: catStatus.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: catStatus.type === 'success' ? '#10b981' : '#ef4444',
                      }}
                    >
                      {catStatus.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                      {catStatus.msg}
                    </motion.div>
                  )}

                  <form onSubmit={handleCreateCategory}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label className="stat-label">Name (EN) *</label>
                        <input 
                          className="adm-input" 
                          placeholder="e.g. Management" 
                          value={newCategory.name_en}
                          onChange={e => {
                            const val = e.target.value;
                            setNewCategory({ ...newCategory, name_en: val, slug: autoSlug(val) });
                          }}
                          required 
                        />
                      </div>
                      <div>
                        <label className="stat-label">Name (RU)</label>
                        <input 
                          className="adm-input" 
                          placeholder="e.g. Управление" 
                          value={newCategory.name_ru}
                          onChange={e => setNewCategory({ ...newCategory, name_ru: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="stat-label">Slug (auto-generated)</label>
                      <input 
                        className="adm-input" 
                        placeholder="e.g. management" 
                        value={newCategory.slug}
                        onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })}
                        required
                        style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                      />
                    </div>
                    <button type="submit" className="adm-btn adm-btn-primary" style={{ width: '100%' }}>
                      <FaPlus /> Create Category
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManager;
