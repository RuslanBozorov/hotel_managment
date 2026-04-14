import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <FaCheckCircle style={{ color: '#10b981' }} />;
      case 'error': return <FaExclamationCircle style={{ color: '#ef4444' }} />;
      default: return <FaInfoCircle style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: 'white', border: '1px solid var(--adm-border)',
      borderRadius: '12px', padding: '16px 20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      display: 'flex', alignItems: 'center', gap: '12px',
      zIndex: 9999, animation: 'toastSlideIn 0.3s ease-out forwards',
      maxWidth: '400px'
    }}>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{ fontSize: '1.25rem' }}>{getIcon()}</div>
      <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: '#111' }}>{message}</div>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
