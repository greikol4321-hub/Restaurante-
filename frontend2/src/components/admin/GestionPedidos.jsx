import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaCalendar } from 'react-icons/fa';
import Header from './Header';
import { pedidosApi, usuarioApi, mesaOrdenesApi } from '../../utils/api';
import { formatColones } from '../../utils/formatters';
import { useToast } from '../common/ToastContainer';
import PageLayout from '../common/PageLayout';

const TabButton = ({ active, children, onClick }) => (
  <button
    className={`px-6 py-3 font-semibold rounded-full transition-all duration-200
              ${
                active 
                  ? 'bg-[#d4af37] text-[#000000]' 
                  : 'bg-[#1a1a1a] border border-[#c5a028]/30 text-[#ffffff] hover:border-[#d4af37]'
              }`}
    onClick={onClick}
  >
    {children}
  </button>
);

TabButton.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DetallesPedidoModal = ({ pedido, onClose }) => {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center 
                  p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border-2 border-[#d4af37]/30 
                    rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto 
                    shadow-[0_20px_60px_rgba(212,175,55,0.3)]
                    animate-[slideUp_0.3s_ease-out] custom-scrollbar">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#c5a028] 
                        flex items-center justify-center shadow-lg">
            <span className="text-3xl font-black text-[#000000]">
              {pedido?.tipo === 'app' ? 'APP' : 'MESA'}
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-[#d4af37] to-[#f4d47b] 
                         bg-clip-text text-transparent">
              {pedido?.tipo === 'app' ? 'Pedido' : 'Orden de Mesa'}
            </h2>
            <p className="text-[#888888] text-sm">Detalles completos</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0b0b0b]/50 border-2 border-[#c5a028]/20 rounded-2xl p-4">
              <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">ID del pedido</p>
              <p className="text-[#d4af37] text-2xl font-black">#{pedido?.id}</p>
            </div>
            <div className="bg-[#0b0b0b]/50 border-2 border-[#c5a028]/20 rounded-2xl p-4">
              <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">
                {pedido?.tipo === 'app' ? 'Cliente' : 'Mesa'}
              </p>
              <p className="text-[#ffffff] text-lg font-bold">
                {pedido?.tipo === 'app' 
                  ? (pedido?.usuarioNombre || pedido?.usuario?.nombre || pedido?.cliente || 'N/A')
                  : `Mesa ${pedido?.numeroMesa || pedido?.mesa || 'N/A'}`
                }
              </p>
            </div>
            <div className="bg-[#0b0b0b]/50 border-2 border-[#c5a028]/20 rounded-2xl p-4">
              <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Fecha y hora</p>
              <p className="text-[#ffffff] text-sm font-semibold">
                {new Date(pedido?.fechaPedido || pedido?.fechaCreacion || pedido?.fecha).toLocaleString('es-ES')}
              </p>
            </div>
            <div className="bg-[#0b0b0b]/50 border-2 border-[#c5a028]/20 rounded-2xl p-4">
              <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Estado</p>
              <span className="inline-block px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/50 
                           rounded-full text-[#d4af37] text-sm font-bold uppercase">
                {pedido?.estado}
              </span>
            </div>
          </div>

          {pedido?.tipo === 'mesa' && (pedido?.mesero?.nombre || pedido?.mesero) && (
            <div className="bg-[#0b0b0b]/50 border-2 border-[#c5a028]/20 rounded-2xl p-4">
              <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Mesero</p>
              <p className="text-[#ffffff] text-lg font-bold">
                {pedido?.mesero?.nombre || pedido?.mesero || 'N/A'}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-xl font-black text-[#d4af37] mb-4 flex items-center gap-2">
              Productos ordenados
            </h3>
            <div className="space-y-3">
              {(pedido?.productos || pedido?.detalles || []).map((producto, index) => {
                // Adaptarse a diferentes estructuras de datos
                const cantidad = producto.cantidad || 1;
                const nombre = producto.nombre || 
                              producto.name || 
                              (producto.producto?.nombre) || 
                              producto.nombreProducto ||
                              `Producto #${index + 1}`;
                const precio = producto.precio || 
                              producto.price || 
                              producto.precioUnitario || 
                              (producto.producto?.precio) || 0;
                
                return (
                  <div
                    key={producto.id || `${nombre}-${cantidad}-${index}`}
                    className="flex justify-between items-center bg-gradient-to-r from-[#0b0b0b] to-[#1a1a1a] 
                             border-2 border-[#c5a028]/20 rounded-2xl p-4 hover:border-[#d4af37]/50 
                             transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 
                                    flex items-center justify-center">
                        <span className="text-[#d4af37] font-black">{cantidad}x</span>
                      </div>
                      <span className="text-[#ffffff] font-semibold group-hover:text-[#d4af37] 
                                     transition-colors">{nombre}</span>
                    </div>
                    <span className="text-[#d4af37] text-xl font-black">
                      {formatColones(precio * cantidad)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#c5a028]/10 border-2 border-[#d4af37]/50 
                        rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-[#ffffff] text-2xl font-black">Total del pedido</span>
              <span className="text-4xl font-black bg-gradient-to-r from-[#d4af37] to-[#f4d47b] 
                           bg-clip-text text-transparent">
                {formatColones(pedido?.total || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#000000] 
                     font-black text-lg rounded-2xl hover:scale-105 transition-all duration-300
                     shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.6)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

DetallesPedidoModal.propTypes = {
  pedido: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

const GestionPedidos = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [activeTab, setActiveTab] = useState('app');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroMesero, setFiltroMesero] = useState('todos');
  const [meseros, setMeseros] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const obtenerPedidos = async () => {
    try {
      setLoading(true);
      
      let response;
      if (activeTab === 'app') {
        response = await pedidosApi.listarPedidos();
      } else {
        response = await mesaOrdenesApi.listarOrdenes();
      }
      
      const data = response.data || response || [];
      
      // Agregar tipo para diferenciación
      const pedidosConTipo = data.map(pedido => ({
        ...pedido,
        tipo: activeTab
      }));
      
      setPedidos(pedidosConTipo);
      
      if (pedidosConTipo.length === 0) {
        showInfo(`No hay ${activeTab === 'app' ? 'pedidos de app' : 'órdenes de mesa'} en este momento`);
      }
      
    } catch (err) {
      const errorMsg = 'Error al cargar los pedidos';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const obtenerMeseros = async () => {
    try {
      const response = await usuarioApi.obtenerMeseros();
      setMeseros(response.data);
    } catch (err) {
    }
  };

  useEffect(() => {
    obtenerPedidos();
    if (activeTab === 'mesa') {
      obtenerMeseros();
    }
  }, [activeTab]);

  const filtrarPedidos = () => {
    return pedidos.filter((pedido) => {
      const cumpleFiltroEstado = filtroEstado === 'todos' || pedido.estado === filtroEstado;
      
      // Filtro de fecha mejorado
      const cumpleFiltroFecha = !filtroFecha || (() => {
        // Obtener la fecha del pedido y convertirla a formato local
        const fechaPedidoStr = pedido.fechaPedido || pedido.fechaCreacion || pedido.fecha;
        if (!fechaPedidoStr) return false;
        
        // Crear fecha del pedido sin considerar zona horaria
        const fechaPedido = new Date(fechaPedidoStr);
        const añoPedido = fechaPedido.getFullYear();
        const mesPedido = fechaPedido.getMonth();
        const diaPedido = fechaPedido.getDate();
        
        // Crear fecha del filtro
        const fechaFiltro = new Date(filtroFecha + 'T00:00:00');
        const añoFiltro = fechaFiltro.getFullYear();
        const mesFiltro = fechaFiltro.getMonth();
        const diaFiltro = fechaFiltro.getDate();
        
        return añoPedido === añoFiltro && mesPedido === mesFiltro && diaPedido === diaFiltro;
      })();
      
      const cumpleFiltroMesero =
        activeTab !== 'mesa' || 
        filtroMesero === 'todos' || 
        pedido.mesero === filtroMesero ||
        pedido.mesero?.nombre === filtroMesero;

      return cumpleFiltroEstado && cumpleFiltroFecha && cumpleFiltroMesero;
    });
  };

  return (
    <PageLayout>
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto animate-slideInUp">
          <h1 className="text-4xl font-title text-[#d4af37] mb-8">Gestión de Pedidos</h1>

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

          <div className="mb-6 flex gap-4">
            <TabButton active={activeTab === 'app'} onClick={() => setActiveTab('app')}>
              Pedidos App
            </TabButton>
            <TabButton active={activeTab === 'mesa'} onClick={() => setActiveTab('mesa')}>
              Órdenes Mesa
            </TabButton>
          </div>

          <div className="bg-[#0b0b0b] border border-[#c5a028]/30 p-4 rounded-xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="filtroEstado"
                  className="block text-xs font-medium text-[#d4af37] mb-1.5"
                >
                  Estado
                </label>
                <select
                  id="filtroEstado"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#c5a028]/30 
                           text-[#ffffff] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="PREPARANDO">Preparando</option>
                  <option value="PREPARADO">Preparado</option>
                  <option value="COBRADO">Cobrado</option>
                  <option value="ENTREGADO">Entregado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filtroFecha"
                  className="block text-xs font-medium text-[#d4af37] mb-1.5"
                >
                  Fecha
                </label>
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4af37] text-sm" />
                  <input
                    id="filtroFecha"
                    type="date"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#c5a028]/30 
                             text-[#ffffff] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              {activeTab === 'mesa' && (
                <div>
                  <label
                    htmlFor="filtroMesero"
                    className="block text-xs font-medium text-[#d4af37] mb-1.5"
                  >
                    Mesero
                  </label>
                  <select
                    id="filtroMesero"
                    value={filtroMesero}
                    onChange={(e) => setFiltroMesero(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#c5a028]/30 
                             text-[#ffffff] text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    <option value="todos">Todos los meseros</option>
                    {meseros.map((mesero) => (
                      <option key={mesero.id} value={mesero.nombre}>
                        {mesero.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
              <p className="text-[#bfbfbf] text-lg">Cargando pedidos...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtrarPedidos().map((pedido) => (
                <div key={pedido.id} className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                                               border-2 border-[#c5a028]/20 hover:border-[#d4af37]/60 
                                               rounded-xl p-4 transition-all duration-300
                                               shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                                               hover:shadow-[0_8px_32px_rgba(212,175,55,0.2)]
                                               hover:scale-[1.005] overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full 
                                blur-3xl group-hover:bg-[#d4af37]/10 transition-colors duration-300"></div>
                  <div className="relative z-10 flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c5a028] 
                                      flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-[#000000] font-black text-lg">
                            #{pedido.id}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-black text-[#ffffff] group-hover:text-[#d4af37] 
                                       transition-colors duration-300 truncate">
                            {activeTab === 'app' ? 'Pedido App' : `Mesa ${pedido.numeroMesa || pedido.mesa || 'N/A'}`}
                          </h3>
                          <p className="text-[#bfbfbf] text-sm truncate">
                            {activeTab === 'app' 
                              ? (pedido.usuarioNombre || pedido.usuario?.nombre || pedido.cliente || 'N/A')
                              : (pedido.mesero?.nombre || pedido.mesero || 'N/A')
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#0b0b0b]/50 border border-[#c5a028]/20 rounded-lg p-2">
                          <p className="text-[#888888] text-xs uppercase tracking-wider mb-0.5">Fecha</p>
                          <p className="text-[#ffffff] text-xs font-semibold">
                            {new Date(pedido.fechaPedido || pedido.fechaCreacion || pedido.fecha).toLocaleDateString('es-ES', { 
                              day: '2-digit', 
                              month: '2-digit' 
                            })}
                          </p>
                        </div>
                        <div className="bg-[#0b0b0b]/50 border border-[#c5a028]/20 rounded-lg p-2">
                          <p className="text-[#888888] text-xs uppercase tracking-wider mb-0.5">Hora</p>
                          <p className="text-[#ffffff] text-xs font-semibold">
                            {new Date(pedido.fechaPedido || pedido.fechaCreacion || pedido.fecha).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <div className="bg-[#0b0b0b]/50 border border-[#c5a028]/20 rounded-lg p-2">
                          <p className="text-[#888888] text-xs uppercase tracking-wider mb-0.5">Estado</p>
                          <span className="inline-block px-2 py-0.5 bg-[#d4af37]/20 border border-[#d4af37]/50 
                                       rounded-full text-[#d4af37] text-xs font-bold uppercase">
                            {pedido.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => setPedidoSeleccionado({ ...pedido, tipo: activeTab })}
                        className="p-3 bg-gradient-to-br from-[#d4af37]/20 to-[#c5a028]/20 
                                 border-2 border-[#d4af37]/50 text-[#d4af37] rounded-xl 
                                 hover:border-[#d4af37] hover:scale-110 transition-all duration-300
                                 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        title="Ver detalles"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <div className="text-right">
                        <p className="text-[#bfbfbf] text-xs font-semibold">Total</p>
                        <span className="text-xl font-black bg-gradient-to-r from-[#d4af37] to-[#f4d47b] 
                                     bg-clip-text text-transparent whitespace-nowrap">
                          {formatColones(pedido.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DetallesPedidoModal
        pedido={pedidoSeleccionado}
        onClose={() => setPedidoSeleccionado(null)}
      />
    </PageLayout>
  );
};

export default GestionPedidos;
