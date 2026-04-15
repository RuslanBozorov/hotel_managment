import React, { useState, useEffect } from 'react';
import { FaSave, FaDatabase, FaLayerGroup, FaCheckDouble, FaPlayCircle } from 'react-icons/fa';
import * as api from '../../../services/api';
import { useAdminToast } from '../context/AdminToastContext';
import ImageSelector from '../common/ImageSelector';


const HomeManager: React.FC = () => {
  const [settings, setSettings] = useState<api.Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();
  const token = localStorage.getItem('admin_token') || '';

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.settingsApi.getAll(token);
      setSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const [localSettings, setLocalSettings] = useState<Record<string, { en: string, ru: string }>>({});

  useEffect(() => {
    const initialLocal: Record<string, { en: string, ru: string }> = {};
    settings.forEach((s: api.Setting) => {
      initialLocal[s.key] = { en: s.value_en, ru: s.value_ru };
    });
    setLocalSettings(initialLocal);
  }, [settings]);

  const handleChange = (key: string, lang: 'en' | 'ru', value: string) => {
    setLocalSettings(prev => {
      const current = prev[key] || { en: '', ru: '' };
      return {
        ...prev,
        [key]: { ...current, [lang]: value }
      };
    });
  };

  const handleUpdate = async (key: string) => {
    const val = localSettings[key];
    if (!val) return;
    try {
      await api.settingsApi.update({ key, value_en: val.en, value_ru: val.ru }, token);
    } catch (error) {
      console.error(`Update failed for ${key}:`, error);
    }
  };

  const handleUpdateGroup = async (keys: string[], groupName: string) => {
    try {
      await Promise.all(keys.map(handleUpdate));
      showToast(`${groupName} updated successfully!`);
      fetchSettings();
    } catch (error) {
      showToast(`${groupName} update failed.`, 'error');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('This will seed the database with demo data. Continue?')) return;
    try {
      setLoading(true);
      await api.systemApi.seedDemo();
      showToast('Demo data seeded successfully!');
      fetchSettings();
    } catch (error) {
      showToast('Seeding failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="adm-loader">Asosiy sahifa sozlamalari yuklanmoqda...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="adm-heading">Asosiy sahifani boshqarish</h1>
          <p className="adm-subheading">Saytning asosiy sahifa bo'limlarini tahrirlash.</p>
        </div>
        <button className="adm-btn adm-btn-outline" onClick={handleSeed} style={{ color: 'var(--adm-primary)' }}>
          <FaDatabase /> Demo ma'lumot yuklash
        </button>
      </div>

      <div style={{ display: 'grid', gap: '40px' }}>
        {/* 2. About Company - Home Introduction */}
        <div className="adm-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <FaLayerGroup style={{ color: 'var(--adm-primary)', fontSize: '1.2rem'}} />
                <h3 style={{ fontWeight: 600, margin: 0 }}>Kompaniya haqida qisqacha (About)</h3>
            </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="stat-label">Label EN</label>
                  <input className="adm-input" value={localSettings['home_about_label']?.en || ''} onChange={e => handleChange('home_about_label', 'en', e.target.value)} />
                </div>
                <div>
                  <label className="stat-label">Label RU</label>
                  <input className="adm-input" value={localSettings['home_about_label']?.ru || ''} onChange={e => handleChange('home_about_label', 'ru', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="stat-label">Heading EN</label>
                <input className="adm-input" value={localSettings['home_about_title']?.en || ''} onChange={e => handleChange('home_about_title', 'en', e.target.value)} />
              </div>
              <div>
                <label className="stat-label">Heading RU</label>
                <input className="adm-input" value={localSettings['home_about_title']?.ru || ''} onChange={e => handleChange('home_about_title', 'ru', e.target.value)} />
              </div>
              <div>
                <label className="stat-label">Intro Paragraph EN</label>
                <textarea className="adm-input" rows={3} value={localSettings['home_about_p1']?.en || ''} onChange={e => handleChange('home_about_p1', 'en', e.target.value)} />
              </div>
              <div>
                <label className="stat-label">Intro Paragraph RU</label>
                <textarea className="adm-input" rows={3} value={localSettings['home_about_p1']?.ru || ''} onChange={e => handleChange('home_about_p1', 'ru', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ImageSelector label="Intro Image" category="hotel" value={localSettings['home_about_image']?.en || ''} onChange={url => handleChange('home_about_image', 'en', url)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="stat-label">Badge Text EN</label>
                  <input className="adm-input" value={localSettings['home_about_badge']?.en || ''} onChange={e => handleChange('home_about_badge', 'en', e.target.value)} />
                </div>
                <div>
                  <label className="stat-label">Badge Text RU</label>
                  <input className="adm-input" value={localSettings['home_about_badge']?.ru || ''} onChange={e => handleChange('home_about_badge', 'ru', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', background: 'var(--adm-bg)', padding: '24px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCheckDouble /> Asosiy xususiyatlar
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="adm-card shadow-none" style={{ background: 'var(--adm-card-bg)', padding: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '12px', color: 'var(--adm-primary)' }}>Feature {i}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input placeholder="Title EN" className="adm-input" value={localSettings[`home_about_v${i}_t`]?.en || ''} onChange={e => handleChange(`home_about_v${i}_t`, 'en', e.target.value)} />
                    <input placeholder="Title RU" className="adm-input" value={localSettings[`home_about_v${i}_t`]?.ru || ''} onChange={e => handleChange(`home_about_v${i}_t`, 'ru', e.target.value)} />
                    <textarea placeholder="Desc EN" rows={2} className="adm-input" value={localSettings[`home_about_v${i}_d`]?.en || ''} onChange={e => handleChange(`home_about_v${i}_d`, 'en', e.target.value)} />
                    <textarea placeholder="Desc RU" rows={2} className="adm-input" value={localSettings[`home_about_v${i}_d`]?.ru || ''} onChange={e => handleChange(`home_about_v${i}_d`, 'ru', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="adm-btn adm-btn-primary" 
              onClick={() => handleUpdateGroup([
                'home_about_label', 'home_about_title', 'home_about_p1', 
                'home_about_image', 'home_about_badge',
                'home_about_v1_t', 'home_about_v1_d',
                'home_about_v2_t', 'home_about_v2_d',
                'home_about_v3_t', 'home_about_v3_d'
              ], 'About qismi')}>
              <FaSave /> O'zgarishlarni saqlash
            </button>
          </div>
        </div>

        {/* 3. Why Us Section */}
        <div className="adm-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <FaLayerGroup style={{ color: 'var(--adm-primary)', fontSize: '1.2rem'}} />
                <h3 style={{ fontWeight: 600, margin: 0 }}>"Nima uchun biz?" bo'limi (Afzalliklar)</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label className="stat-label">Label EN</label>
                            <input className="adm-input" value={localSettings['home_why_label']?.en || ''} onChange={e => handleChange('home_why_label', 'en', e.target.value)} />
                        </div>
                        <div>
                            <label className="stat-label">Label RU</label>
                            <input className="adm-input" value={localSettings['home_why_label']?.ru || ''} onChange={e => handleChange('home_why_label', 'ru', e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label className="stat-label">Title EN</label>
                            <input className="adm-input" value={localSettings['home_why_title']?.en || ''} onChange={e => handleChange('home_why_title', 'en', e.target.value)} />
                        </div>
                        <div>
                            <label className="stat-label">Title RU</label>
                            <input className="adm-input" value={localSettings['home_why_title']?.ru || ''} onChange={e => handleChange('home_why_title', 'ru', e.target.value)} />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ImageSelector label="Visual Image" category="hotel" value={localSettings['home_why_image']?.en || ''} onChange={url => handleChange('home_why_image', 'en', url)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label className="stat-label">Floating Badge EN</label>
                            <input className="adm-input" value={localSettings['home_why_badge']?.en || ''} onChange={e => handleChange('home_why_badge', 'en', e.target.value)} />
                        </div>
                        <div>
                            <label className="stat-label">Floating Badge RU</label>
                            <input className="adm-input" value={localSettings['home_why_badge']?.ru || ''} onChange={e => handleChange('home_why_badge', 'ru', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="adm-card shadow-none" style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '12px' }}>Advantage {i}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                            <input placeholder="Title EN" className="adm-input" value={localSettings[`home_why_a${i}_t`]?.en || ''} onChange={e => handleChange(`home_why_a${i}_t`, 'en', e.target.value)} />
                            <input placeholder="Title RU" className="adm-input" value={localSettings[`home_why_a${i}_t`]?.ru || ''} onChange={e => handleChange(`home_why_a${i}_t`, 'ru', e.target.value)} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <textarea placeholder="Desc EN" rows={2} className="adm-input" value={localSettings[`home_why_a${i}_d`]?.en || ''} onChange={e => handleChange(`home_why_a${i}_d`, 'en', e.target.value)} />
                            <textarea placeholder="Desc RU" rows={2} className="adm-input" value={localSettings[`home_why_a${i}_d`]?.ru || ''} onChange={e => handleChange(`home_why_a${i}_d`, 'ru', e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn-primary" 
                    onClick={() => {
                        const keys = [
                            'home_why_label', 'home_why_title', 'home_why_image', 'home_why_badge',
                            ...[1,2,3,4,5,6].flatMap(i => [`home_why_a${i}_t`, `home_why_a${i}_d`])
                        ];
                        handleUpdateGroup(keys, 'Why Us Section');
                    }}
                >
                    <FaSave /> Afzalliklarni saqlash
                </button>
            </div>
        </div>

        {/* 4. Media Section */}
        <div className="adm-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <FaPlayCircle style={{ color: 'var(--adm-primary)', fontSize: '1.2rem'}} />
                <h3 style={{ fontWeight: 600, margin: 0 }}>Media / Video Section</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label className="stat-label">Title EN</label>
                            <input className="adm-input" value={localSettings['home_media_title']?.en || ''} onChange={e => handleChange('home_media_title', 'en', e.target.value)} />
                        </div>
                        <div>
                            <label className="stat-label">Title RU</label>
                            <input className="adm-input" value={localSettings['home_media_title']?.ru || ''} onChange={e => handleChange('home_media_title', 'ru', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="stat-label">Description EN</label>
                        <textarea className="adm-input" rows={2} value={localSettings['home_media_desc']?.en || ''} onChange={e => handleChange('home_media_desc', 'en', e.target.value)} />
                    </div>
                    <div>
                        <label className="stat-label">Description RU</label>
                        <textarea className="adm-input" rows={2} value={localSettings['home_media_desc']?.ru || ''} onChange={e => handleChange('home_media_desc', 'ru', e.target.value)} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ImageSelector label="Video Poster Image" category="hotel" value={localSettings['home_media_image']?.en || ''} onChange={url => handleChange('home_media_image', 'en', url)} />
                    <div>
                        <label className="stat-label">Video Link (YouTube/Vimeo)</label>
                        <input className="adm-input" placeholder="e.g. https://youtube.com/..." value={localSettings['home_media_video_link']?.en || ''} onChange={e => handleChange('home_media_video_link', 'en', e.target.value)} />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="adm-btn adm-btn-primary" 
                    onClick={() => handleUpdateGroup([
                        'home_media_title', 'home_media_desc', 'home_media_image', 'home_media_video_link'
                    ], 'Media bo\'limi')}>
                    <FaSave /> O'zgarishlarni saqlash
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomeManager;
