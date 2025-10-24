import React from 'react';
import PropTypes from 'prop-types';

/**
 * Layout unificado para todas las páginas del sistema
 * Características:
 * - Fondo negro con degradado dorado sutil
 * - Animaciones suaves consistentes
 * - Efectos de resplandor dorado
 * - Padding uniforme para header
 */
const PageLayout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#1a1200] relative overflow-x-hidden ${className}`}>
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Resplandor dorado superior */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Resplandor dorado inferior derecho */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        {/* Líneas decorativas sutiles */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent opacity-20"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default PageLayout;
