import React from 'react';
import { FaUpload, FaFolderPlus, FaTrash, FaFileImage, FaFileAlt, FaVideo, FaSearch, FaEllipsisV } from 'react-icons/fa';

const MediaManager: React.FC = () => {
  const files = [
    { id: 1, name: 'hero-bg.jpg', type: 'image', size: '1.2 MB', date: '2024-04-10' },
    { id: 2, name: 'logo-dark.png', type: 'image', size: '45 KB', date: '2024-04-09' },
    { id: 3, name: 'intro-video.mp4', type: 'video', size: '12.8 MB', date: '2024-04-08' },
    { id: 4, name: 'annual-report.pdf', type: 'file', size: '2.1 MB', date: '2024-04-05' },
    { id: 5, name: 'services-icon.svg', type: 'image', size: '12 KB', date: '2024-04-02' },
    { id: 6, name: 'team-photo.jpg', type: 'image', size: '3.4 MB', date: '2024-03-28' },
    { id: 7, name: 'client-testimonial.mp3', type: 'file', size: '1.8 MB', date: '2024-03-25' },
    { id: 8, name: 'favicon.ico', type: 'image', size: '8 KB', date: '2024-03-20' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <FaFileImage style={{ color: '#3b82f6' }} />;
      case 'video': return <FaVideo style={{ color: '#8b5cf6' }} />;
      default: return <FaFileAlt style={{ color: '#6b7280' }} />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="adm-heading">Media Manager</h1>
          <p className="adm-subheading" style={{ marginBottom: 0 }}>Organize and manage your website assets.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="adm-btn adm-btn-outline"><FaFolderPlus /> New Folder</button>
          <button className="adm-btn adm-btn-primary"><FaUpload /> Upload Files</button>
        </div>
      </div>

      <div className="adm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-text-muted)' }} />
            <input type="text" className="adm-input" placeholder="Search files..." style={{ paddingLeft: '40px' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select className="adm-input" style={{ width: 'auto' }}>
              <option>All Assets</option>
              <option>Images</option>
              <option>Videos</option>
              <option>Documents</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {files.map((file) => (
            <div key={file.id} className="adm-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              <div style={{ 
                height: '140px', background: 'var(--adm-sidebar-active-bg)', 
                borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', opacity: 0.8
              }}>
                {getIcon(file.type)}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: '4px' }}>
                  {file.size} • {file.date}
                </div>
              </div>
              <button style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'var(--adm-text-muted)', cursor: 'pointer' }}>
                <FaEllipsisV />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaManager;
