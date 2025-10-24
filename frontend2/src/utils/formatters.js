// Formateador para montos en colones
export const formatColones = (amount) => {
  // Si el monto es undefined o null, retorna '₡0'
  if (amount == null) return '₡0';
  
  // Convierte a número si es string
  const numero = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Formatea el número con separadores de miles y dos decimales
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
};