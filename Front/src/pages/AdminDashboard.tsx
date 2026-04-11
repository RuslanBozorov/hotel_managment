import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { 
  FaUsers, FaBriefcase, FaBuilding, FaUserTie, FaImage, FaChartBar,
  FaQuoteLeft, FaHandshake, FaNewspaper, FaQuestionCircle, FaHistory, 
  FaCog, FaSignOutAlt, FaEdit, FaTrash, FaSave, FaEnvelope
} from 'react-icons/fa';
import '../pages/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<api.Admin | null>(null);
  const [applications, setApplications] = useState<api.Application[]>([]);
  const [services, setServices] = useState<api.Service[]>([]);
  const [projects, setProjects] = useState<api.Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<api.TeamMember[]>([]);
  const [stats, setStats] = useState<api.Stat[]>([]);
  const [testimonials, setTestimonials] = useState<api.Testimonial[]>([]);
  const [partners, setPartners] = useState<api.Partner[]>([]);
  const [blogs, setBlogs] = useState<api.Blog[]>([]);
  const [faqs, setFaqs] = useState<api.Faq[]>([]);
  const [timelines, setTimelines] = useState<api.Timeline[]>([]);
  const [settings, setSettings] = useState<api.Setting[]>([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; public_id: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [newService, setNewService] = useState({
    title_en: '',
    title_ru: '',
    desc_en: '',
    desc_ru: '',
    icon: 'fa-star',
    image_url: '',
    is_popular: false,
  });
  const [newProject, setNewProject] = useState({
    name: '',
    city: '',
    role_en: '',
    role_ru: '',
    stars: 5,
    image_url: '',
    is_featured: false,
    category: 'Management',
  });
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<number | null>(null);
  const [newTeamMember, setNewTeamMember] = useState({
    fullname: '',
    role_en: '',
    role_ru: '',
    image_url: '',
    linkedin: '',
    email: '',
  });

  const [newStat, setNewStat] = useState({ label_en: '', label_ru: '', value: '', icon: 'fa-star' });
  const [newTestimonial, setNewTestimonial] = useState({ text_en: '', text_ru: '', author: '', position_en: '', position_ru: '', avatar_url: '' });
  const [newPartner, setNewPartner] = useState({ name: '', logo_url: '' });
  const [newBlog, setNewBlog] = useState({ title_en: '', title_ru: '', content_en: '', content_ru: '', category: '', image_url: '' });
  const [newFaq, setNewFaq] = useState({ question_en: '', question_ru: '', answer_en: '', answer_ru: '' });
  const [newTimeline, setNewTimeline] = useState({ year: '', desc_en: '', desc_ru: '' });

  const [editingStatId, setEditingStatId] = useState<number | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [editingTimelineId, setEditingTimelineId] = useState<number | null>(null);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const adminData = localStorage.getItem('admin');
    if (adminData) setAdmin(JSON.parse(adminData));

    loadData();
  }, [token, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Use individual fetches to avoid one failure breaking everything
      const fetchData = async (fn: () => Promise<any>, setter: (data: any) => void, label: string) => {
        try {
          const data = await fn();
          setter(data);
        } catch (err) {
          console.error(`Failed to load ${label}:`, err);
        }
      };

      await Promise.all([
        fetchData(() => api.applicationsApi.getAll(token!), (d) => setApplications(d.sort((a:any, b:any) => b.id - a.id)), 'applications'),
        fetchData(() => api.servicesApi.getAll(token!), setServices, 'services'),
        fetchData(() => api.projectsApi.getAll(token!), setProjects, 'projects'),
        fetchData(() => api.teamApi.getAll(token!), setTeamMembers, 'team'),
        fetchData(() => api.statsApi.getAll(token!), setStats, 'stats'),
        fetchData(() => api.testimonialsApi.getAll(token!), setTestimonials, 'testimonials'),
        fetchData(() => api.partnersApi.getAll(token!), setPartners, 'partners'),
        fetchData(() => api.blogsApi.getAll(token!), setBlogs, 'blogs'),
        fetchData(() => api.faqsApi.getAll(token!), setFaqs, 'faqs'),
        fetchData(() => api.timelinesApi.getAll(token!), setTimelines, 'timelines'),
        fetchData(() => api.settingsApi.getAll(token!), setSettings, 'settings'),
      ]);
      
      console.log('Admin data loading attempt completed');
    } catch (error) {
      console.error('General failure in loadData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current Active Tab:', activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleApplicationStatus = async (id: number, status: string) => {
    try {
      await api.applicationsApi.updateStatus(id, status, token!);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        const updatedService = await api.servicesApi.update(editingServiceId, newService, token!);
        setServices(services.map((s) => (s.id === editingServiceId ? updatedService : s)));
        setEditingServiceId(null);
      } else {
        const addedService = await api.servicesApi.create(newService, token!);
        setServices([...services, addedService]);
      }
      setNewService({ title_en: '', title_ru: '', desc_en: '', desc_ru: '', icon: 'fa-star', image_url: '', is_popular: false });
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleEditServiceSetup = (service: api.Service) => {
    setEditingServiceId(service.id);
    setNewService({
      title_en: service.title_en,
      title_ru: service.title_ru,
      desc_en: service.desc_en,
      desc_ru: service.desc_ru,
      icon: service.icon || 'fa-star',
      image_url: service.image_url || '',
      is_popular: service.is_popular,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjectId) {
        const updatedProject = await api.projectsApi.update(editingProjectId, newProject, token!);
        setProjects(projects.map((p) => (p.id === editingProjectId ? updatedProject : p)));
        setEditingProjectId(null);
      } else {
        const addedProject = await api.projectsApi.create(newProject, token!);
        setProjects([...projects, addedProject]);
      }
      setNewProject({ name: '', city: '', role_en: '', role_ru: '', stars: 5, image_url: '', is_featured: false, category: 'Management' });
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleEditProjectSetup = (project: api.Project) => {
    setEditingProjectId(project.id);
    setNewProject({
      name: project.name,
      city: project.city,
      role_en: project.role_en,
      role_ru: project.role_ru,
      stars: project.stars,
      image_url: project.image_url || '',
      is_featured: project.is_featured,
      category: project.category || 'Management',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.projectsApi.delete(id, token!);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleDeleteApplication = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await api.applicationsApi.delete(id, token!);
      setApplications(applications.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.servicesApi.delete(id, token!);
      setServices(services.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleTeamMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeamMemberId) {
        const updated = await api.teamApi.update(editingTeamMemberId, newTeamMember, token!);
        setTeamMembers(teamMembers.map((m) => (m.id === editingTeamMemberId ? updated : m)));
        setEditingTeamMemberId(null);
      } else {
        const added = await api.teamApi.create(newTeamMember, token!);
        setTeamMembers([...teamMembers, added]);
      }
      setNewTeamMember({ fullname: '', role_en: '', role_ru: '', image_url: '', linkedin: '', email: '' });
    } catch (error) {
      console.error('Failed to save team member:', error);
    }
  };

  const handleEditTeamMemberSetup = (member: api.TeamMember) => {
    setEditingTeamMemberId(member.id);
    setNewTeamMember({
      fullname: member.fullname,
      role_en: member.role_en,
      role_ru: member.role_ru,
      image_url: member.image_url || '',
      linkedin: member.linkedin || '',
      email: member.email || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await api.teamApi.delete(id, token!);
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await api.statsApi.create(newStat, token!);
      setStats([...stats, added]);
      setNewStat({ label_en: '', label_ru: '', value: '', icon: 'fa-star' });
    } catch (err) { console.error(err); }
  };

  const handleEditStatSetup = (stat: api.Stat) => {
    setEditingStatId(stat.id);
    setNewStat({
      label_en: stat.label_en,
      label_ru: stat.label_ru,
      value: stat.value,
      icon: stat.icon || 'fa-star',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStat = async (id: number) => {
    if (window.confirm("Delete stat?")) {
      await api.statsApi.delete(id, token!);
      setStats(stats.filter(s => s.id !== id));
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await api.testimonialsApi.create(newTestimonial, token!);
      setTestimonials([...testimonials, added]);
      setNewTestimonial({ text_en: '', text_ru: '', author: '', position_en: '', position_ru: '', avatar_url: '' });
    } catch (err) { console.error(err); }
  };

  const handleEditTestimonialSetup = (t: api.Testimonial) => {
    setEditingTestimonialId(t.id);
    setNewTestimonial({
      text_en: t.text_en,
      text_ru: t.text_ru,
      author: t.author,
      position_en: t.position_en || '',
      position_ru: t.position_ru || '',
      avatar_url: t.avatar_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (window.confirm("Delete testimonial?")) {
      await api.testimonialsApi.delete(id, token!);
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await api.partnersApi.create(newPartner, token!);
      setPartners([...partners, added]);
      setNewPartner({ name: '', logo_url: '' });
    } catch (err) { console.error(err); }
  };

  const handleEditPartnerSetup = (p: api.Partner) => {
    setEditingPartnerId(p.id);
    setNewPartner({
      name: p.name,
      logo_url: p.logo_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditBlogSetup = (b: api.Blog) => {
    setEditingBlogId(b.id);
    setNewBlog({
      title_en: b.title_en,
      title_ru: b.title_ru,
      content_en: b.content_en,
      content_ru: b.content_ru,
      category: b.category || '',
      image_url: b.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditFaqSetup = (f: api.Faq) => {
    setEditingFaqId(f.id);
    setNewFaq({
      question_en: f.question_en,
      question_ru: f.question_ru,
      answer_en: f.answer_en,
      answer_ru: f.answer_ru,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFaq = async (id: number) => {
      if (window.confirm("Delete faq?")) {
          await api.faqsApi.delete(id, token!);
          setFaqs(faqs.filter(f => f.id !== id));
      }
  };

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const added = await api.timelinesApi.create(newTimeline, token!);
        setTimelines([...timelines, added]);
        setNewTimeline({ year: '', desc_en: '', desc_ru: '' });
    } catch (err) { console.error(err); }
  };

  const handleEditTimelineSetup = (t: api.Timeline) => {
    setEditingTimelineId(t.id);
    setNewTimeline({
      year: t.year,
      desc_en: t.desc_en,
      desc_ru: t.desc_ru,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTimeline = async (id: number) => {
      if (window.confirm("Delete timeline?")) {
          await api.timelinesApi.delete(id, token!);
          setTimelines(timelines.filter(t => t.id !== id));
      }
  };

  const handleDeletePartner = async (id: number) => {
      if (window.confirm("Delete partner?")) {
          await api.partnersApi.delete(id, token!);
          setPartners(partners.filter(p => p.id !== id));
      }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const added = await api.blogsApi.create(newBlog, token!);
          setBlogs([...blogs, added]);
          setNewBlog({ title_en: '', title_ru: '', content_en: '', content_ru: '', category: '', image_url: '' });
      } catch (err) { console.error(err); }
  };

  const handleDeleteBlog = async (id: number) => {
      if (window.confirm("Delete blog?")) {
          await api.blogsApi.delete(id, token!);
          setBlogs(blogs.filter(b => b.id !== id));
      }
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const added = await api.faqsApi.create(newFaq, token!);
          setFaqs([...faqs, added]);
          setNewFaq({ question_en: '', question_ru: '', answer_en: '', answer_ru: '' });
      } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await api.mediaApi.upload(file);
      setUploadedImages([...uploadedImages, result]);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>HotelPro Admin</h2>
          <p>{admin?.username || 'Administrator'}</p>
        </div>

        <nav className="admin-sidebar-nav">
          <button className={activeTab === 'applications' ? 'active' : ''} onClick={() => setActiveTab('applications')}>
            <FaUsers /> Applications {applications.filter(a => a.status === 'pending').length > 0 && (
              <span className="nav-badge">{applications.filter(a => a.status === 'pending').length}</span>
            )}
          </button>
          <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
             <FaBriefcase /> Services
          </button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
             <FaBuilding /> Projects
          </button>
          <button className={activeTab === 'team' ? 'active' : ''} onClick={() => setActiveTab('team')}>
             <FaUserTie /> Team
          </button>
          <button className={activeTab === 'media' ? 'active' : ''} onClick={() => setActiveTab('media')}>
             <FaImage /> Media
          </button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
             <FaChartBar /> Stats
          </button>
          <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>
             <FaQuoteLeft /> Testimonials
          </button>
          <button className={activeTab === 'partners' ? 'active' : ''} onClick={() => setActiveTab('partners')}>
             <FaHandshake /> Partners
          </button>
          <button className={activeTab === 'blogs' ? 'active' : ''} onClick={() => setActiveTab('blogs')}>
             <FaNewspaper /> Blogs
          </button>
          <button className={activeTab === 'faqs' ? 'active' : ''} onClick={() => setActiveTab('faqs')}>
             <FaQuestionCircle /> FAQ
          </button>
          <button className={activeTab === 'timelines' ? 'active' : ''} onClick={() => setActiveTab('timelines')}>
             <FaHistory /> Timeline
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
             <FaCog /> Settings
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>

        <button 
          style={{marginTop: '20px', background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', textAlign: 'center'}}
          onClick={async () => {
             if(window.confirm('Seed demo data?')) {
               await api.systemApi.seedDemo();
               loadData();
             }
          }}
        >
          Seed Demo Data
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'applications' && (
          <div className="tab-content">
            <h2>Applications</h2>
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="app-meta">
                    <div className="app-info">
                      <h3>{app.fullname}</h3>
                      <span>{new Date(app.created_at).toLocaleString()}</span>
                    </div>
                    <span className={`status-tag ${app.status}`}>{app.status}</span>
                  </div>
                  
                  <div className="app-details">
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{app.phone}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{app.email || '—'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Service</label>
                      <p>{app.service_type || 'General'}</p>
                    </div>
                  </div>

                  <p style={{marginBottom: 20, color: '#444'}}>{app.message}</p>

                  <div className="status-buttons">
                    <button className="btn-pending" onClick={() => handleApplicationStatus(app.id, 'pending')}>Pending</button>
                    <button className="btn-processed" onClick={() => handleApplicationStatus(app.id, 'processed')}>Process</button>
                    <button className="btn-rejected" onClick={() => handleApplicationStatus(app.id, 'rejected')}>Reject</button>
                    <button className="btn-delete" onClick={() => handleDeleteApplication(app.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Services</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingServiceId(null); setNewService({title_en: '', title_ru: '', desc_en: '', desc_ru: '', icon: 'fa-star', image_url: '', is_popular: false}); }}>Add New Service</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingServiceId ? 'Edit Service' : 'Create New Service'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleServiceSubmit}>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Title (EN)</label>
                      <input className="admin-input" value={newService.title_en} onChange={(e) => setNewService({ ...newService, title_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Title (RU)</label>
                      <input className="admin-input" value={newService.title_ru} onChange={(e) => setNewService({ ...newService, title_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--2">
                     <div className="input-group">
                      <label>Description (EN)</label>
                      <textarea className="admin-textarea" value={newService.desc_en} onChange={(e) => setNewService({ ...newService, desc_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Description (RU)</label>
                      <textarea className="admin-textarea" value={newService.desc_ru} onChange={(e) => setNewService({ ...newService, desc_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--3">
                    <div className="input-group">
                      <label>Image URL</label>
                      <input className="admin-input" value={newService.image_url} onChange={(e) => setNewService({ ...newService, image_url: e.target.value })} />
                    </div>
                    <div className="input-group">
                       <label>Icon Key</label>
                       <input className="admin-input" value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} />
                    </div>
                    <div className="input-group" style={{display: 'flex', alignItems: 'center', gap: 10, paddingTop: 30}}>
                       <input type="checkbox" checked={newService.is_popular} onChange={(e) => setNewService({ ...newService, is_popular: e.target.checked })} />
                       <label style={{marginBottom: 0}}>Popular</label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingServiceId ? 'Update Service' : 'Add Service'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {services.map((s) => (
                <div key={s.id} className="manage-card">
                  <div className="manage-card__img">
                     <img src={s.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} alt="" />
                  </div>
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 16, marginBottom: 8}}>{s.title_en}</h3>
                    <p style={{fontSize: 13, color: '#64748b'}}>{s.desc_en.substring(0, 100)}...</p>
                    {s.is_popular && <span className="status-tag processed" style={{marginTop: 10, display: 'inline-block'}}>Popular</span>}
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditServiceSetup(s)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteService(s.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Projects</h2>
              <button className="btn btn--primary btn--sm" onClick={() => {setEditingProjectId(null); setNewProject({name: '', city: '', role_en: '', role_ru: '', stars: 5, image_url: '', is_featured: false, category: 'Management'});}}>Add New Project</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingProjectId ? 'Edit Project' : 'Create New Project'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleProjectSubmit}>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Project Name</label>
                      <input className="admin-input" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>City</label>
                      <input className="admin-input" value={newProject.city} onChange={(e) => setNewProject({ ...newProject, city: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--2">
                     <div className="input-group">
                      <label>Role (EN)</label>
                      <input className="admin-input" value={newProject.role_en} onChange={(e) => setNewProject({ ...newProject, role_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Role (RU)</label>
                      <input className="admin-input" value={newProject.role_ru} onChange={(e) => setNewProject({ ...newProject, role_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--4">
                    <div className="input-group">
                      <label>Stars (1-5)</label>
                      <input type="number" min="1" max="5" className="admin-input" value={newProject.stars} onChange={(e) => setNewProject({ ...newProject, stars: parseInt(e.target.value) })} />
                    </div>
                    <div className="input-group">
                      <label>Category</label>
                      <select className="admin-select" value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}>
                        <option value="management">Management</option>
                        <option value="preopening">Pre-Opening</option>
                        <option value="consulting">Consulting</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Image URL</label>
                      <input className="admin-input" value={newProject.image_url} onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })} />
                    </div>
                    <div className="input-group" style={{display: 'flex', alignItems: 'center', gap: 10, paddingTop: 30}}>
                       <input type="checkbox" checked={newProject.is_featured} onChange={(e) => setNewProject({ ...newProject, is_featured: e.target.checked })} />
                       <label style={{marginBottom: 0}}>Featured</label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingProjectId ? 'Update Project' : 'Add Project'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {projects.map((p) => (
                <div key={p.id} className="manage-card">
                  <div className="manage-card__img">
                     <img src={p.image_url || 'https://images.unsplash.com/photo-1551882547-ff43c639f675'} alt="" />
                  </div>
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 16, marginBottom: 8}}>{p.name}</h3>
                    <p style={{fontSize: 13, color: '#64748b'}}>{p.city} • {p.stars} Stars</p>
                    {p.is_featured && <span className="status-tag processed" style={{marginTop: 10, display: 'inline-block'}}>Featured</span>}
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditProjectSetup(p)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteProject(p.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Team Members</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingTeamMemberId(null); setNewTeamMember({fullname: '', role_en: '', role_ru: '', image_url: '', linkedin: '', email: ''}); }}>Add Team Member</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingTeamMemberId ? 'Edit Team Member' : 'Create Team Member'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleTeamMemberSubmit}>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input className="admin-input" value={newTeamMember.fullname} onChange={(e) => setNewTeamMember({ ...newTeamMember, fullname: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Email</label>
                      <input type="email" className="admin-input" value={newTeamMember.email} onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Role (EN)</label>
                      <input className="admin-input" value={newTeamMember.role_en} onChange={(e) => setNewTeamMember({ ...newTeamMember, role_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Role (RU)</label>
                      <input className="admin-input" value={newTeamMember.role_ru} onChange={(e) => setNewTeamMember({ ...newTeamMember, role_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Image URL</label>
                      <input className="admin-input" value={newTeamMember.image_url} onChange={(e) => setNewTeamMember({ ...newTeamMember, image_url: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label>LinkedIn URL</label>
                      <input className="admin-input" value={newTeamMember.linkedin} onChange={(e) => setNewTeamMember({ ...newTeamMember, linkedin: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingTeamMemberId ? 'Update Member' : 'Add Member'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {teamMembers.map((member) => (
                <div key={member.id} className="manage-card">
                  <div className="manage-card__img">
                     <img src={member.image_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'} alt="" />
                  </div>
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 16, marginBottom: 4}}>{member.fullname}</h3>
                    <p style={{fontSize: 13, color: '#64748b'}}>{member.role_en}</p>
                    <div style={{marginTop: 10, fontSize: 12, color: '#94a3b8'}}>
                      {member.email && <div style={{display: 'flex', alignItems: 'center', gap: 6}}><FaEnvelope /> {member.email}</div>}
                    </div>
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditTeamMemberSetup(member)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteTeamMember(member.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Media Manager</h2>
            </div>
            
            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                 <h3 style={{fontSize: 16}}>Upload New Image</h3>
              </div>
              <div className="admin-card-body">
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} id="file-input" />
                  <label htmlFor="file-input" className="file-label">
                    {uploading ? (
                      <div className="flex-center" style={{gap: 12}}><div className="spinner" style={{width: 20, height: 20}}></div> Uploading...</div>
                    ) : (
                      <>
                        <FaImage size={32} style={{marginBottom: 12, opacity: 0.5}} /><br/>
                        <span>Click to browse or drop an image here</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="manage-grid">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="manage-card">
                  <div className="manage-card__img">
                    <img src={img.url} alt={`Uploaded ${idx}`} />
                  </div>
                  <div className="manage-card__body">
                    <p style={{fontSize: 11, color: '#64748b', wordBreak: 'break-all', marginBottom: 12}}>{img.url}</p>
                  </div>
                  <button
                    className="btn-copy"
                    style={{borderRadius: 0}}
                    onClick={() => {
                      navigator.clipboard.writeText(img.url);
                      alert('Copied!');
                    }}
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Statistics</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingStatId(null); setNewStat({label_en: '', label_ru: '', value: '', icon: 'fa-star'}); }}>Add Stat</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingStatId ? 'Edit Stat' : 'Create Stat'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleStatSubmit}>
                  <div className="grid grid--3">
                    <div className="input-group">
                      <label>Value (e.g. 50+)</label>
                      <input className="admin-input" value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Label (EN)</label>
                      <input className="admin-input" value={newStat.label_en} onChange={(e) => setNewStat({ ...newStat, label_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Label (RU)</label>
                      <input className="admin-input" value={newStat.label_ru} onChange={(e) => setNewStat({ ...newStat, label_ru: e.target.value })} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingStatId ? 'Update Stat' : 'Add Stat'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {stats.map((s) => (
                <div key={s.id} className="manage-card">
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 24, fontWeight: 700, color: 'var(--admin-accent)'}}>{s.value}</h3>
                    <p style={{fontSize: 14, color: '#64748b'}}>{s.label_en}</p>
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditStatSetup(s)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteStat(s.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Testimonials</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingTestimonialId(null); setNewTestimonial({text_en: '', text_ru: '', author: '', position_en: '', position_ru: '', avatar_url: ''}); }}>Add Testimonial</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingTestimonialId ? 'Edit Testimonial' : 'Create Testimonial'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleTestimonialSubmit}>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Text (EN)</label>
                      <textarea className="admin-textarea" value={newTestimonial.text_en} onChange={(e) => setNewTestimonial({ ...newTestimonial, text_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Text (RU)</label>
                      <textarea className="admin-textarea" value={newTestimonial.text_ru} onChange={(e) => setNewTestimonial({ ...newTestimonial, text_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--3">
                    <div className="input-group">
                      <label>Author</label>
                      <input className="admin-input" value={newTestimonial.author} onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Position (EN)</label>
                      <input className="admin-input" value={newTestimonial.position_en} onChange={(e) => setNewTestimonial({ ...newTestimonial, position_en: e.target.value })} />
                    </div>
                    <div className="input-group">
                       <label>Avatar URL</label>
                       <input className="admin-input" value={newTestimonial.avatar_url} onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar_url: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingTestimonialId ? 'Update Testimonial' : 'Add Testimonial'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="manage-card">
                  <div className="manage-card__body">
                    <p style={{fontSize: 14, fontStyle: 'italic', marginBottom: 16}}>"{t.text_en.substring(0, 100)}..."</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                       <div style={{width: 32, height: 32, borderRadius: '50%', background: '#eee', overflow: 'hidden'}}><img src={t.avatar_url || 'https://i.pravatar.cc/100'} alt="" style={{width: '100%'}}/></div>
                       <div>
                         <div style={{fontSize: 14, fontWeight: 600}}>{t.author}</div>
                         <div style={{fontSize: 12, color: '#64748b'}}>{t.position_en}</div>
                       </div>
                    </div>
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditTestimonialSetup(t)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteTestimonial(t.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Partners & Brands</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingPartnerId(null); setNewPartner({name: '', logo_url: ''}); }}>Add Partner</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingPartnerId ? 'Edit Partner' : 'Create Partner'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handlePartnerSubmit}>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Partner Name</label>
                      <input className="admin-input" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Logo URL</label>
                      <input className="admin-input" value={newPartner.logo_url} onChange={(e) => setNewPartner({ ...newPartner, logo_url: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingPartnerId ? 'Update Partner' : 'Add Partner'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {partners.map((p) => (
                <div key={p.id} className="manage-card">
                  <div className="manage-card__img" style={{height: 120, background: '#f8fafc', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                     <img src={p.logo_url || 'https://via.placeholder.com/150?text=Partner'} alt="" style={{width: 'auto', maxHeight: '100%'}} />
                  </div>
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 14, fontWeight: 600, textAlign: 'center'}}>{p.name}</h3>
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditPartnerSetup(p)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeletePartner(p.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>Blog Posts</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingBlogId(null); setNewBlog({title_en: '', title_ru: '', content_en: '', content_ru: '', category: '', image_url: ''}); }}>Add Post</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingBlogId ? 'Edit Post' : 'Create Post'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleBlogSubmit}>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Title (EN)</label>
                      <input className="admin-input" value={newBlog.title_en} onChange={(e) => setNewBlog({ ...newBlog, title_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Title (RU)</label>
                      <input className="admin-input" value={newBlog.title_ru} onChange={(e) => setNewBlog({ ...newBlog, title_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Content (EN)</label>
                      <textarea className="admin-textarea" value={newBlog.content_en} onChange={(e) => setNewBlog({ ...newBlog, content_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Content (RU)</label>
                      <textarea className="admin-textarea" value={newBlog.content_ru} onChange={(e) => setNewBlog({ ...newBlog, content_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Category</label>
                      <input className="admin-input" value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label>Image URL</label>
                      <input className="admin-input" value={newBlog.image_url} onChange={(e) => setNewBlog({ ...newBlog, image_url: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingBlogId ? 'Update Post' : 'Add Post'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {blogs.map((b) => (
                <div key={b.id} className="manage-card">
                  <div className="manage-card__img">
                     <img src={b.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643'} alt="" />
                  </div>
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 16, marginBottom: 8}}>{b.title_en}</h3>
                    <p style={{fontSize: 13, color: '#64748b'}}>{b.content_en.substring(0, 80)}...</p>
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditBlogSetup(b)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteBlog(b.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>FAQs</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingFaqId(null); setNewFaq({question_en: '', question_ru: '', answer_en: '', answer_ru: ''}); }}>Add FAQ</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingFaqId ? 'Edit FAQ' : 'Create FAQ'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleFaqSubmit}>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Question (EN)</label>
                      <input className="admin-input" value={newFaq.question_en} onChange={(e) => setNewFaq({ ...newFaq, question_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Question (RU)</label>
                      <input className="admin-input" value={newFaq.question_ru} onChange={(e) => setNewFaq({ ...newFaq, question_ru: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid--2">
                    <div className="input-group">
                      <label>Answer (EN)</label>
                      <textarea className="admin-textarea" value={newFaq.answer_en} onChange={(e) => setNewFaq({ ...newFaq, answer_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Answer (RU)</label>
                      <textarea className="admin-textarea" value={newFaq.answer_ru} onChange={(e) => setNewFaq({ ...newFaq, answer_ru: e.target.value })} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingFaqId ? 'Update FAQ' : 'Add FAQ'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {faqs.map((f) => (
                <div key={f.id} className="manage-card">
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 15, fontWeight: 600, marginBottom: 8}}>{f.question_en}</h3>
                    <p style={{fontSize: 13, color: '#64748b'}}>{f.answer_en.substring(0, 120)}...</p>
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditFaqSetup(f)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteFaq(f.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timelines' && (
          <div className="tab-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32}}>
              <h2>History Timeline</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingTimelineId(null); setNewTimeline({year: '', desc_en: '', desc_ru: ''}); }}>Add Event</button>
            </div>

            <div className="admin-card" style={{marginBottom: 40}}>
              <div className="admin-card-header">
                <h3 style={{fontSize: 16}}>{editingTimelineId ? 'Edit Event' : 'Create Event'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleTimelineSubmit}>
                  <div className="grid grid--3">
                    <div className="input-group">
                      <label>Year</label>
                      <input className="admin-input" value={newTimeline.year} onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Description (EN)</label>
                      <input className="admin-input" value={newTimeline.desc_en} onChange={(e) => setNewTimeline({ ...newTimeline, desc_en: e.target.value })} required />
                    </div>
                    <div className="input-group">
                      <label>Description (RU)</label>
                      <input className="admin-input" value={newTimeline.desc_ru} onChange={(e) => setNewTimeline({ ...newTimeline, desc_ru: e.target.value })} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn--primary">{editingTimelineId ? 'Update Event' : 'Add Event'}</button>
                </form>
              </div>
            </div>

            <div className="manage-grid">
              {timelines.map((t) => (
                <div key={t.id} className="manage-card">
                  <div className="manage-card__body">
                    <h3 style={{fontSize: 18, fontWeight: 700}}>{t.year}</h3>
                    <p style={{fontSize: 14, color: '#64748b'}}>{t.desc_en}</p>
                  </div>
                  <div className="manage-card__actions">
                    <button className="icon-btn icon-btn--edit" onClick={() => handleEditTimelineSetup(t)}><FaEdit /></button>
                    <button className="icon-btn icon-btn--delete" onClick={() => handleDeleteTimeline(t.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h2>Global Settings</h2>
            <div className="admin-card">
               <div className="admin-card-header">
                  <h3 style={{fontSize: 16}}>Platform Configuration</h3>
               </div>
               <div className="admin-card-body">
                  <form className="admin-form" onSubmit={async (e) => {
                    e.preventDefault();
                    const key = 'hero_title';
                    const valEn = (e.currentTarget.elements.namedItem('en') as HTMLInputElement).value;
                    const valRu = (e.currentTarget.elements.namedItem('ru') as HTMLInputElement).value;
                    await api.settingsApi.update({ key, value_en: valEn, value_ru: valRu }, token!);
                    alert('Settings Updated Successfully!');
                  }}>
                    <div className="grid grid--2">
                      <div className="input-group">
                        <label>Hero Title (EN)</label>
                        <input name="en" className="admin-input" defaultValue={settings.find(s => s.key === 'hero_title')?.value_en} />
                      </div>
                      <div className="input-group">
                        <label>Hero Title (RU)</label>
                        <input name="ru" className="admin-input" defaultValue={settings.find(s => s.key === 'hero_title')?.value_ru} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn--primary"><FaSave /> Save All Settings</button>
                  </form>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
