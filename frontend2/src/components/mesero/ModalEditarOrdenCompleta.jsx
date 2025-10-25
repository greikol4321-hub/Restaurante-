import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { mesaOrdenesApi, menuApi } from '../../utils/api';
import { useToast } from '../common/ToastContainer';

const groupByCategory = (items) => {
  const groups = {};
  items.forEach((it) => {
    const cat = it.categoria || 'Otros';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(it);
  });
  return groups;
};

const ModalEditarOrdenCompleta = ({ open, onClose, orden, onUpdated }) => {
  const { showSuccess, showError, showInfo } = useToast();
  const [items, setItems] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const categories = useMemo(() => ['Todos', ...new Set(items.map((i) => i.categoria || 'Otros'))], [items]);
  const grouped = useMemo(() => groupByCategory(items), [items]);

  const [cart, setCart] = useState({});
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && orden) {
      // Pre poblar desde la orden usando la estructura real: orden.detalles
      const initial = {};
      const lista = orden.detalles || [];
      
      
      lista.forEach((detalle) => {
        // Buscar el producto por ID desde la estructura real de detalles
        const productoId = detalle.producto?.id || detalle.productoId;
        const producto = detalle.producto || items.find((x) => x.id === productoId);
        
        if (producto && productoId) {
          initial[productoId] = { 
            producto: {
              id: productoId,
              nombre: producto.nombre || detalle.nombreProducto,
              precio: producto.precio || detalle.precioUnitario,
              categoria: producto.categoria,
              imagen: producto.imagenUrl || producto.imagen
            }, 
            qty: detalle.cantidad || 1 
          };
        }
      });
      
      setCart(initial);
      setFilter('Todos');
    }
  }, [open, orden, items]);

  // Cargar productos cuando se abre el modal
  useEffect(() => {
    const loadProductos = async () => {
      if (!open) return;
      
      // Verificar si ya tenemos productos en memoria
      if (Array.isArray(window.menuItemsGlobal) && window.menuItemsGlobal.length > 0) {
        setItems(window.menuItemsGlobal);
        return;
      }
      
      setLoadingProducts(true);
      try {
        const res = await menuApi.obtenerProductos();
        const data = res?.data ?? res ?? [];
        
        if (Array.isArray(data) && data.length > 0) {
          // Normalizar la estructura de productos
          const normalizedData = data.map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            categoria: p.categoria?.nombre || p.categoria || 'Otros',
            imagen: p.imagenUrl || p.imagen,
            descripcion: p.descripcion
          }));
          
          window.menuItemsGlobal = normalizedData;
          setItems(normalizedData);
        }
      } catch (e) {
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadProductos();
  }, [open]);

  const addToCart = (producto) => {
    setCart((prev) => {
      const curr = prev[producto.id] || { producto, qty: 0 };
      showSuccess(`${producto.nombre} agregado`);
      return { ...prev, [producto.id]: { producto, qty: curr.qty + 1 } };
    });
  };
  const decFromCart = (id) => {
    setCart((prev) => {
      const curr = prev[id];
      if (!curr) return prev;
      const nextQty = curr.qty - 1;
      const clone = { ...prev };
      if (nextQty <= 0) delete clone[id];
      else clone[id] = { ...curr, qty: nextQty };
      return clone;
    });
  };
  const removeFromCart = (id) => {
    setCart((prev) => {
      const producto = prev[id]?.producto;
      if (producto) {
        showInfo(`${producto.nombre} eliminado`);
      }
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((sum, it) => sum + (Number(it.producto.precio) || 0) * it.qty, 0);

  const handleUpdate = async () => {
    if (!orden) return;
    setLoading(true);
    try {
      showInfo('Actualizando orden...');
      const payload = {
        numeroMesa: orden.numeroMesa || orden.mesaNumero,
        meseroId: orden.mesero?.id,
        detalles: cartItems.map(({ producto, qty }) => ({
          productoId: producto.id,
          cantidad: qty,
          precioUnitario: producto.precio
        }))
      };
      
      
      // Usar la API correcta para actualizar la orden
      await mesaOrdenesApi.actualizarOrden(orden.id, payload);
      
      showSuccess('¡Orden actualizada exitosamente!');
      onUpdated?.();
      onClose();
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || 'No fue posible actualizar la orden';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const productsToShow = filter === 'Todos' ? items : (grouped[filter] || []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/80">
      <div className="w-[95vw] max-w-6xl max-h-[90vh] bg-[#000000] text-[#ffffff] rounded-2xl overflow-hidden shadow-2xl border border-[#c5a028]/30">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c5a028]/30 bg-[#d4af37]/10">
          <div>
            <h3 className="text-lg font-title font-semibold text-[#d4af37]">Editar orden - Mesa {orden?.numeroMesa || orden?.mesaNumero}</h3>
            {orden && (
              <p className="text-xs text-[#bfbfbf] mt-1">
                ID: {orden.id} | Estado: {orden.estado} | Detalles: {orden.detalles?.length || 0}
              </p>
            )}
          </div>
          <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-[#d4af37] text-[#000000] hover:bg-[#c5a028] font-semibold">Cerrar</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Catálogo */}
          <div className="lg:col-span-8 p-5 space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-sm border font-medium ${
                    filter === c ? 'bg-[#d4af37] text-[#000000] border-[#d4af37]' : 'bg-[#000000]/50 border-[#c5a028]/30 text-[#ffffff] hover:bg-[#d4af37]/20 hover:border-[#d4af37]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Loading state para productos */}
            {loadingProducts && (
              <div className="flex items-center justify-center py-8">
                <div className="text-[#d4af37]">Cargando productos...</div>
              </div>
            )}

            {/* Error state */}
            {!loadingProducts && items.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-[#bfbfbf]">No se pudieron cargar los productos</div>
              </div>
            )}

            {/* Grid de productos */}
            {!loadingProducts && items.length > 0 && (
              <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {productsToShow.map((p) => (
                  <div key={p.id} className="rounded-xl overflow-hidden bg-[#000000]/50 border border-[#c5a028]/20 hover:border-[#d4af37]/50 hover-glow">
                    <div className="aspect-video bg-[#000000]/60">
                      {p.imagen ? (
                        <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#bfbfbf] text-sm">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-3 space-y-1.5">
                      <p className="font-semibold text-[#ffffff]">{p.nombre}</p>
                      <p className="text-[#bfbfbf] text-sm">{p.categoria || 'Otros'}</p>
                      <p className="text-[#d4af37] font-semibold font-title">$ {Number(p.precio || 0).toFixed(2)}</p>
                      <button
                        onClick={() => addToCart(p)}
                        className="w-full mt-2 px-3 py-1.5 rounded-md bg-[#d4af37] text-[#000000] hover:bg-[#c5a028] font-semibold hover:scale-105 transition-transform"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Carrito */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex flex-col max-h-[70vh]">
            <h4 className="font-title font-semibold mb-3 text-[#d4af37]">Productos de la orden</h4>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cartItems.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-[#bfbfbf] text-sm mb-2">No hay productos en el carrito.</p>
                  {orden && orden.detalles && orden.detalles.length > 0 && (
                    <p className="text-[#d4af37] text-xs">
                      Orden original tenía {orden.detalles.length} productos. 
                      {items.length === 0 ? ' Esperando productos...' : ' Agrega productos del catálogo.'}
                    </p>
                  )}
                </div>
              )}
              {cartItems.map(({ producto, qty }) => (
                <div key={producto.id} className="flex items-center gap-3 bg-[#000000]/40 rounded-lg p-3 border border-[#c5a028]/20">
                  <div className="w-14 h-14 bg-[#000000]/60 rounded-md overflow-hidden">
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#bfbfbf] text-xs">Sin imagen</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-[#ffffff]">{producto.nombre}</p>
                    <p className="text-[#bfbfbf] text-sm">$ {Number(producto.precio || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#000000]" onClick={() => decFromCart(producto.id)}>-</button>
                    <span className="w-6 text-center text-[#ffffff] font-semibold">{qty}</span>
                    <button className="px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#000000]" onClick={() => addToCart(producto)}>+</button>
                  </div>
                  <button className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white font-medium" onClick={() => removeFromCart(producto.id)}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-3 mt-3 border-t border-[#c5a028]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#bfbfbf] font-medium">Total</span>
                <span className="text-xl font-title font-semibold text-[#d4af37]">$ {total.toFixed(2)}</span>
              </div>
              <button
                disabled={loading || cartItems.length === 0}
                onClick={handleUpdate}
                className="w-full mt-3 px-4 py-2 rounded-lg bg-[#d4af37] text-[#000000] hover:bg-[#c5a028] font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Actualizando...' : 'Actualizar orden'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalEditarOrdenCompleta.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  orden: PropTypes.object,
  onUpdated: PropTypes.func,
};

export default ModalEditarOrdenCompleta;
