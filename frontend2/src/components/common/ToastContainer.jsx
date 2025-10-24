import { useState, useCallback, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Toast from './Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    addToast(message, 'error', duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    addToast(message, 'warning', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    addToast(message, 'info', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      
      {/* Contenedor de Toasts */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
