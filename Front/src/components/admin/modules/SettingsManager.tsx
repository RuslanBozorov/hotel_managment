import React, { useState, useEffect } from 'react';
import { FaSave, FaGlobe, FaShieldAlt, FaEnvelope, FaBell, FaTelegramPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
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
    }
  };

  const menuItems = [
    { id: 'general', label: 'General Settings', icon: <FaGlobe /> },
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
