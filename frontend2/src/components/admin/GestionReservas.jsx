import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaCalendar } from 'react-icons/fa';
import Header from './Header';
import { reservasApi } from '../../utils/api';
import { useToast } from '../common/ToastContainer';
import PageLayout from '../common/PageLayout';

const EstadoButton = ({ estado, estadoActual, onClick }) => {
  const getColor = () => {
    switch (estado) {
      case 'CONFIRMADA':
        return estadoActual === estado
          ? 'bg-green-600/30 border-green-500 text-green-400'
          : 'bg-[#1a1a1a] border-[#c5a028]/30 text-[#bfbfbf] hover:border-green-500';
      case 'COMPLETADA':
        return estadoActual === estado
          ? 'bg-blue-600/30 border-blue-500 text-blue-400'
          : 'bg-[#1a1a1a] border-[#c5a028]/30 text-[#bfbfbf] hover:border-blue-500';
      case 'CANCELADA':
        return estadoActual === estado
          ? 'bg-red-600/30 border-red-500 text-red-400'
          : 'bg-[#1a1a1a] border-[#c5a028]/30 text-[#bfbfbf] hover:border-red-500';
      default:
        return estadoActual === estado
          ? 'bg-[#d4af37]/30 border-[#d4af37] text-[#d4af37]'
          : 'bg-[#1a1a1a] border-[#c5a028]/30 text-[#bfbfbf] hover:border-[#d4af37]';
    }
  };

  return (
    <button
      onClick={() => onClick(estado)}
      className={`${getColor()} border px-4 py-2 rounded-full text-sm font-semibold transition-all`}
    >
      {estado}
    </button>
  );
};

EstadoButton.propTypes = {
  estado: PropTypes.string.isRequired,
  estadoActual: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DetallesReservaModal = ({ reserva, onClose }) => {
  if (!reserva) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0b0b0b] border border-[#c5a028]/30 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-title text-[#d4af37] mb-6">Detalles de la Reserva</h2>

        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-[#c5a028]/20 rounded-lg p-4 space-y-2">
            <p className="text-[#bfbfbf]">
              <span className="text-[#d4af37] font-semibold">Cliente:</span>{' '}
              {`${reserva?.usuarioNombre || ''} ${reserva?.usuarioApellido || ''}`}
            </p>
            <p className="text-[#bfbfbf]">
              <span className="text-[#d4af37] font-semibold">ID Usuario:</span> {reserva?.usuarioId}
            </p>
            <p className="text-[#bfbfbf]">
              <span className="text-[#d4af37] font-semibold">Teléfono:</span> {reserva?.telefono}
            </p>
            <p className="text-[#bfbfbf]">
              <span className="text-[#d4af37] font-semibold">Fecha:</span>{' '}
              {reserva?.fechaReserva ? new Date(reserva.fechaReserva).toLocaleDateString() : ''}
            </p>
            <p className="text-[#bfbfbf]">
              <span className="text-[#d4af37] font-semibold">Personas:</span> {reserva?.numeroPersonas}
            </p>
            <p className="text-[#bfbfbf]">
              <span className="text-[#d4af37] font-semibold">Estado:</span> {reserva?.estado}
            </p>
            {reserva?.notas && (
              <div className="mt-3 pt-3 border-t border-[#c5a028]/30">
                <p className="text-[#d4af37] font-semibold mb-2">Notas:</p>
                <p className="text-[#ffffff]">{reserva.notas}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#d4af37] text-[#000000] font-semibold rounded-full 
                     hover:scale-105 transition-transform"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

DetallesReservaModal.propTypes = {
  reserva: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

const GestionReservas = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const obtenerReservas = async () => {
    try {
      setLoading(true);
      const response = await reservasApi.listarReservas();
      setReservas(response.data);
      setError('');
      
      if (response.data.length === 0) {
        showInfo('No hay reservas registradas');
      }
    } catch (err) {
      const errorMsg = 'Error al cargar las reservas';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  const cambiarEstado = async (reservaId, nuevoEstado) => {
    try {
      showInfo(`Actualizando estado a ${nuevoEstado}...`);
      await reservasApi.actualizarEstado(reservaId, nuevoEstado);
      showSuccess(`Reserva actualizada a estado: ${nuevoEstado}`);
      await obtenerReservas();
      setError('');
    } catch (err) {
      const errorMsg = 'Error al actualizar el estado de la reserva';
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  const filtrarReservas = () => {
    // Primero separamos las reservas según si son históricas o activas
    const reservasFiltradas = mostrarHistorial
      ? reservas.filter((reserva) => reserva.estado === 'COMPLETADA' || reserva.estado === 'CANCELADA')
      : reservas.filter((reserva) => reserva.estado !== 'COMPLETADA' && reserva.estado !== 'CANCELADA');

    // Luego aplicamos los filtros de estado y fecha
    return reservasFiltradas.filter((reserva) => {
      const cumpleFiltroEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado;
      const cumpleFiltroFecha =
        !filtroFecha ||
        new Date(reserva.fechaReserva).toLocaleDateString() === new Date(filtroFecha).toLocaleDateString();

      return cumpleFiltroEstado && cumpleFiltroFecha;
    });
  };

  return (
    <PageLayout>
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto animate-slideInUp">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-title text-[#d4af37]">Gestión de Reservas</h1>
            <button
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              className="px-6 py-3 bg-[#1a1a1a] border border-[#c5a028]/30 rounded-xl
                       text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors duration-200"
            >
              {mostrarHistorial ? "Ver Reservas Activas" : "Ver Historial"}
            </button>
          </div>

          {error && (
            <div className="bg-red-600/10 border-2 border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-6
                          flex items-center gap-3 animate-[slideDown_0.3s_ease-out]">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl"></span>
              </div>
              <p className="flex-1 text-lg font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-600/10 border-2 border-green-500/50 text-green-400 px-6 py-4 rounded-xl mb-6
                          flex items-center gap-3 animate-[slideDown_0.3s_ease-out]">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl"></span>
              </div>
              <p className="flex-1 text-lg font-semibold">{success}</p>
            </div>
          )}

          <div className="bg-[#0b0b0b] border border-[#c5a028]/30 p-6 rounded-xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="filtroFecha"
                  className="block text-sm font-medium text-[#d4af37] mb-2"
                >
                  Fecha
                </label>
                <div className="relative">
                  <FaCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#d4af37]" />
                  <input
                    id="filtroFecha"
                    type="date"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#c5a028]/30 
                             text-[#ffffff] focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="filtroEstado"
                  className="block text-sm font-medium text-[#d4af37] mb-2"
                >
                  Estado
                </label>
                <select
                  id="filtroEstado"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#c5a028]/30 
                           text-[#ffffff] focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADA">Confirmada</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-600/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent 
                              rounded-full animate-spin"></div>
              </div>
              <p className="text-[#bfbfbf] text-lg">Cargando reservas...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtrarReservas().map((reserva) => (
                <div key={reserva.id} className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                                               border-2 border-[#c5a028]/20 hover:border-[#d4af37]/60 
                                               rounded-2xl p-6 transition-all duration-300
                                               shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                                               hover:shadow-[0_8px_32px_rgba(212,175,55,0.2)]
                                               hover:scale-[1.01] overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full 
                                blur-3xl group-hover:bg-[#d4af37]/10 transition-colors duration-300"></div>
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#c5a028] 
                                      flex items-center justify-center shadow-lg">
                          <span className="text-[#000000] font-black text-2xl"></span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-[#d4af37] 
                                       transition-colors duration-300">
                            Reserva #{reserva.id}
                          </h3>
                          <p className="text-[#bfbfbf] text-sm mt-1">
                            <span className="text-[#d4af37] font-semibold"> Cliente:</span>{' '}
                            {`${reserva.usuarioNombre} ${reserva.usuarioApellido}`}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#0b0b0b]/50 border border-[#c5a028]/20 rounded-xl p-3">
                          <p className="text-[#888888] text-xs uppercase tracking-wider mb-1"> Fecha</p>
                          <p className="text-[#ffffff] text-sm font-bold">
                            {new Date(reserva.fechaReserva).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-[#0b0b0b]/50 border border-[#c5a028]/20 rounded-xl p-3">
                          <p className="text-[#888888] text-xs uppercase tracking-wider mb-1"> Teléfono</p>
                          <p className="text-[#d4af37] text-sm font-bold">{reserva.telefono}</p>
                        </div>
                        <div className="bg-[#0b0b0b]/50 border border-[#c5a028]/20 rounded-xl p-3">
                          <p className="text-[#888888] text-xs uppercase tracking-wider mb-1"> Personas</p>
                          <p className="text-[#ffffff] text-sm font-bold">{reserva.numeroPersonas}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setReservaSeleccionada(reserva)}
                      className="p-4 bg-gradient-to-br from-[#d4af37]/20 to-[#c5a028]/20 
                               border-2 border-[#d4af37]/50 text-[#d4af37] rounded-2xl 
                               hover:border-[#d4af37] hover:scale-110 transition-all duration-300
                               shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                      title="Ver detalles"
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative z-10 pt-4 border-t-2 border-[#c5a028]/20">
                    <p className="text-[#888888] text-xs uppercase tracking-wider mb-3">Cambiar Estado</p>
                    <div className="flex flex-wrap gap-2">
                      <EstadoButton
                        estado="PENDIENTE"
                        estadoActual={reserva.estado}
                        onClick={(estado) => cambiarEstado(reserva.id, estado)}
                      />
                      <EstadoButton
                        estado="CONFIRMADA"
                        estadoActual={reserva.estado}
                        onClick={(estado) => cambiarEstado(reserva.id, estado)}
                      />
                      <EstadoButton
                        estado="COMPLETADA"
                        estadoActual={reserva.estado}
                        onClick={(estado) => cambiarEstado(reserva.id, estado)}
                      />
                      <EstadoButton
                        estado="CANCELADA"
                        estadoActual={reserva.estado}
                        onClick={(estado) => cambiarEstado(reserva.id, estado)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DetallesReservaModal
        reserva={reservaSeleccionada}
        onClose={() => setReservaSeleccionada(null)}
      />
    </PageLayout>
  );
};

export default GestionReservas;
