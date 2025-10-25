import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosApi } from '../../utils/api';
import HeaderUsuario from './HeaderUsuario';
import PageLayout from '../common/PageLayout';

const PedidosUsuario = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    try {
      const userDataStr = sessionStorage.getItem('user');
      
      if (!userDataStr) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(userDataStr);

      if (!userData?.id) {
        navigate('/login');
        return;
      }

      setUser(userData);
      fetchPedidos(userData.id);
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchPedidos = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pedidosApi.listarPedidosPorUsuario(userId);
      
      if (response && Array.isArray(response)) {
        setPedidos(response);
      } else if (response && Array.isArray(response.data)) {
        setPedidos(response.data);
      } else {
        setPedidos([]);
        setError('No se pudieron cargar los pedidos correctamente.');
      }
    } catch (err) {
      setError('Error al cargar los pedidos. Por favor, intente nuevamente.');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm('¿Está seguro que desea cancelar este pedido?')) {
      return;
    }

    try {
      await pedidosApi.cancelarPedido(pedidoId);
      setSuccess('Pedido cancelado exitosamente');
      fetchPedidos(user.id); // Recargar lista
    } catch (err) {
      setError('Error al cancelar el pedido. Por favor, intente nuevamente.');
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'EN_PROCESO':
        return 'bg-blue-500/20 text-blue-500';
      case 'COMPLETADO':
        return 'bg-green-500/20 text-green-500';
      case 'CANCELADO':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const handleVerDetalles = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMostrarModal(true);
  };

  // Eliminar duplicados basados en el ID
  const uniquePedidos = pedidos?.reduce((acc, current) => {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []) || [];

  // Filtrar por fecha si hay una fecha seleccionada
  const filteredPedidos = searchDate
    ? pedidos.filter(pedido => {
        if (!pedido?.fechaPedido) return false;
        // Crear fecha sin conversión de zona horaria
        const fecha = new Date(pedido.fechaPedido);
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const fechaPedido = `${year}-${month}-${day}`;
        return fechaPedido === searchDate;
      })
    : pedidos;

  return (
    <PageLayout>
      <HeaderUsuario />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border border-[#d4af37]/30 p-8 rounded-3xl shadow-gold-lg animate-slideInUp">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-title font-bold text-[#d4af37] mb-2">
                Mis Pedidos
              </h1>
              <p className="text-[#bfbfbf]">
                Historial y estado de tus pedidos
              </p>
            </div>
            
            {/* Contador de pedidos */}
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg px-4 py-2">
              <span className="text-[#bfbfbf]">Total de pedidos: </span>
              <span className="text-[#d4af37] font-semibold">
                {searchDate ? `${filteredPedidos?.length || 0} de ${pedidos?.length || 0}` : `${pedidos?.length || 0}`}
              </span>
            </div>
          </div>

          {/* Filtro por fecha */}
          <div className="mb-6">
            <div className="relative inline-block">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-[#d4af37]/30 bg-[#1a1a1a] text-[#ffffff] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] placeholder-[#888888] transition-colors"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {searchDate && (
                <button
                  onClick={() => setSearchDate('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d4af37] hover:text-[#f4d47b] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="mb-4 p-4 bg-red-600/10 border border-red-500 text-red-400 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-600/10 border border-green-500 text-green-400 rounded-xl">
              {success}
            </div>
          )}

          {/* Contenido principal */}
          {(() => {
            if (loading) {
              return (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
                </div>
              );
            }
            
            if (!pedidos?.length) {
              return (
                <div className="text-center py-8">
                  <p className="text-[#bfbfbf] text-lg">No tienes pedidos activos</p>
                  <p className="text-[#bfbfbf]/60 mt-2">Tus pedidos aparecerán aquí cuando realices uno</p>
                </div>
              );
            }
            
            if (searchDate && filteredPedidos.length === 0) {
              return (
                <div className="text-center py-8">
                  <p className="text-[#bfbfbf] text-lg">No hay pedidos para la fecha seleccionada</p>
                  <p className="text-[#bfbfbf]/60 mt-2">
                    {new Date(searchDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  <button
                    onClick={() => setSearchDate('')}
                    className="mt-4 text-[#d4af37] hover:text-[#f4d47b] transition-colors text-sm underline"
                  >
                    Ver todos los pedidos
                  </button>
                </div>
              );
            }
            
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-[#d4af37] uppercase tracking-wider border-b border-[#d4af37]/30">
                        ID Pedido
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-[#d4af37] uppercase tracking-wider border-b border-[#d4af37]/30">
                        Fecha
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-[#d4af37] uppercase tracking-wider border-b border-[#d4af37]/30">
                        Estado
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-[#d4af37] uppercase tracking-wider border-b border-[#d4af37]/30">
                        Total
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-[#d4af37] uppercase tracking-wider border-b border-[#d4af37]/30">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[#bfbfbf] text-sm">
                    {filteredPedidos.map((pedido) => (
                      <tr key={pedido.id} className="border-b border-[#d4af37]/10 hover:bg-[#d4af37]/5 transition-colors">
                        <td className="py-4 px-6 font-medium">
                          #{pedido.id}
                        </td>
                        <td className="py-4 px-6">
                          {pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'No disponible'}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoClass(pedido.estado || 'PENDIENTE')}`}>
                            {pedido.estado || 'PENDIENTE'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-[#d4af37]">
                          {pedido.total ? `$${pedido.total.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              className="bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 px-3 py-1 rounded-lg transition-colors text-xs"
                              onClick={() => handleVerDetalles(pedido)}
                            >
                              Ver detalles
                            </button>
                            {pedido.estado === 'PENDIENTE' && (
                              <button
                                onClick={() => handleCancelarPedido(pedido.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-lg transition-colors text-xs"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()} {/* IIFE ends here */}
  
        </div>
      </main>

      {/* Modal de Detalles del Pedido */}
      {mostrarModal && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#d4af37]/40 rounded-2xl w-full max-w-lg my-8 shadow-2xl animate-fadeIn">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-[#d4af37] to-[#c5a028] p-4 rounded-t-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-[#000000] truncate">
                    Pedido #{pedidoSeleccionado.id}
                  </h3>
                  <p className="text-[#000000]/70 text-xs font-semibold mt-1">
                    {pedidoSeleccionado.fechaPedido ? new Date(pedidoSeleccionado.fechaPedido).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Fecha no disponible'}
                  </p>
                </div>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="text-[#000000] hover:text-[#1a1a1a] transition-colors p-1.5 rounded-lg hover:bg-[#000000]/10 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del Modal con scroll */}
            <div className="max-h-[calc(90vh-12rem)] overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-4">
                {/* Estado */}
                <div className="flex items-center justify-between bg-[#000000]/40 rounded-lg p-3 border border-[#d4af37]/20">
                  <span className="text-[#bfbfbf] text-sm font-medium">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoClass(pedidoSeleccionado.estado || 'PENDIENTE')}`}>
                    {pedidoSeleccionado.estado || 'PENDIENTE'}
                  </span>
                </div>

                {/* Productos */}
                <div>
                  <h4 className="text-[#d4af37] font-bold text-sm mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Productos ({pedidoSeleccionado.detalles?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 ? (
                      pedidoSeleccionado.detalles.map((detalle, index) => (
                        <div
                          key={index}
                          className="bg-[#000000]/40 rounded-lg p-3 border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-[#ffffff] font-semibold text-sm truncate">
                                {detalle.nombreProducto || 'Producto'}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-xs">
                                <span className="text-[#d4af37] font-medium">
                                  {detalle.cantidad}x
                                </span>
                                <span className="text-[#bfbfbf]">•</span>
                                <span className="text-[#bfbfbf]">
                                  ₡{detalle.precioUnitario.toLocaleString('es-CR')} c/u
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[#d4af37] font-bold text-sm">
                                ₡{(detalle.precioUnitario * detalle.cantidad).toLocaleString('es-CR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#bfbfbf] text-center py-6 text-sm">No hay productos en este pedido</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con Total y Botón */}
            <div className="p-4 bg-[#000000]/50 border-t border-[#d4af37]/20 rounded-b-xl space-y-3">
              {/* Total */}
              <div className="bg-gradient-to-r from-[#d4af37]/20 to-[#c5a028]/20 border border-[#d4af37]/40 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#ffffff] font-bold text-base">Total</span>
                  <span className="text-[#d4af37] font-black text-xl">
                    ₡{pedidoSeleccionado.total ? pedidoSeleccionado.total.toLocaleString('es-CR') : '0'}
                  </span>
                </div>
              </div>

              {/* Botón Cerrar */}
              <button
                onClick={() => setMostrarModal(false)}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#000000] py-2.5 rounded-lg font-bold hover:from-[#c5a028] hover:to-[#b8941f] transition-all shadow-lg text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default PedidosUsuario;
