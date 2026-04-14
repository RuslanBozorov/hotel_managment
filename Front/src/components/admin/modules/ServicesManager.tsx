import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import * as api from '../../../services/api';
import ImageSelector from '../common/ImageSelector';

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<api.Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<api.Service> | null>(null);
  const token = localStorage.getItem('admin_token') || '';

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.servicesApi.getAll(token);
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.servicesApi.delete(id, token);
      fetchServices();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService) return;

    try {
      if (currentService.id) {
        await api.servicesApi.update(currentService.id, currentService, token);
      } else {
        await api.servicesApi.create(currentService as api.Service, token);
      }
      setShowModal(false);
      fetchServices();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  if (loading) return <div className="adm-loader">Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="adm-heading">Services</h1>
          <p className="adm-subheading" style={{ marginBottom: 0 }}>Manage your website offerings.</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => { setCurrentService({}); setShowModal(true); }}>
          <FaPlus /> Add New Service
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-table-wrapper">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title (EN)</th>
                <th>Title (RU)</th>
                <th>Popular</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td style={{ fontWeight: 600 }}>{service.title_en}</td>
                  <td>{service.title_ru}</td>
                  <td>
                    <span className={`badge ${service.is_popular ? 'badge-success' : 'badge-outline'}`}>
                      {service.is_popular ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="adm-btn-icon" onClick={() => { setCurrentService(service); setShowModal(true); }}><FaEdit /></button>
                      <button className="adm-btn-icon" style={{ color: 'var(--adm-error)' }} onClick={() => handleDelete(service.id)}><FaTrash /></button>
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
          <div className="adm-modal-content">
            <div className="adm-modal-header">
              <h3>{currentService?.id ? 'Edit Service' : 'Add Service'}</h3>
              <button className="adm-modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="adm-modal-body">
              <div className="adm-form-group">
                <label>Title (EN)</label>
                <input 
                  className="adm-input" 
                  value={currentService?.title_en || ''} 
                  onChange={e => setCurrentService({...currentService, title_en: e.target.value})}
                  required
                />
              </div>
              <div className="adm-form-group">
                <label>Title (RU)</label>
                <input 
                  className="adm-input" 
                  value={currentService?.title_ru || ''} 
                  onChange={e => setCurrentService({...currentService, title_ru: e.target.value})}
                  required
                />
              </div>
              <div className="adm-form-group">
                <label>Description (EN)</label>
                <textarea 
                  className="adm-input" 
                  value={currentService?.desc_en || ''} 
                  onChange={e => setCurrentService({...currentService, desc_en: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="adm-form-group">
                <label>Description (RU)</label>
                <textarea 
                  className="adm-input" 
                  value={currentService?.desc_ru || ''} 
                  onChange={e => setCurrentService({...currentService, desc_ru: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="adm-form-group">
                <label>Icon Class</label>
                <select 
                  className="adm-input" 
                  value={currentService?.icon || ''} 
                  onChange={e => setCurrentService({...currentService, icon: e.target.value})}
                  required
                >
                  <option value="">Select an icon...</option>
                  <option value="FaBuilding">FaBuilding (Building)</option>
                  <option value="FaConciergeBell">FaConciergeBell (Service)</option>
                  <option value="FaBed">FaBed (Rooms)</option>
                  <option value="FaUtensils">FaUtensils (Dining)</option>
                  <option value="FaSpa">FaSpa (Relaxation)</option>
                  <option value="FaSwimmingPool">FaSwimmingPool (Pool)</option>
                  <option value="FaWifi">FaWifi (Internet)</option>
                  <option value="FaCar">FaCar (Parking)</option>
                  <option value="FaGlobe">FaGlobe (Management)</option>
                  <option value="FaChartBar">FaChartBar (Analytics)</option>
                  <option value="FaUserTie">FaUserTie (Staff)</option>
                  <option value="FaHeadset">FaHeadset (Support)</option>
                  <option value="FaCreditCard">FaCreditCard (Payment)</option>
                  <option value="FaCogs">FaCogs (Operation)</option>
                </select>
              </div>
              <ImageSelector 
                label="Service Image"
                category="service"
                value={currentService?.image_url || ''} 
                onChange={url => setCurrentService({...currentService, image_url: url})}
              />
              <div className="adm-form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={currentService?.is_popular || false} 
                  onChange={e => setCurrentService({...currentService, is_popular: e.target.checked})}
                />
                <label>Show as Popular</label>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
