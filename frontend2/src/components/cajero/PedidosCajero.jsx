import { useState, useEffect } from 'react';
import { FaPrint, FaMoneyBillWave, FaCheck, FaTimes, FaCreditCard, FaMoneyBill, FaMobileAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import HeaderCajero from './HeaderCajero';
import { pedidosApi, mesaOrdenesApi, pagosApi } from '../../utils/api';
import { formatColones } from '../../utils/formatters';
import { useToast } from '../common/ToastContainer';
import PageLayout from '../common/PageLayout';

const TabButton = ({ active, children, onClick }) => (
  <button
    className={`px-4 py                    {/* Botón de cobrar para pedidos de app en estado PREPARADO */}
                    {activeTab === 'app' && pedido.estado === 'PREPARADO' && (
                      <button
                        onClick={() =>
                          confirmarCambioEstado(
                            pedido.id,
                            'COBRADO',
                            '¿Confirmar el cobro del pedido?'
                          )
                        }
                        className="bg-[#d4af37] text-[#000000] p-3 rounded-lg hover:bg-[#c5a028] transition-colors flex items-center gap-2 font-semibold"
                        title="Marcar como cobrado"
                      >
                        <FaMoneyBillWave />
                        <span className="hidden sm:inline">Cobrar Pedido</span>
                      </button>
                    )}
                    
                    {/* Botón de cobrar para órdenes de mesa en estado ENTREGADO */}
                    {activeTab === 'mesa' && pedido.estado === 'ENTREGADO' && (
                      <button
                        onClick={() =>
                          confirmarCambioEstado(
                            pedido.id,
                            'COBRADO',
                            '¿Confirmar el cobro de la orden?'
                          )
                        }
                        className="bg-[#d4af37] text-[#000000] p-3 rounded-lg hover:bg-[#c5a028] transition-colors flex items-center gap-2 font-semibold"
                        title="Marcar como cobrado"
                      >
                        <FaMoneyBillWave />
                        <span className="hidden sm:inline">Cobrar Mesa</span>
                      </button>
                    )}ounded-t-lg transition-colors duration-200
              ${
                active ? 'bg-[#d4af37] text-[#000000]' : 'bg-[#000000]/50 text-[#bfbfbf] hover:bg-[#d4af37]/20'
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

const ModalConfirmacion = ({ isOpen, mensaje, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#000000] to-[#1a1a1a] border border-[#c5a028]/30 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4 text-[#ffffff]">{mensaje}</h3>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 text-[#bfbfbf] hover:bg-[#ffffff]/10 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#d4af37] text-[#000000] rounded-lg hover:bg-[#c5a028] transition-colors font-semibold"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

ModalConfirmacion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mensaje: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

/* -------------------- MODAL DE PAGO -------------------- */
const ModalPago = ({ isOpen, pedido, onConfirm, onCancel }) => {
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoPagado, setMontoPagado] = useState('');

  useEffect(() => {
    if (isOpen && pedido) {
      setMontoPagado(pedido.total?.toString() || '0');
    }
  }, [isOpen, pedido]);

  if (!isOpen || !pedido) return null;

  const total = pedido.total || pedido.precioTotal || 0;
  const cambio = montoPagado ? parseFloat(montoPagado) - total : 0;

  const metodosPago = [
    { value: 'EFECTIVO', label: 'Efectivo', icon: FaMoneyBill, color: 'from-green-600 to-green-700' },
    { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito', icon: FaCreditCard, color: 'from-blue-600 to-blue-700' },
    { value: 'TRANSFERENCIA', label: 'Transferencia', icon: FaMobileAlt, color: 'from-purple-600 to-purple-700' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-[#0b0b0b] to-[#1a1a1a] border-2 border-[#d4af37]/30 
                    rounded-xl sm:rounded-2xl w-full max-w-md max-h-[95vh] shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d4af37] to-[#c5a028] p-4 sm:p-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaMoneyBillWave className="text-2xl sm:text-3xl text-[#000000] flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl font-black text-[#000000] truncate">Procesar Pago</h3>
              <p className="text-[#000000]/70 text-xs sm:text-sm font-semibold truncate">
                {pedido.mesa ? `Mesa ${pedido.mesa}` : `Pedido #${pedido.id}`}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Total a pagar */}
          <div className="bg-[#000000]/50 border-2 border-[#d4af37]/20 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-[#bfbfbf] text-xs sm:text-sm mb-1">Total a pagar</p>
            <p className="text-[#d4af37] text-3xl sm:text-4xl font-black">{formatColones(total)}</p>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-[#ffffff] text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
              Método de pago
            </label>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {metodosPago.map((metodo) => {
                const Icon = metodo.icon;
                return (
                  <button
                    key={metodo.value}
                    onClick={() => setMetodoPago(metodo.value)}
                    className={`relative flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl 
                              border-2 transition-all duration-200 active:scale-95
                              ${metodoPago === metodo.value
                                ? 'border-[#d4af37] bg-[#d4af37]/10'
                                : 'border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5'
                              }`}
                  >
                    <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${metodo.color} flex-shrink-0`}>
                      <Icon className="text-[#ffffff] text-base sm:text-xl" />
                    </div>
                    <span className="text-[#ffffff] font-semibold flex-1 text-left text-sm sm:text-base">
                      {metodo.label}
                    </span>
                    {metodoPago === metodo.value && (
                      <FaCheck className="text-[#d4af37] text-base sm:text-xl flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monto pagado (solo efectivo) */}
          {metodoPago === 'EFECTIVO' && (
            <div>
              <label className="block text-[#ffffff] text-xs sm:text-sm font-semibold mb-2">
                Monto pagado por el cliente
              </label>
              <input
                type="number"
                value={montoPagado}
                onChange={(e) => setMontoPagado(e.target.value)}
                step="0.01"
                min={total}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#111111] border-2 border-[#d4af37]/30 
                         rounded-lg sm:rounded-xl text-[#ffffff] text-base sm:text-lg font-semibold 
                         focus:outline-none focus:border-[#d4af37] transition-colors"
                placeholder={`Mínimo: ${formatColones(total)}`}
              />
              {cambio > 0 && (
                <p className="mt-2 text-[#d4af37] text-sm sm:text-base font-semibold flex items-center gap-2">
                  <FaCheck className="text-green-400 flex-shrink-0" />
                  <span>Cambio: {formatColones(cambio)}</span>
                </p>
              )}
              {cambio < 0 && (
                <p className="mt-2 text-red-400 text-sm sm:text-base font-semibold flex items-center gap-2">
                  <FaTimes className="flex-shrink-0" />
                  <span>Falta: {formatColones(Math.abs(cambio))}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 bg-[#000000]/30 
                      border-t-2 border-[#d4af37]/10 sticky bottom-0">
          <button 
            onClick={onCancel} 
            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1a1a1a] text-[#bfbfbf] 
                     border-2 border-[#d4af37]/20 rounded-lg sm:rounded-xl font-semibold 
                     hover:bg-[#d4af37]/10 hover:text-[#d4af37] hover:border-[#d4af37]/50 
                     active:scale-95 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(metodoPago)}
            disabled={metodoPago === 'EFECTIVO' && cambio < 0}
            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r 
                     from-[#d4af37] to-[#c5a028] text-[#000000] rounded-lg sm:rounded-xl 
                     font-black hover:from-[#c5a028] hover:to-[#b8941f] 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     active:scale-95 transition-all duration-200 shadow-lg hover:shadow-[#d4af37]/30"
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  );
};

ModalPago.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  pedido: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const PedidosCajero = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [activeTab, setActiveTab] = useState('app');
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [loading, setLoading] = useState(true);
  const [modalConfirmacion, setModalConfirmacion] = useState({
    isOpen: false,
    pedidoId: null,
    mensaje: '',
    accion: null,
  });
  const [modalPago, setModalPago] = useState({
    isOpen: false,
    pedido: null,
  });

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
      
      // Validar que los datos sean un array
      if (Array.isArray(data)) {
        setPedidos(data);
      } else {
        setPedidos([]);
      }
      
    } catch (error) {
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPedidos();
    const intervalo = setInterval(obtenerPedidos, 30000);
    return () => clearInterval(intervalo);
  }, [activeTab]);

  const procesarPago = async (metodoPago) => {
    try {
      const pedido = modalPago.pedido;
      showInfo('Procesando pago...');


      // Preparar el objeto de pago según el tipo (app o mesa)
      const pagoData = {
        monto: pedido.total || pedido.precioTotal || 0,
        metodoPago: metodoPago,
      };

      // Si es pedido de app, enviar pedido.id
      if (activeTab === 'app') {
        pagoData.pedido = { id: pedido.id };
      } 
      // Si es orden de mesa, enviar mesaOrden.id
      else if (activeTab === 'mesa') {
        pagoData.mesaOrden = { id: pedido.id };
      }


      // 1. Crear registro de pago
      await pagosApi.crearPago(pagoData);


      showSuccess(
        `¡Pago registrado exitosamente! Método: ${metodoPago === 'EFECTIVO' ? ' Efectivo' : 
         metodoPago === 'TARJETA_CREDITO' ? ' Tarjeta' : ' Transferencia'}`
      );

      // 3. Cerrar modal y recargar pedidos
      setModalPago({ isOpen: false, pedido: null });
      obtenerPedidos();

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error al procesar el pago';
      showError(errorMsg);
    }
  };

  const abrirModalPago = (pedido) => {
    setModalPago({
      isOpen: true,
      pedido: pedido,
    });
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      showInfo(`Procesando...`);
      
      if (activeTab === 'app') {
        await pedidosApi.actualizarEstado(pedidoId, nuevoEstado);
      } else {
        await mesaOrdenesApi.actualizarEstadoOrden(pedidoId, nuevoEstado);
      }
      
      showSuccess('Estado actualizado exitosamente');
      
      // Recargar la lista completa después de cualquier cambio
      obtenerPedidos();
      
      setModalConfirmacion({
        isOpen: false,
        pedidoId: null,
        mensaje: '',
        accion: null,
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al actualizar estado';
      showError(errorMsg);
    }
  };

  const confirmarCambioEstado = (pedidoId, estado, mensaje) => {
    setModalConfirmacion({
      isOpen: true,
      pedidoId,
      mensaje,
      accion: () => cambiarEstadoPedido(pedidoId, estado),
    });
  };

  const generarRecibo = (pedido) => {
    showInfo('Generando recibo...');
    
    const recibo = window.open('', '_blank');
    
    // Verificar la estructura de datos y adaptarla según el tipo de pedido
    const productos = pedido.productos || pedido.detalles || pedido.items || [];
    const total = pedido.total || pedido.precioTotal || 0;
    
    
    if (recibo) {
      showSuccess('Recibo generado exitosamente');
    } else {
      showError('No se pudo abrir la ventana del recibo. Verifica los permisos del navegador');
    }
    
    // Calcular total desde productos si no está disponible
    let totalCalculado = total;
    if ((!total || total === 0) && productos.length > 0) {
      totalCalculado = productos.reduce((sum, producto) => {
        const cantidad = producto.cantidad || 1;
        const precio = producto.precio || producto.price || producto.precioUnitario || 0;
        return sum + (precio * cantidad);
      }, 0);
    }
    
    // Nota: document.write está deprecado, pero es funcional para generar recibos de impresión
    recibo.document.write(`
      <html>
        <head>
          <title>Recibo</title>
          <style>
            @page { 
              size: 80mm auto;
              margin: 0;
            }
            body { 
              font-family: 'Courier New', monospace;
              width: 80mm;
              padding: 10mm;
              margin: 0;
              box-sizing: border-box;
            }
            .header, .footer { 
              text-align: center;
              margin-bottom: 5mm;
            }
            .divider {
              border-top: 1px dashed black;
              margin: 3mm 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 2mm 0;
              font-size: 12px;
            }
            .total {
              font-weight: bold;
              margin-top: 5mm;
              font-size: 14px;
            }
            @media print {
              body { 
                width: 80mm;
                margin: 0;
                padding: 5mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0;">RESTAURANTE</h2>
            <p style="margin:5px 0;">Recibo de Pago</p>
            <p style="margin:5px 0;">Fecha: ${new Date().toLocaleDateString()}</p>
            <p style="margin:5px 0;">Hora: ${new Date().toLocaleTimeString()}</p>
            <p style="margin:5px 0;">${activeTab === 'app' ? 'Pedido App' : 'Orden Mesa'} #${pedido.id}</p>
            ${activeTab === 'app' && (pedido.usuarioNombre || pedido.usuario?.nombre) ? 
              `<p style="margin:5px 0;">Cliente: ${pedido.usuarioNombre || pedido.usuario?.nombre}</p>` : ''}
            ${activeTab === 'mesa' && pedido.numeroMesa ? 
              `<p style="margin:5px 0;">Mesa: ${pedido.numeroMesa || pedido.mesa}</p>` : ''}
          </div>
          <div class="divider"></div>
          
          <div class="items">
            ${productos.length > 0 ? productos
              .map(
                (producto, index) => {
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
                  const subtotal = precio * cantidad;
                  
                  return `
              <div class="item">
                <span>${cantidad}x ${nombre}</span>
                <span>${formatColones(subtotal).replace('₡', '')}</span>
              </div>
            `;
                }
              )
              .join('') : `
              <div class="item">
                <span> No se encontraron productos</span>
                <span></span>
              </div>
            `}
          </div>
          <div class="divider"></div>
          <div class="total">
            <div class="item">
              <span>TOTAL:</span>
              <span>${formatColones(totalCalculado).replace('₡', '')}</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <p style="margin:5px 0;">¡Gracias por su compra!</p>
          </div>
        </body>
      </html>
    `);
    recibo.document.close();
    recibo.print();
  };

  // Función para filtrar pedidos según el estado seleccionado
  const filtrarPedidos = () => {
    
    if (filtroEstado === 'TODOS') {
      if (activeTab === 'app') {
        // Para pedidos de app, mostrar los que están PREPARADO y listos para cobrar
        const pedidosFiltrados = pedidos.filter((pedido) => 
          pedido.estado === 'PREPARADO'
        );
        return pedidosFiltrados;
      } else {
        // Para órdenes de mesa, mostrar los que están ENTREGADO y listos para cobrar
        const pedidosFiltrados = pedidos.filter((pedido) => 
          pedido.estado === 'ENTREGADO'
        );
        return pedidosFiltrados;
      }
    }
    
    // Filtrar por estado específico
    const pedidosFiltrados = pedidos.filter((pedido) => pedido.estado === filtroEstado);
    return pedidosFiltrados;
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'PREPARANDO':
      case 'EN_PREPARACION': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'PREPARADO':
      case 'LISTO': return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'ENTREGADO': 
      case 'SERVIDO': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'COBRADO': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'PAGADO': return 'bg-teal-500/20 text-teal-400 border-teal-500/40';
      case 'ENTREGADO': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'CANCELADO': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const usuario = JSON.parse(sessionStorage.getItem('user') || '{}');

  return (
    <PageLayout>
      <HeaderCajero />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <div className="animate-slideInUp">
        {/* Header simple y limpio */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#ffffff] mb-2">Gestión de Pedidos</h1>
          <p className="text-[#bfbfbf]">Procesa pagos y cobra pedidos</p>
        </div>

        {/* Tabs limpios */}
        <div className="mb-6 flex rounded-lg overflow-hidden border border-[#d4af37]/30 w-fit">
            <TabButton active={activeTab === 'app'} onClick={() => setActiveTab('app')}>
               Pedidos App
            </TabButton>
            <TabButton active={activeTab === 'mesa'} onClick={() => setActiveTab('mesa')}>
               Órdenes Mesa
            </TabButton>
        </div>

        {/* Controles */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#0b0b0b] border border-[#d4af37]/30 
                     text-[#ffffff] focus:outline-none focus:border-[#d4af37] 
                     transition-colors"
          >
            <option value="TODOS">Pendientes de Cobro</option>
            <option value="COBRADO">Cobrados</option>
            <option value="ENTREGADO">Entregados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
          
          <button
            onClick={obtenerPedidos}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-[#d4af37] text-[#000000] font-bold
                     hover:bg-[#c5a028] disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center gap-2 justify-center"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          
          <div className="px-4 py-3 rounded-lg bg-[#0b0b0b] border border-[#d4af37]/30 
                        text-[#d4af37] font-semibold text-center">
            Total: {filtrarPedidos().length}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#bfbfbf]">Cargando pedidos...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtrarPedidos().length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#ffffff] text-xl font-bold mb-2">
                  {filtroEstado === 'TODOS' 
                    ? 'No hay pedidos pendientes'
                    : `Sin pedidos: ${filtroEstado}`
                  }
                </p>
                <p className="text-[#bfbfbf]">
                  {filtroEstado === 'TODOS' 
                    ? 'Los pedidos preparados aparecerán aquí'
                    : 'Cambia el filtro para ver otros estados'
                  }
                </p>
              </div>
            ) : (
              filtrarPedidos().map((pedido) => (
              <div 
                key={pedido.id} 
                className="bg-[#0b0b0b] border border-[#d4af37]/20 rounded-lg p-5
                         hover:border-[#d4af37]/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#d4af37] mb-1">
                      {activeTab === 'app' ? `Pedido #${pedido.id}` : `Mesa ${pedido.numeroMesa || pedido.mesa}`}
                    </h3>
                    <p className="text-[#bfbfbf] text-sm mb-2">
                      {activeTab === 'app'
                        ? `Cliente: ${pedido.usuarioNombre || pedido.usuario?.nombre || pedido.cliente || 'N/A'}`
                        : `Mesa ${pedido.numeroMesa || pedido.mesa}`}
                    </p>
                    <p className="text-[#ffffff] text-xl font-bold">
                      {formatColones(pedido.total || 0)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Botón de cobrar para pedidos de app en PREPARADO */}
                    {activeTab === 'app' && pedido.estado === 'PREPARADO' && (
                      <button
                        onClick={() => abrirModalPago(pedido)}
                        className="px-4 py-2 bg-[#d4af37] text-[#000000] rounded-lg font-bold
                                 hover:bg-[#c5a028] transition-colors
                                 flex items-center gap-2"
                      >
                        <FaMoneyBillWave />
                        <span>Cobrar</span>
                      </button>
                    )}
                    
                    {/* Botón de cobrar para órdenes de mesa en ENTREGADO */}
                    {activeTab === 'mesa' && pedido.estado === 'ENTREGADO' && (
                      <button
                        onClick={() => abrirModalPago(pedido)}
                        className="px-4 py-2 bg-[#d4af37] text-[#000000] rounded-lg font-bold
                                 hover:bg-[#c5a028] transition-colors
                                 flex items-center gap-2"
                      >
                        <FaMoneyBillWave />
                        <span>Cobrar</span>
                      </button>
                    )}
                    
                    {/* Estados finales */}
                    {pedido.estado === 'COBRADO' && (
                      <div className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm font-bold border border-yellow-500/30 flex items-center gap-2">
                        <span></span>
                        <span>Cobrado</span>
                      </div>
                    )}
                    
                    {pedido.estado === 'PAGADO' && (
                      <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-bold border border-green-500/30 flex items-center gap-2">
                        <FaCheck />
                        <span>Pagado</span>
                      </div>
                    )}
                    
                    {['PREPARADO', 'LISTO'].includes(pedido.estado) && (
                      <button
                        onClick={() =>
                          confirmarCambioEstado(
                            pedido.id,
                            'CANCELADO',
                            '¿Confirmar la cancelación del pedido?'
                          )
                        }
                        className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg border border-red-500/40
                                 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <FaTimes />
                      </button>
                    )}
                    
                    {(pedido.estado === 'COBRADO' || pedido.estado === 'PAGADO' || pedido.estado === 'ENTREGADO') && (
                      <button
                        onClick={() => generarRecibo(pedido)}
                        className="px-3 py-2 bg-[#d4af37]/20 text-[#d4af37] rounded-lg border border-[#d4af37]/40
                                 hover:bg-[#d4af37] hover:text-[#000000] transition-colors"
                      >
                        <FaPrint />
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="mt-4 pt-4 border-t border-[#d4af37]/10">
                  <p className="text-[#d4af37] font-bold text-sm mb-3">Productos</p>
                  <div className="space-y-2">
                    {(pedido.productos || pedido.detalles || []).length === 0 ? (
                      <p className="text-[#bfbfbf] text-sm text-center py-3">Sin productos registrados</p>
                    ) : (
                      (pedido.productos || pedido.detalles || []).map((producto, idx) => (
                        <div
                          key={producto.id || idx}
                          className="flex justify-between items-center p-3 rounded-lg 
                                   bg-[#0b0b0b] border border-[#d4af37]/10
                                   hover:border-[#d4af37]/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4af37] 
                                         flex items-center justify-center text-[#000000] font-bold text-sm">
                              {producto.cantidad}
                            </span>
                            <span className="text-[#ffffff] text-sm font-medium truncate">
                              {producto.producto?.nombre || producto.nombre || producto.nombreProducto || 'Producto'}
                            </span>
                          </div>
                          <span className="text-[#d4af37] font-bold text-sm ml-3 flex-shrink-0">
                            {formatColones((producto.precioUnitario || producto.precio) * producto.cantidad)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        )}
      </div>

      <ModalConfirmacion
        isOpen={modalConfirmacion.isOpen}
        mensaje={modalConfirmacion.mensaje}
        onConfirm={() => modalConfirmacion.accion()}
        onCancel={() =>
          setModalConfirmacion({ isOpen: false, pedidoId: null, mensaje: '', accion: null })
        }
      />

      <ModalPago
        isOpen={modalPago.isOpen}
        pedido={modalPago.pedido}
        onConfirm={procesarPago}
        onCancel={() => setModalPago({ isOpen: false, pedido: null })}
      />
        </div>
    </PageLayout>
  );
};

export default PedidosCajero;
