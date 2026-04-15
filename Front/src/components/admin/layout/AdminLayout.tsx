import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHome, FaBriefcase, FaBuilding, FaUserTie, FaHandshake,
  FaChartBar, FaNewspaper, 
  FaSignOutAlt, FaBell,
  FaSearch, FaMoon, FaSun, FaBars, FaTimes, FaEnvelope, FaClock, FaImage, FaCog, FaTag
} from 'react-icons/fa';
import { useI18n } from '../../../i18n';
import type { Language } from '../../../i18n';
import * as api from '../../../services/api';
import '../../../pages/AdminDashboard.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminName: string;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  adminName,
  onLogout 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [applications, setApplications] = useState<api.Application[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { t, lang, setLang } = useI18n();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('adm-theme') === 'dark';
  });

  const token = localStorage.getItem('admin_token') || '';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('adm-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const fetchLatestApps = async () => {
      try {
        const data = await api.applicationsApi.getAll(token);
        // Sort by date and take latest 5
        const sorted = (Array.isArray(data) ? data : [])
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setApplications(sorted);
      } catch (e) {
        console.error('Failed to fetch notifications:', e);
      }
    };
    if (token) fetchLatestApps();
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSidebarCollapsed = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSearch = () => setShowSearch(!showSearch);

  const menuItems = [
    { id: 'dashboard', label: t('admin.sidebar.dashboard'), icon: <FaChartBar />, group: 'Umumiy' },
    { id: 'stats', label: t('admin.sidebar.stats'), icon: <FaChartBar />, group: 'Umumiy' },
    { id: 'home', label: t('admin.sidebar.home'), icon: <FaHome />, group: 'Kontent' },
    { id: 'services', label: t('admin.sidebar.services'), icon: <FaBriefcase />, group: 'Kontent' },
    { id: 'projects', label: t('admin.sidebar.projects'), icon: <FaBuilding />, group: 'Kontent' },
    { id: 'partners', label: t('admin.sidebar.partners'), icon: <FaHandshake />, group: 'Kontent' },
    { id: 'about', label: t('admin.sidebar.about'), icon: <FaUserTie />, group: 'Kontent' },
    { id: 'blog', label: t('admin.sidebar.blog'), icon: <FaNewspaper />, group: 'Kontent' },
    { id: 'categories', label: t('admin.sidebar.categories'), icon: <FaTag />, group: 'Kontent' },
    { id: 'hero', label: t('admin.sidebar.hero'), icon: <FaImage />, group: 'Kontent' },
    { id: 'applications', label: t('admin.sidebar.applications'), icon: <FaBell />, group: 'Aloqa' },
    { id: 'settings', label: t('admin.sidebar.settings'), icon: <FaCog />, group: 'Tizim' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="admin-dashboard-container" style={{ '--sidebar-width': isSidebarCollapsed ? '80px' : 'var(--adm-sidebar-width)' } as React.CSSProperties}>
      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={t('admin.common.search')} 
              className="adm-input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button onClick={toggleSearch} className="mobile-search-close">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`adm-sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="adm-logo-area">
          <div className="adm-logo-icon">HP</div>
          <span className="adm-logo-text">HotelPro Admin</span>
        </div>

        <nav className="adm-nav">
          {Object.entries(groupedItems).map(([group, items]) => (
            <React.Fragment key={group}>
              <div className="adm-nav-group">{group}</div>
              {items.map((item) => (
                <button
                  key={item.id}
                  className={`adm-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-nav-item" onClick={onLogout} style={{ color: 'var(--adm-error)' }} title={isSidebarCollapsed ? t('admin.sidebar.logout') : undefined}>
            <FaSignOutAlt />
            <span>{t('admin.sidebar.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && window.innerWidth <= 1024 && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="adm-main-wrapper">
        <header className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={toggleSidebar} 
              className="adm-btn adm-btn-outline mobile-menu-btn" 
              style={{ padding: '8px' }}
            >
              <FaBars />
            </button>
            <button 
              onClick={toggleSidebarCollapsed} 
              className="adm-btn adm-btn-outline desktop-toggle-btn" 
              style={{ padding: '8px' }}
            >
              <FaBars />
            </button>
            
            {/* Desktop Search */}
            <div className="desktop-search" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--adm-text-muted)' }}>
              <FaSearch />
              <input 
                type="text" 
                placeholder={t('admin.common.search')} 
                className="adm-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', width: '300px' }} 
              />
            </div>
            
            {/* Mobile Search Toggle */}
            <button 
              onClick={toggleSearch} 
              className="adm-btn adm-btn-outline mobile-search-btn"
              style={{ padding: '8px' }}
            >
              <FaSearch />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Admin Language Switcher */}
            <div style={{ 
              display: 'flex', gap: '4px', background: 'var(--adm-bg)', 
              padding: '4px', borderRadius: '8px', border: '1px solid var(--adm-border)',
              marginRight: '8px'
            }}>
              {(['en', 'ru'] as Language[]).map(l => (
                <button key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '4px 8px', fontSize: '0.7rem', fontWeight: 700,
                    borderRadius: '4px', border: 'none', cursor: 'pointer',
                    background: lang === l ? 'var(--adm-primary)' : 'transparent',
                    color: lang === l ? 'white' : 'var(--adm-text-muted)',
                    transition: 'all 0.2s'
                  }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <button 
              onClick={toggleDarkMode} 
              className="adm-btn adm-btn-outline" 
              style={{ borderRadius: '50%', padding: '10px' }}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            {/* Notifications Dropdown Container */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button 
                className="adm-btn adm-btn-outline" 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ borderRadius: '50%', padding: '10px' }}
              >
                <FaBell />
                {applications.filter(a => a.status === 'pending').length > 0 && (
                  <span style={{ 
                    position: 'absolute', top: '0', right: '0', 
                    width: '10px', height: '10px', 
                    background: 'var(--adm-error)', borderRadius: '50%',
                    border: '2px solid var(--adm-card-bg)'
                  }}></span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    {lang === 'ru' ? 'Уведомления' : 'Notifications'}
                    <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                      {applications.filter(a => a.status === 'pending').length} {lang === 'ru' ? 'Новых' : 'New'}
                    </span>
                  </div>
                  <div className="notification-list">
                    {applications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--adm-text-muted)', fontSize: '0.85rem' }}>
                        {lang === 'ru' ? 'Нет новых сообщений' : 'No new messages'}
                      </div>
                    ) : (
                      applications.map(app => (
                        <div 
                          key={app.id} 
                          className={`notification-item ${app.status === 'pending' ? 'unread' : ''}`}
                          onClick={() => {
                            setActiveTab('applications');
                            setShowNotifications(false);
                          }}
                        >
                          <div className="notification-icon">
                            <FaEnvelope />
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">{app.fullname}</div>
                            <div className="notification-desc">{app.message || app.service_type || 'Yangi so\'rov'}</div>
                            <div className="notification-time">
                              <FaClock style={{ fontSize: '0.7rem', marginRight: '4px' }} />
                              {new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="notification-footer">
                    <button onClick={() => { setActiveTab('applications'); setShowNotifications(false); }}>
                      {lang === 'ru' ? 'Посмотреть все сообщения' : 'View all messages'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="adm-user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{adminName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>To'liq ruxsat</div>
              </div>
              <div style={{ 
                width: '40px', height: '40px', 
                borderRadius: '50%', background: 'var(--adm-sidebar-active-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: 'var(--adm-primary)'
              }}>
                <FaUserTie />
              </div>
            </div>
          </div>
        </header>

        <section className="adm-content animate-fade-in">
          {children}
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
