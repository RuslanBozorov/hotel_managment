import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

// Layout & Components
import AdminLayout from '../components/admin/layout/AdminLayout';
import DashboardOverview from '../components/admin/modules/DashboardOverview';
import ServicesManager from '../components/admin/modules/ServicesManager';
import ProjectManager from '../components/admin/modules/ProjectManager';
import HomeManager from '../components/admin/modules/HomeManager';
import BlogManager from '../components/admin/modules/BlogManager';
import AboutPageManager from '../components/admin/modules/AboutPageManager';
import PartnersManager from '../components/admin/modules/PartnersManager';
import HeroManager from '../components/admin/modules/HeroManager';
import CategoriesManager from '../components/admin/modules/CategoriesManager';
import ApplicationsManager from '../components/admin/modules/ApplicationsManager';
import StatsManager from '../components/admin/modules/StatsManager';
import SettingsManager from '../components/admin/modules/SettingsManager';
import { AdminToastProvider } from '../components/admin/context/AdminToastContext';

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<api.Admin | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const adminData = localStorage.getItem('admin');
    if (adminData) setAdmin(JSON.parse(adminData));

    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', fontWeight: 600, color: '#6366f1' }}>
          {localStorage.getItem('lang') === 'uz' ? 'Xavfsiz panel ishga tushmoqda...' : 
           localStorage.getItem('lang') === 'ru' ? 'Запуск защищенной панели...' : 
           'Launching secure panel...'}
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview onNavigate={setActiveTab} />;
      case 'home': return <HomeManager />;
      case 'services': return <ServicesManager />;
      case 'projects': return <ProjectManager />;
      case 'about': return <AboutPageManager />;
      case 'blog': return <BlogManager />;
      case 'partners': return <PartnersManager />;
      case 'categories': return <CategoriesManager />;
      case 'hero': return <HeroManager />;
      case 'applications': return <ApplicationsManager />;
      case 'stats': return <StatsManager />;
      case 'settings': return <SettingsManager />;
      default:
        return (
          <div className="adm-card">
            <h1 className="adm-heading">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p className="adm-subheading">
              {localStorage.getItem('lang') === 'uz' ? 'Ushbu modul hozirda ishlab chiqilmoqda.' : 
               localStorage.getItem('lang') === 'ru' ? 'Этот модуль сейчас находится в разработке.' : 
               'This module is currently under development.'}
            </p>
          </div>
        );
    }
  };

  return (
    <AdminToastProvider>
      <AdminLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        adminName={admin?.username || 'Administrator'}
        onLogout={handleLogout}
      >
        {renderContent()}
      </AdminLayout>
    </AdminToastProvider>
  );
}

export default AdminDashboard;
