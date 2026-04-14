import React, { useState, useEffect, useMemo } from 'react';
import { FaSave, FaImage, FaFont, FaDesktop, FaMobileAlt, FaLightbulb } from 'react-icons/fa';
import toast from 'react-hot-toast';
import * as api from '../../../services/api';
import HeroSection from '../../common/HeroSection';
import type { HeroContent } from '../../common/HeroSection';
import ImageSelector from '../common/ImageSelector';
import { useI18n } from '../../../i18n';
import './HeroManager.css';

const HeroManager: React.FC = () => {
  const { t, lang: currentLang } = useI18n();
  const [draft, setDraft] = useState<Record<string, { en: string; ru: string }>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'projects' | 'blog' | 'contact'>('home');

  const token = localStorage.getItem('admin_token') || '';

  const fetchData = async () => {
    try {
      setLoading(true);
      const settingsData = await api.settingsApi.getAll(token);
      const draftMap: Record<string, { en: string; ru: string }> = {};

      settingsData.forEach((s) => {
        draftMap[s.key] = { en: s.value_en, ru: s.value_ru };
      });

      setDraft(draftMap);
    } catch (e) {
      toast.error('Failed to load hero settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTextChange = (key: string, lang: 'en' | 'ru', value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { en: '', ru: '' }), [lang]: value },
    }));
  };

  const handleImageChange = (key: string, url: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: { en: url, ru: url },
    }));
  };

  const saveAll = async () => {
    setIsSaving(true);
    const settingsToUpdate: api.Setting[] = Object.keys(draft).map((key) => ({
      key,
      value_en: draft[key].en,
      value_ru: draft[key].ru,
    }));

    try {
      await api.settingsApi.bulkUpdate(settingsToUpdate, token);
      toast.success('All hero settings updated successfully!');
      fetchData();
    } catch (e) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const previewContent: HeroContent = useMemo(() => {
    const lang = 'en';
    switch (activeTab) {
      case 'home':
        return {
          label: draft['hero_label']?.[lang] || 'Welcome',
          titleLine1: draft['hero_title_l1']?.[lang] || 'Premium Hospitality',
          titleLine2: draft['hero_title_l2']?.[lang] || 'Management Solutions',
          description: draft['hero_desc']?.[lang] || 'Professional hotel management and consulting services.',
          images: [draft['hero_image_1']?.en, draft['hero_image_2']?.en].filter(Boolean) as string[],
        };
      case 'about':
        return {
          label: 'About Us',
          titleLine1: draft['about_hero_title']?.[lang] || 'About Our Company',
          description: draft['about_main_desc']?.[lang] || 'We provide exceptional management services for the hospitality industry.',
          images: [draft['about_hero_image']?.en].filter(Boolean) as string[],
          breadcrumbs: [{ label: 'About', path: '/about' }],
        };
      case 'services':
        return {
          label: 'Our Services',
          titleLine1: draft['services_hero_title']?.[lang] || 'Our Expert Services',
          description: draft['services_hero_desc']?.[lang] || 'Explore our wide range of hospitality solutions tailored to your needs.',
          images: [draft['services_hero_image']?.en].filter(Boolean) as string[],
          breadcrumbs: [{ label: 'Services', path: '/services' }],
        };
      case 'projects':
        return {
          label: 'Our Projects',
          titleLine1: draft['projects_hero_title']?.[lang] || 'Our Portfolio',
          description: draft['projects_hero_desc']?.[lang] || 'A showcase of our successful management and consulting projects.',
          images: [draft['projects_hero_image']?.en].filter(Boolean) as string[],
          breadcrumbs: [{ label: 'Projects', path: '/projects' }],
        };
      case 'blog':
        return {
          label: 'Blog',
          titleLine1: draft['blog_hero_title']?.[lang] || 'Industry Insights',
          description: draft['blog_hero_desc']?.[lang] || 'Stay updated with the latest trends and news in hotel management.',
          images: [draft['blog_hero_image']?.en].filter(Boolean) as string[],
          breadcrumbs: [{ label: 'Blog', path: '/blog' }],
        };
      case 'contact':
        return {
          label: 'Contact',
          titleLine1: draft['contact_hero_title']?.[lang] || 'Get In Touch',
          description: draft['contact_hero_desc']?.[lang] || 'Have questions? Our experts are here to help you grow your business.',
          images: [draft['contact_hero_image']?.en].filter(Boolean) as string[],
          breadcrumbs: [{ label: 'Contact', path: '/contact' }],
        };
      default:
        return { label: '', titleLine1: '', description: '', images: [] };
    }
  }, [draft, activeTab]);

  if (loading) return <div className="adm-loader">{t('admin.common.loading')}</div>;

  const PageTab = ({ id, label }: { id: typeof activeTab; label: string }) => (
    <button
      className={`adm-btn ${activeTab === id ? 'adm-btn-primary' : 'adm-btn-outline'}`}
      onClick={() => setActiveTab(id)}
      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
    >
      {label}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="adm-header-action">
        <div>
          <h1 className="adm-heading">{t('admin.sidebar.hero')}</h1>
          <p className="adm-subheading">
            {currentLang === 'uz' ? 'Sayt sahifalarining banner va hero qismlarini boshqaring.' : 
             currentLang === 'ru' ? 'Управляйте баннерами и hero-секциями страниц сайта.' : 
             'Manage banners and hero sections of site pages.'}
          </p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={saveAll} disabled={isSaving} style={{ padding: '16px 40px', fontSize: '1rem' ,marginBottom:"10px"}}>
          {isSaving ? t('admin.common.loading') : <><FaSave /> {t('admin.common.save')}</>}
        </button>
      </div>

      <div className="adm-help-banner">
        <div className="adm-help-icon"><FaLightbulb /></div>
        <div className="adm-help-content">
          <h4>{t('admin.dashboard.help_title')}</h4>
          <p>
            {currentLang === 'uz' ? 'Pastdagi bo\'limlardan birini tanlang. Chap tomonda matnlarni o\'zgartiring, o\'ng tomonda esa natijani darhol ko\'rasiz. Tugatgandan so\'ng "Saqlash" tugmasini bosing.' :
             currentLang === 'ru' ? 'Выберите один из разделов ниже. Измените текст слева, и вы сразу увидите результат справа. По завершении нажмите кнопку "Сохранить".' :
             'Select one of the sections below. Change the text on the left, and you will see the result on the right immediately. When finished, click the "Save" button.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <PageTab id="home" label={t('nav.home')} />
        <PageTab id="about" label={t('nav.about')} />
        <PageTab id="services" label={t('nav.services')} />
        <PageTab id="projects" label={t('nav.projects')} />
        <PageTab id="blog" label={t('nav.blog')} />
        <PageTab id="contact" label={t('nav.contact')} />
      </div>

      <div className="hero-manager-container">
        <div className="hero-controls">
          {/* Dynamic Controls based on selected tab */}
          <div className="field-section">
            <h3><FaFont /> {currentLang === 'uz' ? 'MATN VA MAZMUN' : currentLang === 'ru' ? 'ТЕКСТ И СОДЕРЖАНИЕ' : 'TEXT & CONTENT'}</h3>
            <div className="control-fields">
              
              {activeTab === 'home' && (
                <div className="form-group">
                  <label className="form-label">Hero Badge / Label</label>
                  <div className="lang-grid">
                    <input className="form-input" value={draft['hero_label']?.en || ''} onChange={(e) => handleTextChange('hero_label', 'en', e.target.value)} placeholder="English" />
                    <input className="form-input" value={draft['hero_label']?.ru || ''} onChange={(e) => handleTextChange('hero_label', 'ru', e.target.value)} placeholder="Russian" />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Main Title</label>
                <div className="lang-grid">
                  <input 
                    className="form-input" 
                    value={draft[activeTab === 'home' ? 'hero_title_l1' : `${activeTab}_hero_title`]?.en || ''} 
                    onChange={(e) => handleTextChange(activeTab === 'home' ? 'hero_title_l1' : `${activeTab}_hero_title`, 'en', e.target.value)} 
                    placeholder="English" 
                  />
                  <input 
                    className="form-input" 
                    value={draft[activeTab === 'home' ? 'hero_title_l1' : `${activeTab}_hero_title`]?.ru || ''} 
                    onChange={(e) => handleTextChange(activeTab === 'home' ? 'hero_title_l1' : `${activeTab}_hero_title`, 'ru', e.target.value)} 
                    placeholder="Russian" 
                  />
                </div>
              </div>

              {activeTab === 'home' && (
                <div className="form-group">
                  <label className="form-label">Title Highlighting (Gold Text)</label>
                  <div className="lang-grid">
                    <input className="form-input" value={draft['hero_title_l2']?.en || ''} onChange={(e) => handleTextChange('hero_title_l2', 'en', e.target.value)} placeholder="English" />
                    <input className="form-input" value={draft['hero_title_l2']?.ru || ''} onChange={(e) => handleTextChange('hero_title_l2', 'ru', e.target.value)} placeholder="Russian" />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Hero Description</label>
                <div className="lang-grid">
                  <textarea 
                    className="form-textarea" 
                    value={draft[activeTab === 'home' ? 'hero_desc' : (activeTab === 'about' ? 'about_main_desc' : `${activeTab}_hero_desc`)]?.en || ''} 
                    onChange={(e) => handleTextChange(activeTab === 'home' ? 'hero_desc' : (activeTab === 'about' ? 'about_main_desc' : `${activeTab}_hero_desc`), 'en', e.target.value)} 
                    placeholder="English" 
                    rows={3} 
                  />
                  <textarea 
                    className="form-textarea" 
                    value={draft[activeTab === 'home' ? 'hero_desc' : (activeTab === 'about' ? 'about_main_desc' : `${activeTab}_hero_desc`)]?.ru || ''} 
                    onChange={(e) => handleTextChange(activeTab === 'home' ? 'hero_desc' : (activeTab === 'about' ? 'about_main_desc' : `${activeTab}_hero_desc`), 'ru', e.target.value)} 
                    placeholder="Russian" 
                    rows={3} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field-section">
            <h3><FaImage /> {t('admin.dashboard.quickActions.slider')}</h3>
            <div className="control-fields" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
              {activeTab === 'home' ? (
                <>
                  <ImageSelector label="Slayder 1" category="hotel" value={draft['hero_image_1']?.en || ''} onChange={(url) => handleImageChange('hero_image_1', url)} />
                  <ImageSelector label="Slayder 2" category="hotel" value={draft['hero_image_2']?.en || ''} onChange={(url) => handleImageChange('hero_image_2', url)} />
                </>
              ) : (
                <div>
                  <ImageSelector label={`${activeTab.toUpperCase()} Hero Background`} category="hotel" value={draft[`${activeTab}_hero_image`]?.en || ''} onChange={(url) => handleImageChange(`${activeTab}_hero_image`, url)} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hero-preview-sticky">
           <div className="preview-header">
            <div>
              <span className="preview-badge">{activeTab.toUpperCase()} PREVIEW</span>
              <span style={{ marginLeft: '12px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{previewDevice.toUpperCase()} VIEW</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPreviewDevice('desktop')} className={`adm-btn adm-btn-sm ${previewDevice === 'desktop' ? 'adm-btn-primary' : ''}`} title="Desktop Preview"><FaDesktop /></button>
              <button onClick={() => setPreviewDevice('mobile')} className={`adm-btn adm-btn-sm ${previewDevice === 'mobile' ? 'adm-btn-primary' : ''}`} title="Mobile Preview"><FaMobileAlt /></button>
            </div>
          </div>

          <div className="preview-window-container">
            {previewDevice === 'mobile' ? (
               <div className="iphone-frame">
                 <div className="iphone-notch" />
                 <div className="iphone-screen">
                    <HeroSection content={previewContent} variant={activeTab === 'home' ? 'home' : 'page'} />
                 </div>
               </div>
            ) : (
               <div className="macbook-frame">
                 <div className="macbook-topbar">
                    <div className="macbook-dot dot-red" />
                    <div className="macbook-dot dot-yellow" />
                    <div className="macbook-dot dot-green" />
                 </div>
                 <div className="macbook-screen">
                    <HeroSection content={previewContent} variant={activeTab === 'home' ? 'home' : 'page'} />
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroManager;
