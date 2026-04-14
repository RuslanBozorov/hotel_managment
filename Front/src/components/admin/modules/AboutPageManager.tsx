import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import * as api from '../../../services/api';
import { useAdminToast } from '../context/AdminToastContext';
import ImageSelector from '../common/ImageSelector';

const AboutPageManager: React.FC = () => {
  const [team, setTeam] = useState<api.TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<api.TeamMember> | null>(null);
  const [localSettings, setLocalSettings] = useState<Record<string, { en: string, ru: string }>>({});
  const { showToast } = useAdminToast();
  const token = localStorage.getItem('admin_token') || '';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [t, settingsData] = await Promise.all([
        api.teamApi.getAll(token),
        api.settingsApi.getAll(token)
      ]);
      setTeam(Array.isArray(t) ? t : []);
      
      const initialLocal: Record<string, { en: string, ru: string }> = {};
      (settingsData as api.Setting[]).forEach(item => {
        initialLocal[item.key] = { en: item.value_en, ru: item.value_ru };
      });
      setLocalSettings(initialLocal);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingChange = (key: string, lang: 'en' | 'ru', value: string) => {
    setLocalSettings(prev => {
      const current = prev[key] || { en: '', ru: '' };
      return {
        ...prev,
        [key]: { ...current, [lang]: value }
      };
    });
  };

  const handleUpdateSetting = async (key: string) => {
    const val = localSettings[key];
    if (!val) return;
    try {
      await api.settingsApi.update({ key, value_en: val.en, value_ru: val.ru }, token);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) return;
    try {
      const dataToSave = {
        fullname: currentMember.fullname || '',
        role_en: currentMember.role_en || 'Role',
        role_ru: currentMember.role_ru || currentMember.role_en || 'Poль',
        bio_en: currentMember.bio_en || '',
        bio_ru: currentMember.bio_ru || '',
        linkedin: currentMember.linkedin || '',
        telegram: currentMember.telegram || '',
        image_url: currentMember.image_url || ''
      };

      if (currentMember.id) {
        await api.teamApi.update(currentMember.id, dataToSave, token);
        showToast('Member updated successfully!');
      } else {
        await api.teamApi.create(dataToSave as any, token);
        showToast('Member added successfully!');
      }
      setShowMemberModal(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteMember = async (id: number) => {
    if (!window.confirm('Delete member?')) return;
    try {
      await api.teamApi.delete(id, token);
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="adm-loader">Loading About Info...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="adm-heading">About Page Management</h1>
      <p className="adm-subheading">Manage your page content, team and company statistics.</p>

      {/* Hero Section */}
      <div className="adm-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>Page Header & Introduction</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="stat-label">Hero Title (EN)</label>
                <input className="adm-input" value={localSettings['about_hero_title']?.en || ''} onChange={e => handleSettingChange('about_hero_title', 'en', e.target.value)} />
              </div>
              <div>
                <label className="stat-label">Hero Title (RU)</label>
                <input className="adm-input" value={localSettings['about_hero_title']?.ru || ''} onChange={e => handleSettingChange('about_hero_title', 'ru', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="stat-label">Main Description (EN)</label>
              <textarea className="adm-input" rows={3} value={localSettings['about_main_desc']?.en || ''} onChange={e => handleSettingChange('about_main_desc', 'en', e.target.value)} />
            </div>
            <div>
              <label className="stat-label">Main Description (RU)</label>
              <textarea className="adm-input" rows={3} value={localSettings['about_main_desc']?.ru || ''} onChange={e => handleSettingChange('about_main_desc', 'ru', e.target.value)} />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ImageSelector 
              label="Hero Background Image"
              category="hotel"
              value={localSettings['about_hero_image']?.en || ''}
              onChange={url => {
                handleSettingChange('about_hero_image', 'en', url);
                handleSettingChange('about_hero_image', 'ru', url);
              }}
            />
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="adm-btn adm-btn-primary" 
                onClick={() => {
                  ['about_hero_title', 'about_main_desc', 'about_hero_image'].forEach(handleUpdateSetting);
                  showToast('Hero settings updated!');
                }}
              >
                <FaSave /> Save Hero Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="adm-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>Mission & Vision Section</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="stat-label">Section Label (EN)</label>
                <input className="adm-input" value={localSettings['about_mission_label']?.en || ''} onChange={e => handleSettingChange('about_mission_label', 'en', e.target.value)} />
              </div>
              <div>
                <label className="stat-label">Section Label (RU)</label>
                <input className="adm-input" value={localSettings['about_mission_label']?.ru || ''} onChange={e => handleSettingChange('about_mission_label', 'ru', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="stat-label">Section Title (EN)</label>
              <input className="adm-input" value={localSettings['about_mission_title']?.en || ''} onChange={e => handleSettingChange('about_mission_title', 'en', e.target.value)} />
            </div>
            <div>
              <label className="stat-label">Section Title (RU)</label>
              <input className="adm-input" value={localSettings['about_mission_title']?.ru || ''} onChange={e => handleSettingChange('about_mission_title', 'ru', e.target.value)} />
            </div>
            <div>
              <label className="stat-label">Lead Description (EN)</label>
              <textarea className="adm-input" rows={2} value={localSettings['about_mission_p1']?.en || ''} onChange={e => handleSettingChange('about_mission_p1', 'en', e.target.value)} />
            </div>
             <div>
              <label className="stat-label">Lead Description (RU)</label>
              <textarea className="adm-input" rows={2} value={localSettings['about_mission_p1']?.ru || ''} onChange={e => handleSettingChange('about_mission_p1', 'ru', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ImageSelector 
              label="Mission Image"
              category="hotel"
              value={localSettings['about_mission_image']?.en || ''}
              onChange={url => {
                handleSettingChange('about_mission_image', 'en', url);
                handleSettingChange('about_mission_image', 'ru', url);
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div>
                <label className="stat-label">Badge Num (15+)</label>
                <input className="adm-input" value={localSettings['about_mission_badge_n']?.en || ''} onChange={e => handleSettingChange('about_mission_badge_n', 'en', e.target.value)} />
              </div>
              <div>
                <label className="stat-label">Badge Text (EN)</label>
                <input className="adm-input" value={localSettings['about_mission_badge_t']?.en || ''} onChange={e => handleSettingChange('about_mission_badge_t', 'en', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="adm-btn adm-btn-primary" 
            onClick={() => {
              const keys = [
                'about_mission_label', 'about_mission_title', 'about_mission_p1', 
                'about_mission_image', 'about_mission_badge_n', 'about_mission_badge_t'
              ];
              keys.forEach(handleUpdateSetting);
              showToast('Mission settings updated!');
            }}
          >
            <FaSave /> Save Mission Content
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Team Section */}
        <div className="adm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 600 }}>Team Members</h3>
            <button className="adm-btn adm-btn-primary" onClick={() => { 
              setCurrentMember({}); 
              setShowMemberModal(!showMemberModal); 
            }}>
              <FaPlus /> {showMemberModal ? 'Close Form' : 'Add Member'}
            </button>
          </div>

          {showMemberModal && (
            <div style={{ background: 'var(--adm-sidebar-active-bg)', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--adm-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{currentMember?.id ? 'Edit Member' : 'Add New Member'}</h3>
                <button className="adm-modal-close" onClick={() => setShowMemberModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleMemberSubmit}>
                <div className="adm-form-group">
                  <label>Full Name</label>
                  <input className="adm-input" value={currentMember?.fullname || ''} onChange={e => setCurrentMember({...currentMember, fullname: e.target.value})} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="adm-form-group">
                    <label>Role (EN)</label>
                    <input className="adm-input" value={currentMember?.role_en || ''} onChange={e => setCurrentMember({...currentMember, role_en: e.target.value})} />
                  </div>
                  <div className="adm-form-group">
                    <label>Role (RU)</label>
                    <input className="adm-input" value={currentMember?.role_ru || ''} onChange={e => setCurrentMember({...currentMember, role_ru: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="adm-form-group">
                    <label>Bio (EN)</label>
                    <textarea className="adm-input" rows={2} value={currentMember?.bio_en || ''} onChange={e => setCurrentMember({...currentMember, bio_en: e.target.value})} />
                  </div>
                  <div className="adm-form-group">
                    <label>Bio (RU)</label>
                    <textarea className="adm-input" rows={2} value={currentMember?.bio_ru || ''} onChange={e => setCurrentMember({...currentMember, bio_ru: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="adm-form-group">
                    <label>LinkedIn URL</label>
                    <input className="adm-input" value={currentMember?.linkedin || ''} onChange={e => setCurrentMember({...currentMember, linkedin: e.target.value})} />
                  </div>
                  <div className="adm-form-group">
                    <label>Telegram Username/URL</label>
                    <input className="adm-input" value={currentMember?.telegram || ''} onChange={e => setCurrentMember({...currentMember, telegram: e.target.value})} />
                  </div>
                </div>
                <ImageSelector 
                  label="Profile Image"
                  category="team"
                  value={currentMember?.image_url || ''} 
                  onChange={url => setCurrentMember({...currentMember, image_url: url})}
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
                  <button type="submit" className="adm-btn adm-btn-primary">
                    {currentMember?.id ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="adm-table-wrapper">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role (EN)</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.fullname}</td>
                    <td>{m.role_en}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="adm-btn-icon" onClick={() => { setCurrentMember(m); setShowMemberModal(true); }}><FaEdit /></button>
                        <button className="adm-btn-icon" style={{ color: 'var(--adm-error)' }} onClick={() => handleDeleteMember(m.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageManager;
