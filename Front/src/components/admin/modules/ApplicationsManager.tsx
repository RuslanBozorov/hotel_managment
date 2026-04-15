import { useState, useEffect } from 'react';
import { FaTrash, FaCheck, FaEnvelope, FaPhone, FaUser, FaLightbulb } from 'react-icons/fa';
import * as api from '../../../services/api';

const ApplicationsManager = () => {
  const [applications, setApplications] = useState<api.Application[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('admin_token') || '';

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.applicationsApi.getAll(token);
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.applicationsApi.updateStatus(id, status, token);
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await api.applicationsApi.delete(id, token);
      fetchApplications();
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  if (loading) return <div className="adm-loader">Xabarlar yuklanmoqda...</div>;

  return (
    <div className="applications-manager animate-fade-in">
      <h1 className="adm-heading">Mijozlardan xabarlar</h1>
      <p className="adm-subheading">Veb-sayt orqali kelgan barcha murojaat va arizalarni shu yerda boshqaring.</p>

      {/* Instructional Banner */}
      <div className="adm-help-banner">
        <div className="adm-help-icon"><FaLightbulb /></div>
        <div className="adm-help-content">
          <h4>Xabarlar bilan qanday ishlash kerak?</h4>
          <p>
            Yangi kelgan xabarlarning holati (status) <b>"Kutilmoqda"</b> bo'ladi. Foydalanuvchi bilan bog'lanib bo'lgach, yashil tasdiqlash tugmasini bosib uni <b>"Bajarildi"</b> holatiga o'tkazing. 
            Keraksiz xabarlarni o'chirish uchun qizil savatcha tugmasini bosing.
          </p>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-table-container">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Mijoz ma'lumotlari</th>
                <th>Xabar mazmuni</th>
                <th>Holati</th>
                <th>Sana</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    Hozircha xabarlar yo'q.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                          <FaUser size={12} /> {app.fullname}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', opacity: 0.7 }}>
                          <FaEnvelope size={12} /> {app.email || 'N/A'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', opacity: 0.7 }}>
                          <FaPhone size={12} /> {app.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--adm-primary)', marginBottom: '4px' }}>
                        {app.service_type || 'General Inquiry'}
                      </div>
                      <div style={{ fontSize: '0.85rem', maxWidth: '300px' }} className="adm-text-truncate">
                        {app.message || 'No message provided.'}
                      </div>
                    </td>
                    <td>
                      <span className={`adm-badge ${app.status?.toLowerCase() === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                        {app.status?.toLowerCase() === 'pending' ? 'Kutilmoqda' : 'Bajarildi'}
                      </span>
                    </td>
                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="adm-actions">
                        {app.status?.toLowerCase() !== 'completed' && (
                          <button 
                            className="adm-btn-icon" 
                            title="Mark as Completed" 
                            onClick={() => handleUpdateStatus(app.id, 'completed')}
                            style={{ color: 'var(--adm-success)' }}
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button 
                          className="adm-btn-icon" 
                          title="Delete" 
                          onClick={() => handleDelete(app.id)}
                          style={{ color: 'var(--adm-error)' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsManager;
