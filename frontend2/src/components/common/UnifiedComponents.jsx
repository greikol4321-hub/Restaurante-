/**
 * Componentes UI reutilizables con diseño unificado
 * Importa estos componentes para mantener consistencia en toda la aplicación
 */

import PropTypes from 'prop-types';
import PageLayout from './PageLayout';

/* ==================== BOTONES ==================== */

/**
 * Botón Primario - Dorado con texto negro
 */
export const ButtonPrimary = ({ children, onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary ${className}`}
    >
      {children}
    </button>
  );
};

ButtonPrimary.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

/**
 * Botón Secundario - Borde dorado con fondo transparente
 */
export const ButtonSecondary = ({ children, onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-secondary ${className}`}
    >
      {children}
    </button>
  );
};

ButtonSecondary.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

/**
 * Botón Outline - Borde dorado 2px
 */
export const ButtonOutline = ({ children, onClick, disabled, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-outline ${className}`}
    >
      {children}
    </button>
  );
};

ButtonOutline.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

/* ==================== TARJETAS ==================== */

/**
 * Card Básica - Fondo oscuro con borde dorado
 */
export const Card = ({ children, className = '', animate = false }) => {
  const animationClass = animate ? 'animate-fade-in' : '';
  return (
    <div className={`card ${animationClass} ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
};

/**
 * Card Interactiva - Con efecto hover elevado
 */
export const CardInteractive = ({ children, onClick, className = '', animate = false }) => {
  const animationClass = animate ? 'animate-scale-in' : '';
  return (
    <div 
      onClick={onClick}
      className={`card-interactive ${animationClass} ${className}`}
    >
      {children}
    </div>
  );
};

CardInteractive.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  animate: PropTypes.bool,
};

/* ==================== BADGES ==================== */

/**
 * Badge de Estado
 */
export const Badge = ({ children, variant = 'gold', className = '' }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    gold: 'badge-gold',
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'gold']),
  className: PropTypes.string,
};

/* ==================== INPUTS ==================== */

/**
 * Input de Formulario
 */
export const Input = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  className = '' 
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`input-elegant ${className}`}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Textarea de Formulario
 */
export const Textarea = ({ 
  name, 
  value, 
  onChange, 
  placeholder, 
  rows = 4,
  required = false,
  disabled = false,
  className = '' 
}) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      disabled={disabled}
      className={`input-elegant ${className}`}
    />
  );
};

Textarea.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

/* ==================== TÍTULOS ==================== */

/**
 * Título de Sección con línea decorativa
 */
export const SectionTitle = ({ children, className = '', animate = false }) => {
  const animationClass = animate ? 'animate-fade-in' : '';
  return (
    <h2 className={`section-title ${animationClass} ${className}`}>
      {children}
    </h2>
  );
};

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
};

/**
 * Título Principal con brillo
 */
export const PageTitle = ({ children, className = '' }) => {
  return (
    <h1 className={`text-3xl md:text-4xl font-title font-bold text-[#ffffff] text-shimmer ${className}`}>
      {children}
    </h1>
  );
};

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/* ==================== CONTENEDORES ==================== */

/**
 * Contenedor Principal de Página
 * Ahora usa PageLayout internamente para consistencia
 */
export const PageContainer = ({ children, className = '' }) => {
  return (
    <PageLayout className={className}>
      {children}
    </PageLayout>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Contenedor de Contenido (max-width centrado)
 */
export const ContentContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

ContentContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/* ==================== SPINNERS Y LOADING ==================== */

/**
 * Spinner de Carga
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  return (
    <div className={`animate-spin rounded-full border-4 border-t-[#d4af37] border-r-transparent border-b-[#c5a028] border-l-transparent mx-auto ${sizes[size]} ${className}`} />
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

/**
 * Pantalla de Carga Completa
 */
export const LoadingScreen = ({ message = 'Cargando...' }) => {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="mt-6 text-[#bfbfbf] text-lg">{message}</p>
      </div>
    </PageContainer>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
};

/* ==================== ALERTAS ==================== */

/**
 * Alerta de Error
 */
export const ErrorAlert = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/30 backdrop-blur-sm rounded-2xl px-6 py-5 text-red-400 ${className}`}>
      <p className="font-medium mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all duration-300 hover:scale-105"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Alerta de Éxito
 */
export const SuccessAlert = ({ message, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-green-900/20 to-green-800/10 border-2 border-green-500/30 backdrop-blur-sm rounded-2xl px-6 py-5 text-green-400 ${className}`}>
      <p className="font-medium">{message}</p>
    </div>
  );
};

SuccessAlert.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

/* ==================== GRIDS RESPONSIVE ==================== */

/**
 * Grid Responsive (1-2-3 columnas)
 */
export const GridResponsive = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

GridResponsive.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Grid de 2 Columnas
 */
export const GridTwoColumns = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

GridTwoColumns.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/* ==================== DIVIDERS ==================== */

/**
 * Línea Divisora Dorada
 */
export const Divider = ({ className = '' }) => {
  return (
    <div className={`w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent ${className}`} />
  );
};

Divider.propTypes = {
  className: PropTypes.string,
};

export default {
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  Card,
  CardInteractive,
  Badge,
  Input,
  Textarea,
  SectionTitle,
  PageTitle,
  PageContainer,
  ContentContainer,
  LoadingSpinner,
  LoadingScreen,
  ErrorAlert,
  SuccessAlert,
  GridResponsive,
  GridTwoColumns,
  Divider,
};
