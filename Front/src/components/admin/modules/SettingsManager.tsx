import React, { useState, useEffect, useRef } from 'react';
import { FaSave, FaGlobe, FaShieldAlt, FaEnvelope, FaBell, FaTelegramPlane, FaCheckCircle, FaExclamationTriangle, FaImage, FaCloudUploadAlt, FaTrash, FaSpinner, FaSearch } from 'react-icons/fa';
import * as api from '../../../services/api';

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<api.Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [localSettings, setLocalSettings] = useState<Record<string, { en: string, ru: string }>>({});
  const token = localStorage.getItem('admin_token') || '';
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ok: boolean, msg: string} | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.settingsApi.getAll(token);
      const settingsData = Array.isArray(data) ? data : [];
      setSettings(settingsData);
      
      const initialLocal: Record<string, { en: string, ru: string }> = {};
      settingsData.forEach(s => {
        initialLocal[s.key] = { en: s.value_en, ru: s.value_ru };
      });
      setLocalSettings(initialLocal);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, lang: 'en' | 'ru', value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: { 
        en: lang === 'en' ? value : (prev[key]?.en || ''),
        ru: lang === 'ru' ? value : (prev[key]?.ru || '')
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Save all changed settings in this tab
      const promises = Object.entries(localSettings).map(([key, val]) => 
        api.settingsApi.update({ key, value_en: val.en, value_ru: val.ru }, token)
      );
      await Promise.all(promises);
      setMessage('All settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchSettings();
    } catch (error) {
      console.error('Update failed:', error);
      setMessage('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && settings.length === 0) return <div className="adm-loader">Loading Settings...</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="adm-card">
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>General Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* ===== LOGO UPLOAD SECTION ===== */}
              <div style={{ padding: '20px', border: '1px dashed var(--adm-border)', borderRadius: '12px', background: 'var(--adm-sidebar-active-bg)' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaImage style={{ color: 'var(--adm-primary)' }} /> Website Logo
                </h4>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Logo Preview */}
                  <div style={{
                    width: '160px', height: '80px', borderRadius: '10px',
                    border: '2px solid var(--adm-border)', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--adm-bg)', flexShrink: 0
                  }}>
                    {localSettings['site_logo']?.en ? (
                      <img
                        src={localSettings['site_logo'].en}
                        alt="Site Logo"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <span style={{ color: 'var(--adm-text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '8px' }}>No logo uploaded</span>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '200px' }}>
                    <input
                      type="file" ref={logoInputRef} style={{ display: 'none' }}
                      accept="image/png,image/svg+xml,image/jpeg,image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setLogoUploading(true);
                          const result = await api.mediaApi.upload(file);
                          handleChange('site_logo', 'en', result.url);
                          handleChange('site_logo', 'ru', result.url);
                          setMessage('Logo uploaded! Click "Save All Changes" to apply.');
                          setTimeout(() => setMessage(''), 4000);
                        } catch (err) {
                          console.error('Logo upload failed:', err);
                          setMessage('Logo upload failed. Please try again.');
                        } finally {
                          setLogoUploading(false);
                        }
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button" className="adm-btn adm-btn-outline"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={logoUploading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px' }}
                      >
                        {logoUploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                        {logoUploading ? 'Uploading...' : 'Upload Logo'}
                      </button>
                      {localSettings['site_logo']?.en && (
                        <button
                          type="button" className="adm-btn adm-btn-outline"
                          style={{ color: 'var(--adm-error)', borderColor: 'var(--adm-error)', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
                          onClick={() => {
                            handleChange('site_logo', 'en', '');
                            handleChange('site_logo', 'ru', '');
                          }}
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>
                    <div className="adm-form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Or paste image URL:</label>
                      <input
                        type="text" className="adm-input" placeholder="https://..."
                        value={localSettings['site_logo']?.en || ''}
                        onChange={e => {
                          handleChange('site_logo', 'en', e.target.value);
                          handleChange('site_logo', 'ru', e.target.value);
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', margin: 0 }}>
                      Recommended: PNG or SVG, transparent background, max 500×200px
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="adm-form-group">
                  <label>Website Name (EN)</label>
                  <input 
                    type="text" className="adm-input" 
                    value={localSettings['site_name']?.en || ''} 
                    onChange={e => handleChange('site_name', 'en', e.target.value)}
                  />
                </div>
                <div className="adm-form-group">
                  <label>Website Name (RU)</label>
                  <input 
                    type="text" className="adm-input" 
                    value={localSettings['site_name']?.ru || ''} 
                    onChange={e => handleChange('site_name', 'ru', e.target.value)}
                  />
                </div>
              </div>
              <div className="adm-form-group">
                <label>Support Email</label>
                <input 
                  type="email" className="adm-input" 
                  value={localSettings['support_email']?.en || ''} 
                  onChange={e => handleChange('support_email', 'en', e.target.value)}
                />
              </div>
              <div className="adm-form-group">
                <label>Contact Phone</label>
                <input 
                  type="text" className="adm-input" 
                  value={localSettings['contact_phone']?.en || ''} 
                  onChange={e => handleChange('contact_phone', 'en', e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="adm-form-group">
                  <label>Meta Description (EN)</label>
                  <textarea 
                    className="adm-input" 
                    rows={3} 
                    value={localSettings['meta_desc']?.en || ''} 
                    onChange={e => handleChange('meta_desc', 'en', e.target.value)}
                  />
                </div>
                <div className="adm-form-group">
                  <label>Meta Description (RU)</label>
                  <textarea 
                    className="adm-input" 
                    rows={3} 
                    value={localSettings['meta_desc']?.ru || ''} 
                    onChange={e => handleChange('meta_desc', 'ru', e.target.value)}
                  />
                </div>
              </div>
              <div className="adm-form-group">
                <label>Contact Address (EN)</label>
                <input 
                  type="text" className="adm-input" 
                  value={localSettings['contact_address']?.en || ''} 
                  onChange={e => handleChange('contact_address', 'en', e.target.value)}
                />
              </div>
              <div className="adm-form-group">
                <label>Contact Address (RU)</label>
                <input 
                  type="text" className="adm-input" 
                  value={localSettings['contact_address']?.ru || ''} 
                  onChange={e => handleChange('contact_address', 'ru', e.target.value)}
                />
              </div>

              <h3 style={{ fontWeight: 600, marginTop: '20px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--adm-border)' }}>Social Media Links</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="adm-form-group">
                  <label>Instagram URL</label>
                  <input type="text" className="adm-input" value={localSettings['social_instagram']?.en || ''} onChange={e => handleChange('social_instagram', 'en', e.target.value)} />
                </div>
                <div className="adm-form-group">
                  <label>Telegram URL</label>
                  <input type="text" className="adm-input" value={localSettings['social_telegram']?.en || ''} onChange={e => handleChange('social_telegram', 'en', e.target.value)} />
                </div>
                <div className="adm-form-group">
                  <label>Facebook URL</label>
                  <input type="text" className="adm-input" value={localSettings['social_facebook']?.en || ''} onChange={e => handleChange('social_facebook', 'en', e.target.value)} />
                </div>
                <div className="adm-form-group">
                  <label>LinkedIn URL</label>
                  <input type="text" className="adm-input" value={localSettings['social_linkedin']?.en || ''} onChange={e => handleChange('social_linkedin', 'en', e.target.value)} />
                </div>
                <div className="adm-form-group">
                  <label>YouTube URL</label>
                  <input type="text" className="adm-input" value={localSettings['social_youtube']?.en || ''} onChange={e => handleChange('social_youtube', 'en', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="adm-card">
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>Security & Access</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="adm-form-group">
                <label>Session Timeout (Minutes)</label>
                <input 
                  type="number" className="adm-input" 
                  value={localSettings['session_timeout']?.en || '60'} 
                  onChange={e => handleChange('session_timeout', 'en', e.target.value)}
                />
              </div>
              <div className="adm-form-group">
                <label>IP Whitelist (Comma separated)</label>
                <textarea 
                  className="adm-input" 
                  rows={2}
                  value={localSettings['ip_whitelist']?.en || ''} 
                  onChange={e => handleChange('ip_whitelist', 'en', e.target.value)}
                  placeholder="e.g. 192.168.1.1, 10.0.0.1"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="mfa"
                  checked={localSettings['require_mfa']?.en === 'true'} 
                  onChange={e => handleChange('require_mfa', 'en', e.target.checked.toString())}
                />
                <label htmlFor="mfa" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Require Two-Factor Authentication (MFA)</label>
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="adm-card">
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>Email Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="adm-form-group">
                <label>SMTP Host</label>
                <input 
                  type="text" className="adm-input" 
                  value={localSettings['smtp_host']?.en || 'smtp.gmail.com'} 
                  onChange={e => handleChange('smtp_host', 'en', e.target.value)}
                />
              </div>
              <div className="adm-form-group">
                <label>SMTP Port</label>
                <input 
                  type="text" className="adm-input" 
                  value={localSettings['smtp_port']?.en || '587'} 
                  onChange={e => handleChange('smtp_port', 'en', e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="notify_new_app"
                  checked={localSettings['notify_new_app']?.en === 'true'} 
                  onChange={e => handleChange('notify_new_app', 'en', e.target.checked.toString())}
                />
                <label htmlFor="notify_new_app" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Notify on new application</label>
              </div>
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="adm-card">
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>System Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="maintenance"
                  checked={localSettings['maintenance_mode']?.en === 'true'} 
                  onChange={e => handleChange('maintenance_mode', 'en', e.target.checked.toString())}
                />
                <label htmlFor="maintenance" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--adm-error)' }}>
                  Maintenance Mode (Disables frontend)
                </label>
              </div>
              <div className="adm-form-group">
                <label>Log Retention (Days)</label>
                <input 
                  type="number" className="adm-input" 
                  value={localSettings['log_retention']?.en || '30'} 
                  onChange={e => handleChange('log_retention', 'en', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      default: return null;
      case 'telegram':
        return (
          <div className="adm-card">
            <h3 style={{ fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaTelegramPlane style={{ color: '#0088cc' }} /> Telegram Notifications
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', marginBottom: '24px' }}>
              Connect a Telegram Bot to receive instant alerts when new applications arrive.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="adm-form-group">
                <label>Bot Token <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>(from @BotFather)</span></label>
                <input 
                  type="password" className="adm-input" 
                  placeholder="123456789:ABCdefGhIjKlmNoPqRsTuVwXyZ"
                  value={localSettings['telegram_bot_token']?.en || ''} 
                  onChange={e => handleChange('telegram_bot_token', 'en', e.target.value)}
                />
              </div>
              <div className="adm-form-group">
                <label>Chat ID <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>(group or personal chat)</span></label>
                <input 
                  type="text" className="adm-input" 
                  placeholder="-100123456789"
                  value={localSettings['telegram_chat_id']?.en || ''} 
                  onChange={e => handleChange('telegram_chat_id', 'en', e.target.value)}
                />
              </div>

              {telegramTestResult && (
                <div style={{ 
                  padding: '12px 16px', borderRadius: '8px',
                  background: telegramTestResult.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: telegramTestResult.ok ? '#10b981' : '#ef4444',
                  fontSize: '0.875rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  {telegramTestResult.ok ? <FaCheckCircle /> : <FaExclamationTriangle />}
                  {telegramTestResult.msg}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  className="adm-btn adm-btn-outline"
                  disabled={testingTelegram}
                  onClick={async () => {
                    try {
                      setTestingTelegram(true);
                      setTelegramTestResult(null);
                      // Save token/chatId first
                      await api.settingsApi.update({ key: 'telegram_bot_token', value_en: localSettings['telegram_bot_token']?.en || '', value_ru: '' }, token);
                      await api.settingsApi.update({ key: 'telegram_chat_id', value_en: localSettings['telegram_chat_id']?.en || '', value_ru: '' }, token);
                      await api.telegramApi.testConnection(token);
                      setTelegramTestResult({ ok: true, msg: 'Test message sent! Check your Telegram.' });
                    } catch (err: any) {
                      setTelegramTestResult({ ok: false, msg: err?.detail || 'Connection failed. Verify Bot Token and Chat ID.' });
                    } finally {
                      setTestingTelegram(false);
                    }
                  }}
                  style={{ padding: '10px 24px' }}
                >
                  <FaTelegramPlane /> {testingTelegram ? 'Sending...' : '🧪 Test Connection'}
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>Save settings first, then test.</span>
              </div>

              <div style={{ padding: '16px', background: 'var(--adm-sidebar-active-bg)', borderRadius: '10px', fontSize: '0.85rem', lineHeight: '1.7' }}>
                <strong>📌 How to set up:</strong>
                <ol style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--adm-text-muted)' }}>
                  <li>Open Telegram → search <b>@BotFather</b></li>
                  <li>Send <code>/newbot</code> and follow instructions</li>
                  <li>Copy the <b>Bot Token</b> and paste above</li>
                  <li>Add the bot to your group/channel</li>
                  <li>Get Chat ID via <code>@getmyid_bot</code> or API call</li>
                  <li>Click "Test Connection" to verify!</li>
                </ol>
              </div>
            </div>
          </div>
        );
      case 'seo':
        const helpStyle = { fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: '4px', lineHeight: '1.5' } as const;
        const exStyle = { fontSize: '0.72rem', color: '#10b981', fontStyle: 'italic' as const, display: 'block', marginTop: '2px' };
        return (
          <div className="adm-card">
            <h3 style={{ fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaSearch style={{ color: '#10b981' }} /> SEO & Meta Tags
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', marginBottom: '24px' }}>
              Qidiruv tizimlarida (Google, Yandex) saytingiz qanday ko'rinishini boshqaring. Har bir maydon yonidagi tushuntirishlarni o'qing.
            </p>

            {/* LIVE PREVIEW */}
            <div style={{ padding: '20px', background: 'var(--adm-sidebar-active-bg)', borderRadius: '12px', marginBottom: '28px', border: '1px solid var(--adm-border)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.9rem' }}>🔍 Google qidiruv natijasi (Live Preview)</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginBottom: '12px' }}>
                Quyidagi ma'lumotlar to'ldirilganda, Google natijalarida saytingiz shunday ko'rinadi:
              </p>
              <div style={{ background: 'white', padding: '20px', borderRadius: '10px', maxWidth: '620px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#666' }}>H</div>
                  <span style={{ fontSize: '0.75rem', color: '#202124' }}>{localSettings['seo_canonical']?.en || 'hotelconsulting.uz'}</span>
                </div>
                <div style={{ fontSize: '1.2rem', color: '#1a0dab', fontWeight: 400, marginBottom: '6px', lineHeight: '1.3' }}>
                  {localSettings['seo_title']?.en || localSettings['site_name']?.en || 'Sayt sarlavhasi shu yerda ko\'rinadi'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#4d5156', lineHeight: '1.55' }}>
                  {localSettings['seo_description']?.en || 'Meta description matni shu yerda chiqadi. Foydalanuvchilar aynan shu matnni o\'qiydi.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Page Title */}
              <div style={{ padding: '16px', background: 'var(--adm-sidebar-active-bg)', borderRadius: '10px', border: '1px solid var(--adm-border)' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>📌 Page Title — Sahifa sarlavhasi</label>
                <p style={helpStyle}>Brauzer tabida va Google natijalarida birinchi qatorda ko'rinadi. 50-60 belgi tavsiya etiladi.<span style={exStyle}>✅ Misol: "HotelConsulting — Mehmonxona boshqaruv va konsalting xizmatlari"</span></p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>EN</label><input type="text" className="adm-input" placeholder="HotelConsulting — Hotel Management" value={localSettings['seo_title']?.en || ''} onChange={e => handleChange('seo_title', 'en', e.target.value)} /></div>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>RU</label><input type="text" className="adm-input" placeholder="HotelConsulting — Управление Отелями" value={localSettings['seo_title']?.ru || ''} onChange={e => handleChange('seo_title', 'ru', e.target.value)} /></div>
                </div>
              </div>

              {/* Meta Description */}
              <div style={{ padding: '16px', background: 'var(--adm-sidebar-active-bg)', borderRadius: '10px', border: '1px solid var(--adm-border)' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>📝 Meta Description — Tavsif matni</label>
                <p style={helpStyle}>Google natijalarida sarlavha ostida chiqadigan matn. Mijozni saytga bosishga undaydi. 150-160 belgi.<span style={exStyle}>✅ Misol: "O'zbekistondagi yetakchi otel boshqaruv kompaniyasi. Qurish, pre-opening, marketing va franchise."</span></p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>EN</label><textarea className="adm-input" rows={3} value={localSettings['seo_description']?.en || ''} onChange={e => handleChange('seo_description', 'en', e.target.value)} maxLength={300} /><span style={{ fontSize: '0.7rem', color: (localSettings['seo_description']?.en?.length || 0) > 160 ? 'var(--adm-error)' : 'var(--adm-text-muted)' }}>{localSettings['seo_description']?.en?.length || 0}/160</span></div>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>RU</label><textarea className="adm-input" rows={3} value={localSettings['seo_description']?.ru || ''} onChange={e => handleChange('seo_description', 'ru', e.target.value)} maxLength={300} /><span style={{ fontSize: '0.7rem', color: (localSettings['seo_description']?.ru?.length || 0) > 160 ? 'var(--adm-error)' : 'var(--adm-text-muted)' }}>{localSettings['seo_description']?.ru?.length || 0}/160</span></div>
                </div>
              </div>

              {/* Meta Keywords */}
              <div style={{ padding: '16px', background: 'var(--adm-sidebar-active-bg)', borderRadius: '10px', border: '1px solid var(--adm-border)' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>🏷️ Meta Keywords — Kalit so'zlar</label>
                <p style={helpStyle}>Saytingiz qaysi so'zlar bo'yicha topilishini xohlasangiz, vergul bilan yozing.<span style={exStyle}>✅ Misol: "mehmonxona qurish, hotel management, otel konsalting, hotel construction Uzbekistan"</span></p>
                <div className="adm-form-group" style={{ marginTop: '12px', marginBottom: '12px' }}><label style={{ fontSize: '0.8rem' }}>UZ / EN</label><textarea className="adm-input" rows={3} value={localSettings['seo_keywords']?.en || ''} onChange={e => handleChange('seo_keywords', 'en', e.target.value)} /></div>
                <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>RU</label><textarea className="adm-input" rows={3} value={localSettings['seo_keywords']?.ru || ''} onChange={e => handleChange('seo_keywords', 'ru', e.target.value)} /></div>
              </div>

              {/* Open Graph */}
              <div style={{ padding: '16px', background: 'var(--adm-sidebar-active-bg)', borderRadius: '10px', border: '1px solid var(--adm-border)' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>📱 Open Graph — Ijtimoiy tarmoqlar</label>
                <p style={helpStyle}>Telegram, Facebook, LinkedIn da link ulashilganda chiqadigan preview kartochkasi.<span style={exStyle}>✅ Telegramda link yuborganingizda chiqadigan rasm va matn shu yerdan olinadi.</span></p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>OG Title (EN)</label><input type="text" className="adm-input" value={localSettings['seo_og_title']?.en || ''} onChange={e => handleChange('seo_og_title', 'en', e.target.value)} /></div>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>OG Title (RU)</label><input type="text" className="adm-input" value={localSettings['seo_og_title']?.ru || ''} onChange={e => handleChange('seo_og_title', 'ru', e.target.value)} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>OG Description (EN)</label><textarea className="adm-input" rows={2} value={localSettings['seo_og_description']?.en || ''} onChange={e => handleChange('seo_og_description', 'en', e.target.value)} /></div>
                  <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>OG Description (RU)</label><textarea className="adm-input" rows={2} value={localSettings['seo_og_description']?.ru || ''} onChange={e => handleChange('seo_og_description', 'ru', e.target.value)} /></div>
                </div>
                <div className="adm-form-group" style={{ marginTop: '12px', marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>OG Image URL <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>1200×630px</span></label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="text" className="adm-input" placeholder="https://..." value={localSettings['seo_og_image']?.en || ''} onChange={e => { handleChange('seo_og_image', 'en', e.target.value); handleChange('seo_og_image', 'ru', e.target.value); }} style={{ flex: 1 }} />
                    {localSettings['seo_og_image']?.en && (<div style={{ width: '60px', height: '32px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--adm-border)', flexShrink: 0 }}><img src={localSettings['seo_og_image'].en} alt="OG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>)}
                  </div>
                </div>
              </div>

              {/* Advanced SEO */}
              <div style={{ padding: '16px', background: 'var(--adm-sidebar-active-bg)', borderRadius: '10px', border: '1px solid var(--adm-border)' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>⚙️ Advanced SEO — Qo'shimcha</label>
                <div className="adm-form-group" style={{ marginTop: '12px' }}><label style={{ fontSize: '0.8rem' }}>Canonical URL</label><p style={helpStyle}>Saytning asosiy manzili. Google ga "bu sahifaning asl manzili shu" deb aytadi.<span style={exStyle}>✅ Misol: https://hotelconsulting.uz</span></p><input type="text" className="adm-input" placeholder="https://hotelconsulting.uz" value={localSettings['seo_canonical']?.en || ''} onChange={e => { handleChange('seo_canonical', 'en', e.target.value); handleChange('seo_canonical', 'ru', e.target.value); }} /></div>
                <div className="adm-form-group"><label style={{ fontSize: '0.8rem' }}>Robots Meta</label><p style={helpStyle}>Google botiga saytni indekslash kerakligini aytadi. Odatda "index, follow" tanlang.</p><select className="adm-input" value={localSettings['seo_robots']?.en || 'index, follow'} onChange={e => { handleChange('seo_robots', 'en', e.target.value); handleChange('seo_robots', 'ru', e.target.value); }}><option value="index, follow">index, follow ✅ (Tavsiya etiladi)</option><option value="index, nofollow">index, nofollow</option><option value="noindex, follow">noindex, follow</option><option value="noindex, nofollow">noindex, nofollow ⛔ (Sayt yashiriladi)</option></select></div>
                <div className="adm-form-group"><label style={{ fontSize: '0.8rem' }}>Google Analytics ID</label><p style={helpStyle}>Saytga qancha odam kirganini ko'rsatadi. analytics.google.com dan oling.<span style={exStyle}>✅ Misol: G-AB12CD34EF</span></p><input type="text" className="adm-input" placeholder="G-XXXXXXXXXX" value={localSettings['seo_ga_id']?.en || ''} onChange={e => { handleChange('seo_ga_id', 'en', e.target.value); handleChange('seo_ga_id', 'ru', e.target.value); }} /></div>
                <div className="adm-form-group" style={{ marginBottom: 0 }}><label style={{ fontSize: '0.8rem' }}>Google Search Console Verification</label><p style={helpStyle}>search.google.com/search-console dan sayt tasdiqlash kodi.<span style={exStyle}>✅ Misol: aB1cD2eF3gH4iJ5kL6</span></p><input type="text" className="adm-input" placeholder="verification code" value={localSettings['seo_google_verification']?.en || ''} onChange={e => { handleChange('seo_google_verification', 'en', e.target.value); handleChange('seo_google_verification', 'ru', e.target.value); }} /></div>
              </div>

            </div>
          </div>
        );
    }
  };

  const menuItems = [
    { id: 'general', label: 'General Settings', icon: <FaGlobe /> },
    { id: 'seo', label: 'SEO & Meta Tags', icon: <FaSearch /> },
    { id: 'security', label: 'Security & Access', icon: <FaShieldAlt /> },
    { id: 'email', label: 'Email Notifications', icon: <FaEnvelope /> },
    { id: 'telegram', label: 'Telegram Bot', icon: <FaTelegramPlane /> },
    { id: 'system', label: 'System Alerts', icon: <FaBell /> },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="adm-heading">Settings</h1>
      <p className="adm-subheading">Configure your website's global parameters and system behavior.</p>

      {message && (
        <div style={{ 
          padding: '12px 20px', 
          background: message.includes('failed') ? 'var(--adm-error)' : 'var(--adm-success)', 
          color: 'white', borderRadius: '8px', marginBottom: '24px',
          fontSize: '0.875rem', fontWeight: 500,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map(item => (
            <button 
              key={item.id}
              className={`adm-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {renderTabContent()}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              className="adm-btn adm-btn-primary" 
              onClick={handleSave}
              disabled={loading}
              style={{ padding: '12px 32px' }}
            >
              <FaSave /> {loading ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
