import React, { useEffect, useState } from 'react';
import { mesaOrdenesApi, pedidosApi } from '../../utils/api';
import { useToast } from '../common/ToastContainer';
import HeaderCocinero from './HeaderCocinero';
import PageLayout from '../common/PageLayout';

const OrdenesCocina = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [ordenes, setOrdenes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipoVista, setTipoVista] = useState('mesas'); // 'mesas' o 'pedidos'
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Estados que la cocina puede manejar
  const estadosOrdenMesa = ['PENDIENTE', 'PREPARANDO', 'LISTO'];  // Para órdenes de mesa
  const estadosOrdenApp = ['PENDIENTE', 'PREPARANDO', 'PREPARADO'];  // Para pedidos de app
  
  // Estados finales que no deben mostrarse en cocina
  const estadosFinales = ['ENTREGADO', 'COBRADO', 'PAGADO', 'CANCELADO'];
  
  // Mapeo de transiciones permitidas
  const transicionesPermitidas = {
    // Para órdenes de mesa
    'mesa': {
      'PENDIENTE': ['PREPARANDO'],
      'PREPARANDO': ['LISTO']
    },
    // Para pedidos de app
    'app': {
      'PENDIENTE': ['PREPARANDO'],
      'PREPARANDO': ['PREPARADO']
    }
  };

  // Función para calcular el total de una orden
  const calcularTotal = (orden) => {
    if (!orden.detalles || !Array.isArray(orden.detalles)) return 0;
    return orden.detalles.reduce((total, detalle) => {
      const cantidad = Number(detalle.cantidad) || 0;
      const precio = Number(detalle.precioUnitario) || 0;
      return total + (cantidad * precio);
    }, 0);
  };

  // Función para contar productos
  const contarProductos = (orden) => {
    if (!orden.detalles || !Array.isArray(orden.detalles)) return 0;
    return orden.detalles.reduce((total, detalle) => {
      return total + (Number(detalle.cantidad) || 0);
    }, 0);
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    try {
      return new Date(fecha).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return fecha;
    }
  };

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    try {
      if (tipoVista === 'mesas') {
        const response = await mesaOrdenesApi.listarOrdenes();
        let datos = response.data || response || [];
        
        // Filtrar órdenes para mostrar solo las que están en proceso
        datos = datos.filter(orden => 
          !['ENTREGADO', 'COBRADO', 'PAGADO', 'CANCELADO'].includes(orden.estado) &&
          estadosOrdenMesa.includes(orden.estado)
        );
        
        // Filtrar por estado específico si no es 'TODOS'
        if (filtroEstado !== 'TODOS') {
          datos = datos.filter(orden => orden.estado === filtroEstado);
        }
        
        // Ordenar por fecha de creación (más recientes primero)
        datos.sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0));
        
        setOrdenes(datos);
      } else {
        const response = await pedidosApi.listarPedidos();
        let datos = response.data || response || [];
        
        // Filtrar pedidos para mostrar solo los que están en proceso
        datos = datos.filter(pedido => estadosOrdenApp.includes(pedido.estado));
        
        // Filtrar por estado específico si no es 'TODOS'
        if (filtroEstado !== 'TODOS') {
          datos = datos.filter(pedido => pedido.estado === filtroEstado);
        }
        
        // Ordenar por fecha de creación (más recientes primero)
        datos.sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0));
        
        setPedidos(datos);
      }
    } catch (err) {
      setError('Error al cargar los datos. Verifica la conexión con el backend.');
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado de una orden
  const cambiarEstadoOrden = async (ordenId, nuevoEstado) => {
    try {
      setLoading(true);
      showInfo(`Actualizando estado a ${nuevoEstado}...`);

      // Actualizar el estado usando el endpoint específico
      const response = await mesaOrdenesApi.actualizarEstadoOrden(ordenId, nuevoEstado);
      
      // Mostrar mensaje de éxito según el estado
      if (nuevoEstado === 'PREPARANDO') {
        showSuccess('La orden ha sido marcada como en preparación');
      } else if (nuevoEstado === 'LISTO') {
        showSuccess('La orden ha sido marcada como lista para servir');
      }

      // Recargar los datos después de una actualización exitosa
      await cargarDatos();

    } catch (err) {
      if (err.response?.data) {
      }
      
      let mensajeError = 'Error desconocido';
      if (err.response?.status === 500) {
        mensajeError = 'Error interno del servidor. Intenta de nuevo';
      } else if (err.response?.status === 404) {
        mensajeError = 'Orden no encontrada';
      } else if (err.message?.includes('Network Error')) {
        mensajeError = 'Error de conexión con el servidor';
      }
      
      showError(`Error al cambiar el estado: ${mensajeError}`);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para validar transiciones de estado
  const validarTransicionEstado = (estadoActual, nuevoEstado) => {
    const transicionesPermitidas = {
      'PENDIENTE': ['PREPARANDO'],
      'PREPARANDO': ['LISTO'],
      'LISTO': ['SERVIDA']
    };

    return transicionesPermitidas[estadoActual]?.includes(nuevoEstado);
  };

  // Función para cambiar el estado de un pedido
  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      
      // Validar transición según el tipo de pedido
      const estadoActual = pedidos.find(p => p.id === pedidoId)?.estado;
      if (!estadoActual) {
        showError('Pedido no encontrado');
        throw new Error('Pedido no encontrado');
      }

      const transicionesValidas = transicionesPermitidas['app'][estadoActual];
      if (!transicionesValidas?.includes(nuevoEstado)) {
        showError(`Transición no válida: de ${estadoActual} a ${nuevoEstado}`);
        throw new Error(`Transición no válida: de ${estadoActual} a ${nuevoEstado}`);
      }

      showInfo(`Actualizando pedido a ${nuevoEstado}...`);
      const response = await pedidosApi.actualizarEstado(pedidoId, nuevoEstado);

      // Mostrar mensaje de éxito
      if (nuevoEstado === 'PREPARANDO') {
        showSuccess('El pedido ha sido marcado como en preparación');
      } else if (nuevoEstado === 'PREPARADO') {
        showSuccess('El pedido está listo para cobrar');
      }

      cargarDatos(); // Recargar los datos
    } catch (err) {
      
      let mensajeError = err.message;
      if (err.response?.status === 500) {
        if (err.response.data?.message?.includes('cobrado') || err.response.data?.message?.includes('pagado')) {
          mensajeError = 'No se puede modificar un pedido ya procesado por caja';
        } else {
          mensajeError = 'Error del servidor. El pedido podría no existir';
        }
      } else if (err.response?.status === 404) {
        mensajeError = 'Pedido no encontrado';
      } else if (err.message?.includes('Network Error')) {
        mensajeError = 'Error de conexión con el servidor';
      }
      
      showError(mensajeError);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [tipoVista, filtroEstado]);

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'PREPARANDO': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'PREPARADO':
      case 'LISTO': return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'ENTREGADO': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'COBRADO': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'PAGADO': return 'bg-teal-500/20 text-teal-400 border-teal-500/40';
      case 'CANCELADO': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <PageLayout>
      <HeaderCocinero />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <div className="animate-slideInUp">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#ffffff] mb-2">Órdenes de Cocina</h1>
          <p className="text-[#bfbfbf]">Gestiona las órdenes y pedidos desde la cocina</p>
        </div>

        {/* Controles superiores */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          {/* Selector de tipo de vista */}
          <div className="flex rounded-lg overflow-hidden border border-[#d4af37]/30 w-fit">
            <button
              onClick={() => setTipoVista('mesas')}
              className={`px-4 py-2 font-semibold transition-colors ${
                tipoVista === 'mesas'
                  ? 'bg-[#d4af37] text-[#000000]'
                  : 'bg-[#0b0b0b] text-[#bfbfbf] hover:bg-[#d4af37]/20'
              }`}
            >
              Órdenes de Mesa
            </button>
            <button
              onClick={() => setTipoVista('pedidos')}
              className={`px-4 py-2 font-semibold transition-colors ${
                tipoVista === 'pedidos'
                  ? 'bg-[#d4af37] text-[#000000]'
                  : 'bg-[#0b0b0b] text-[#bfbfbf] hover:bg-[#d4af37]/20'
              }`}
            >
              Pedidos App
            </button>
          </div>

          {/* Filtro de estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#0b0b0b] border border-[#d4af37]/30 text-[#ffffff] focus:border-[#d4af37] focus:outline-none"
          >
            <option value="TODOS">Todos los estados</option>
            {(tipoVista === 'mesas' ? estadosOrdenMesa : estadosOrdenApp).map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>

          {/* Botón de actualizar */}
          <button
            onClick={cargarDatos}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#000000] font-semibold hover:bg-[#c5a028] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        {/* Contenido principal */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
            <p className="text-[#bfbfbf] mt-2">Cargando...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Lista de órdenes de mesa */}
        {tipoVista === 'mesas' && !loading && (
          <div>
            {ordenes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#bfbfbf] text-lg">No hay órdenes de mesa</p>
                <p className="text-[#bfbfbf]/60">Las órdenes aparecerán aquí cuando los meseros las creen</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ordenes.map((orden) => (
                  <div key={orden.id} className="rounded-lg bg-[#0b0b0b] border border-[#d4af37]/20 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#d4af37]">Mesa {orden.mesaNumero}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold ${getEstadoColor(orden.estado || 'PENDIENTE')}`}>
                        {orden.estado || 'PENDIENTE'}
                      </span>
                    </div>

                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#bfbfbf]">Total:</span>
                        <span className="text-[#d4af37] font-semibold">₡ {calcularTotal(orden).toLocaleString('es-CR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#bfbfbf]">Productos:</span>
                        <span className="text-[#ffffff]">{contarProductos(orden)}</span>
                      </div>
                      {orden.fechaCreacion && (
                        <div className="flex justify-between">
                          <span className="text-[#bfbfbf]">Creado:</span>
                          <span className="text-[#ffffff]">{formatearFecha(orden.fechaCreacion)}</span>
                        </div>
                      )}
                    </div>

                    {/* Lista de productos */}
                    {orden.detalles && orden.detalles.length > 0 && (
                      <div className="border-t border-[#d4af37]/10 pt-4">
                        <p className="text-[#d4af37] font-bold text-sm mb-3">Productos</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {orden.detalles.map((detalle, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-3 rounded-lg 
                                       bg-[#000000] border border-[#d4af37]/10
                                       hover:border-[#d4af37]/30 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4af37] 
                                             flex items-center justify-center text-[#000000] font-bold text-sm">
                                  {detalle.cantidad}
                                </span>
                                <span className="text-[#ffffff] text-sm font-medium truncate">
                                  {detalle.producto?.nombre || detalle.nombreProducto || 'Producto'}
                                </span>
                              </div>
                              <span className="text-[#d4af37] font-bold text-sm ml-3 flex-shrink-0">
                                ₡{((detalle.precioUnitario || detalle.precio || 0) * detalle.cantidad).toLocaleString('es-CR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones de cambio de estado */}
                    <div className="flex gap-2 pt-2 flex-wrap">
                      {/* Botón para empezar a preparar */}
                      {orden.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => cambiarEstadoOrden(orden.id, 'PREPARANDO')}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all
                                   bg-gradient-to-r from-[#d4af37] to-[#000000] text-[#ffffff] 
                                   hover:from-[#c5a028] hover:to-[#1a1a1a] shadow-lg 
                                   hover:shadow-[#d4af37]/30 active:scale-95"
                        >
                           Empezar a Preparar
                        </button>
                      )}
                      {/* Botón para marcar como listo */}
                      {orden.estado === 'PREPARANDO' && (
                        <button
                          onClick={() => cambiarEstadoOrden(orden.id, 'LISTO')}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all
                                   bg-gradient-to-r from-[#d4af37] to-[#000000] text-[#ffffff] 
                                   hover:from-[#c5a028] hover:to-[#1a1a1a] shadow-lg 
                                   hover:shadow-[#d4af37]/30 active:scale-95"
                        >
                           Marcar como Listo
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lista de pedidos de la app */}
        {tipoVista === 'pedidos' && !loading && (
          <div>
            {pedidos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#bfbfbf] text-lg">No hay pedidos de la aplicación</p>
                <p className="text-[#bfbfbf]/60">Los pedidos de usuarios aparecerán aquí</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="rounded-lg bg-[#0b0b0b] border border-[#d4af37]/20 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#d4af37]">Pedido #{pedido.id}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold ${getEstadoColor(pedido.estado || 'PENDIENTE')}`}>
                        {pedido.estado || 'PENDIENTE'}
                      </span>
                    </div>

                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#bfbfbf]">Cliente:</span>
                        <span className="text-[#ffffff]">{pedido.usuarioNombre || pedido.usuario?.nombre || 'Usuario'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#bfbfbf]">Total:</span>
                        <span className="text-[#d4af37] font-semibold">₡ {Number(pedido.total || 0).toLocaleString('es-CR')}</span>
                      </div>
                      {pedido.fechaCreacion && (
                        <div className="flex justify-between">
                          <span className="text-[#bfbfbf]">Creado:</span>
                          <span className="text-[#ffffff]">{formatearFecha(pedido.fechaCreacion)}</span>
                        </div>
                      )}
                      {pedido.direccionEntrega && (
                        <div className="flex justify-between">
                          <span className="text-[#bfbfbf]">Dirección:</span>
                          <span className="text-[#ffffff] text-right ml-2 text-xs">{pedido.direccionEntrega}</span>
                        </div>
                      )}
                    </div>

                    {/* Lista de productos */}
                    {pedido.detalles && pedido.detalles.length > 0 && (
                      <div className="border-t border-[#d4af37]/10 pt-4">
                        <p className="text-[#d4af37] font-bold text-sm mb-3">Productos</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {pedido.detalles.map((detalle, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-3 rounded-lg 
                                       bg-[#000000] border border-[#d4af37]/10
                                       hover:border-[#d4af37]/30 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4af37] 
                                             flex items-center justify-center text-[#000000] font-bold text-sm">
                                  {detalle.cantidad}
                                </span>
                                <span className="text-[#ffffff] text-sm font-medium truncate">
                                  {detalle.producto?.nombre || detalle.nombreProducto || 'Producto'}
                                </span>
                              </div>
                              <span className="text-[#d4af37] font-bold text-sm ml-3 flex-shrink-0">
                                ₡{((detalle.precioUnitario || detalle.precio || 0) * detalle.cantidad).toLocaleString('es-CR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones de cambio de estado */}
                    <div className="flex gap-2 pt-2 flex-wrap">
                      {pedido.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => cambiarEstadoPedido(pedido.id, 'PREPARANDO')}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all
                                   bg-gradient-to-r from-[#d4af37] to-[#000000] text-[#ffffff] 
                                   hover:from-[#c5a028] hover:to-[#1a1a1a] shadow-lg 
                                   hover:shadow-[#d4af37]/30 active:scale-95"
                        >
                           Empezar a Preparar
                        </button>
                      )}
                      {pedido.estado === 'PREPARANDO' && (
                        <button
                          onClick={() => cambiarEstadoPedido(pedido.id, 'PREPARADO')}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all
                                   bg-gradient-to-r from-[#d4af37] to-[#000000] text-[#ffffff] 
                                   hover:from-[#c5a028] hover:to-[#1a1a1a] shadow-lg 
                                   hover:shadow-[#d4af37]/30 active:scale-95"
                        >
                           Marcar como Preparado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </PageLayout>
  );
};

export default OrdenesCocina;