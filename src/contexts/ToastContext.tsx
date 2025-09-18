'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000, // 5 seconds default
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onHide: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onHide }) => {
  
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-[99999] space-y-2 max-w-sm w-full sm:max-w-sm sm:w-auto pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onHide={onHide} />
        </div>
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-accent-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary-600" />;
      default:
        return <Info className="h-5 w-5 text-primary-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-vintage-cream border-accent-200 shadow-lg';
      case 'error':
        return 'bg-red-50 border-red-300 shadow-lg';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300 shadow-lg';
      case 'info':
        return 'bg-vintage-cream border-primary-300 shadow-lg';
      default:
        return 'bg-vintage-cream border-primary-300 shadow-lg';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-primary-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-primary-800';
      default:
        return 'text-primary-800';
    }
  };

  return (
    <div
      className={`
        ${getBackgroundColor()}
        border-2 rounded-xl p-4 transition-all duration-300 ease-in-out
        transform translate-x-0 opacity-100 backdrop-blur-sm
        hover:shadow-xl hover:scale-105
        font-display
      `}
      style={{
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm ${getTextColor()} tracking-wide`}>
            {toast.title}
          </h4>
          {toast.message && (
            <p className={`text-xs mt-1 ${getTextColor()} opacity-80 leading-relaxed`}>
              {toast.message}
            </p>
          )}
        </div>

        <button
          onClick={() => onHide(toast.id)}
          className={`
            flex-shrink-0 ml-2 p-1.5 rounded-full hover:bg-primary-100
            transition-all duration-200 hover:scale-110
            ${getTextColor()} opacity-50 hover:opacity-100
          `}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

