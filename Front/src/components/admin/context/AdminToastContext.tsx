import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface AdminToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const AdminToastContext = createContext<AdminToastContextType | undefined>(undefined);

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) throw new Error('useAdminToast must be used within AdminToastProvider');
  return context;
};

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}
      <div className="adm-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`adm-toast adm-toast--${toast.type}`}>
            <div className="adm-toast__icon">
              {toast.type === 'success' && <FaCheckCircle />}
              {toast.type === 'error' && <FaExclamationCircle />}
              {toast.type === 'info' && <FaInfoCircle />}
            </div>
            <div className="adm-toast__message">{toast.message}</div>
            <button className="adm-toast__close" onClick={() => removeToast(toast.id)}>
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        .adm-toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 9999;
        }
        .adm-toast {
          min-width: 300px;
          padding: 16px;
          border-radius: 12px;
          background: var(--adm-card-bg);
          border: 1px solid var(--adm-border);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 12px;
          animation: toast-in 0.3s ease-out forwards;
        }
        .adm-toast--success { border-left: 4px solid var(--adm-success); }
        .adm-toast--error { border-left: 4px solid var(--adm-error); }
        .adm-toast--info { border-left: 4px solid var(--adm-primary); }
        
        .adm-toast__icon { font-size: 1.2rem; }
        .adm-toast--success .adm-toast__icon { color: var(--adm-success); }
        .adm-toast--error .adm-toast__icon { color: var(--adm-error); }
        .adm-toast--info .adm-toast__icon { color: var(--adm-primary); }
        
        .adm-toast__message { flex: 1; font-size: 0.9rem; font-weight: 500; }
        .adm-toast__close { background: none; border: none; color: var(--adm-text-muted); cursor: pointer; padding: 4px; }
        
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </AdminToastContext.Provider>
  );
};
