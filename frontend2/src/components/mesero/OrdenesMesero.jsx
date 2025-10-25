import { useEffect, useState } from 'react';
import HeaderMesero from './HeaderMesero';
import { mesaOrdenesApi } from '../../utils/api';
import { formatColones } from '../../utils/formatters';
import { useToast } from '../common/ToastContainer';
import ModalEditarOrdenCompleta from './ModalEditarOrdenCompleta';
import PageLayout from '../common/PageLayout';

const OrdenesMesero = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sel, setSel] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalEntrega, setModalEntrega] = useState({
    isOpen: false,
    ordenId: null
  });

  // Función para calcular el total de la orden
  const calcularTotal = (orden) => {
    if (!orden.detalles || !Array.isArray(orden.detalles)) return 0;
    return orden.detalles.reduce((total, detalle) => {
      const cantidad = Number(detalle.cantidad) || 0;
      const precio = Number(detalle.precioUnitario) || 0;
      return total + (cantidad * precio);
    }, 0);
  };

  // Función para contar la cantidad total de productos
  const contarProductos = (orden) => {
    if (!orden.detalles || !Array.isArray(orden.detalles)) return 0;
    return orden.detalles.reduce((total, detalle) => {
      return total + (Number(detalle.cantidad) || 0);
    }, 0);
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    try {
      return new Date(fecha).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return fecha;
    }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await mesaOrdenesApi.listarOrdenes();
      // Filtrar las órdenes para excluir las que están en estado ENTREGADO
      const ordenesActivas = (res.data || res || []).filter(orden => orden.estado !== 'ENTREGADO');
      setOrdenes(ordenesActivas);
      if (ordenesActivas.length === 0) {
        showInfo('No hay órdenes activas en este momento');
      }
    } catch (e) {
      const errorMsg = e.response?.status === 500 
        ? 'Error del servidor al cargar órdenes. Verifica el backend'
        : 'No se pudo cargar las órdenes';
      setError(errorMsg);
      showError(errorMsg);
      setOrdenes([]); // Set empty array para que no crashee el render
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onEdit = (orden) => {
    setSel(orden);
    setOpen(true);
  };

  const confirmarEntrega = (ordenId) => {
    setModalEntrega({
      isOpen: true,
      ordenId
    });
  };

  const realizarEntrega = async (ordenId) => {
    try {
      showInfo('Marcando orden como entregada...');
      await mesaOrdenesApi.actualizarEstadoOrden(ordenId, 'ENTREGADO');
      showSuccess('¡Orden entregada exitosamente! Lista para cobro en caja');
      await load();
      setModalEntrega({ isOpen: false, ordenId: null });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al marcar la orden como entregada';
      showError(errorMsg);
    }
  };

  return (
    <PageLayout>
      <HeaderMesero />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
        <div className="animate-slideInUp">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-title font-semibold text-[#ffffff] text-shimmer">Órdenes</h1>
          <button onClick={load} className="px-4 py-2 rounded-md bg-[#d4af37] text-[#000000] hover:bg-[#c5a028] font-semibold hover:scale-105 transition-transform">Refrescar</button>
        </div>

        {loading && <p className="text-[#bfbfbf]">Cargando...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {ordenes.length === 0 && !loading && !error && (
          <p className="text-[#bfbfbf] col-span-full text-center py-8">No hay órdenes disponibles</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordenes.map((o) => (
            <div key={o.id} className="rounded-xl bg-[#000000]/50 border border-[#c5a028]/30 p-4 space-y-3 hover-glow">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl border border-[#d4af37] bg-[#d4af37]/10 flex flex-col items-center justify-center">
                  <span className="text-xs text-[#bfbfbf]">Mesa</span>
                  <span className="text-2xl font-title font-bold text-[#d4af37]">{o.numeroMesa}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                      {o.estado || 'PENDIENTE'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-[#d4af37] font-semibold">{formatColones(calcularTotal(o))}</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-[#bfbfbf] space-y-1">
                <p>Productos: <span className="text-[#ffffff]">{contarProductos(o)}</span></p>
                {o.fechaCreacion && (
                  <p>Creado: <span className="text-[#ffffff]">{formatearFecha(o.fechaCreacion)}</span></p>
                )}
              </div>
              
              {/* Lista de productos */}
              {o.detalles && o.detalles.length > 0 && (
                <div className="border-t border-[#c5a028]/30 pt-2 mt-2">
                  <p className="text-xs text-[#d4af37] font-semibold mb-2">Productos:</p>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {o.detalles.slice(0, 3).map((detalle, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-[#bfbfbf]">
                        <span>{detalle.producto?.nombre || detalle.nombreProducto || 'Producto'}</span>
                        <span className="text-[#ffffff]">{detalle.cantidad}x {formatColones(detalle.precioUnitario || 0)}</span>
                      </div>
                    ))}
                    {o.detalles.length > 3 && (
                      <p className="text-xs text-[#d4af37] italic">+{o.detalles.length - 3} más...</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={() => onEdit(o)} className="px-3 py-1.5 rounded-md bg-[#d4af37] text-[#000000] hover:bg-[#c5a028] font-semibold hover:scale-105 transition-transform">Editar</button>
                {o.estado === 'LISTO' && (
                  <button 
                    onClick={() => confirmarEntrega(o.id)} 
                    className="px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 font-semibold hover:scale-105 transition-transform flex items-center gap-1"
                  >
                    <span className="text-sm"></span> Entregar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      <ModalEditarOrdenCompleta
        open={open}
        orden={sel}
        onClose={() => setOpen(false)}
        onUpdated={() => {
          setOpen(false);
          load();
        }}
      />

      {/* Modal de confirmación de entrega */}
      {modalEntrega.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#000000] to-[#1a1a1a] border border-[#c5a028]/30 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-[#ffffff]">¿Confirmar entrega de la orden?</h3>
            <p className="text-[#bfbfbf] mb-6">Esta acción marcará la orden como entregada y quedará lista para ser cobrada por el cajero.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setModalEntrega({ isOpen: false, ordenId: null })}
                className="px-4 py-2 text-[#bfbfbf] hover:bg-[#ffffff]/10 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => realizarEntrega(modalEntrega.ordenId)}
                className="px-4 py-2 bg-[#d4af37] text-[#000000] rounded-lg hover:bg-[#c5a028] transition-colors font-semibold"
              >
                Confirmar Entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default OrdenesMesero;
