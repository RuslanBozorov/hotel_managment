import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaHotel, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './ProjectCard.css';

interface Project {
  id?: number | string;
  name: string;
  city: string;
  stars: number;
  role?: string;
  role_en?: string;
  role_ru?: string;
  category?: string;
  image_url?: string | null;
}

interface ProjectCardProps {
  project?: Project;
  lang: string;
  isSkeleton?: boolean;
  hideFooter?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang, isSkeleton = false, hideFooter = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/contact');
  };

  const handleEnquireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/contact');
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (isSkeleton || !project) {
    return (
      <div className={`project-card project-card--skeleton ${hideFooter ? 'project-card--no-footer' : ''}`}>
        <div className="project-card__glass" style={{ marginBottom: '24px', background: 'var(--color-primary)' }}>
           <div className="skeleton-box" style={{ width: '40%', marginBottom: '10px' }}></div>
           <div className="skeleton-box" style={{ width: '70%', height: '20px' }}></div>
        </div>
      </div>
    );
  }

  const localizedRole = lang === 'ru' 
    ? (project.role_ru || project.role) 
    : (project.role_en || project.role);

  /* CSS handles visual truncation via line-clamp.
     JS only checks if text is "long enough" to warrant a toggle button. */
  const TOGGLE_THRESHOLD = 80;
  const isLongText = localizedRole && localizedRole.length > TOGGLE_THRESHOLD;

  return (
    <div 
      className={`project-card ${isExpanded ? 'project-card--expanded' : ''}`}
      onClick={handleCardClick}
    >
      <div className="project-card__header">
        <div className="project-card__image-container">
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.name} 
              loading="lazy" 
              className="card-img-resilient"
            />
          ) : (
            <div className="card-img-resilient" style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#ffffff', color: '#cbd5e1', fontSize: '3rem'
            }}>
              <FaHotel />
            </div>
          )}
        </div>
        
        {/* Stars Badge */}
        <div className="project-card__badges">
          <div className="project-card__stars-badge">
            {[...Array(project.stars || 5)].map((_, j) => (
              <FaStar key={j} />
            ))}
          </div>
          
          <div className="project-card__location-badge">
            <FaMapMarkerAlt />
            {project.city}
          </div>
        </div>
      </div>

      {/* Info Block */}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.name}</h3>
        {localizedRole && (
          <div className="project-card__description-wrap">
            <p className="project-card__description">{localizedRole}</p>
            {isLongText && (
              <button 
                className="project-card__toggle-btn"
                onClick={handleToggleClick}
              >
                {isExpanded ? (
                  <>{lang === 'ru' ? 'Свернуть' : 'Show Less'} <FaChevronUp /></>
                ) : (
                  <>{lang === 'ru' ? 'Подробнее' : 'Learn More'} <FaChevronDown /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!hideFooter && (
        <div className="project-card__footer">
          <span className="project-card__status">{lang === 'ru' ? 'Связь с отелем' : 'Booking - Availability'}</span>
          <button className="project-card__btn-enquire" onClick={handleEnquireClick}>{lang === 'ru' ? 'Оставить заявку' : 'Enquire'}</button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
