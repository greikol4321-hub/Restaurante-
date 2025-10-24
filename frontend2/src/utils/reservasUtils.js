// Función para filtrar reservas activas/históricas
export const filtrarReservasPorEstado = (reservas, mostrarHistoricas = false) => {
  return reservas.filter((reserva) => {
    const esHistorica = reserva.estado === 'COMPLETADA' || reserva.estado === 'CANCELADA';
    return mostrarHistoricas ? esHistorica : !esHistorica;
  });
};

// Función para filtrar reservas por fecha
export const filtrarReservasPorFecha = (reservas, fecha) => {
  if (!fecha) return reservas;
  
  return reservas.filter((reserva) => 
    new Date(reserva.fechaReserva).toLocaleDateString() === new Date(fecha).toLocaleDateString()
  );
};

// Función para filtrar reservas por estado específico
export const filtrarReservasPorEstadoEspecifico = (reservas, estado) => {
  if (estado === 'todos') return reservas;
  
  return reservas.filter((reserva) => reserva.estado === estado);
};

// Función combinada para aplicar todos los filtros
export const aplicarFiltrosReservas = (reservas, { mostrarHistoricas = false, fecha = null, estado = 'todos' }) => {
  let reservasFiltradas = filtrarReservasPorEstado(reservas, mostrarHistoricas);
  
  if (fecha) {
    reservasFiltradas = filtrarReservasPorFecha(reservasFiltradas, fecha);
  }
  
  if (estado !== 'todos') {
    reservasFiltradas = filtrarReservasPorEstadoEspecifico(reservasFiltradas, estado);
  }
  
  return reservasFiltradas;
};