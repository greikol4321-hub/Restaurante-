import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Componente Toast para mostrar notificaciones al usuario
 */
const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-gradient-to-r from-green-900/90 to-green-800/90',
      border: 'border-green-500/50',
      icon: FaCheckCircle,
      iconColor: 'text-green-400',
      title: '¡Éxito!'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-900/90 to-red-800/90',
      border: 'border-red-500/50',
      icon: FaExclamationCircle,
      iconColor: 'text-red-400',
      title: 'Error'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-900/90 to-yellow-800/90',
      border: 'border-yellow-500/50',
      icon: FaExclamationCircle,
      iconColor: 'text-yellow-400',
      title: 'Advertencia'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-900/90 to-blue-800/90',
      border: 'border-blue-500/50',
      icon: FaInfoCircle,
      iconColor: 'text-blue-400',
      title: 'Información'
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div 
      className={`${config.bg} ${config.border} border rounded-lg p-3 shadow-xl backdrop-blur-sm animate-slide-up min-w-[250px] max-w-sm`}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <Icon className={`${config.iconColor} text-lg flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className="font-semibold text-[#ffffff] text-sm mb-0.5">{config.title}</h4>
          <p className="text-xs text-[#ffffff]/90 leading-snug">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[#ffffff]/70 hover:text-[#ffffff] transition-colors text-sm"
          aria-label="Cerrar notificación"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
