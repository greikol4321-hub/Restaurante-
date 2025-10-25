import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { mesaOrdenesApi, menuApi } from '../../utils/api';
import { formatColones } from '../../utils/formatters';
import { useToast } from '../common/ToastContainer';

const groupByCategory = (items) => {
  const groups = {};
  items.forEach((item) => {
    const cat = item.categoria?.nombre || 'Otros';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });
  return groups;
};

const ModalCrearOrden = ({ mesa, open, onClose, onCreated }) => {
  // Estados
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [filter, setFilter] = useState('Todos');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['Todos']);

  // Memos
  const grouped = useMemo(() => groupByCategory(items), [items]);
  
  const productsToShow = useMemo(() => {
    if (filter === 'Todos') return items;
    return grouped[filter] || [];
  }, [filter, items, grouped]);

  // Efectos
  useEffect(() => {
    if (!open) {
      setCart({});
      setFilter('Todos');
    }
  }, [open]);

  // Cargar categorías y productos cuando se abre el modal
  useEffect(() => {
    if (!open) return;

    const loadCategorias = async () => {
      try {
        const catRes = await menuApi.obtenerCategorias();
        const categorias = Array.isArray(catRes?.data) ? catRes.data : [];
        if (categorias.length > 0) {
          const categoriasOrdenadas = categorias
            .map(cat => cat.nombre)
            .sort((a, b) => a.localeCompare(b));
          setCategories(['Todos', ...categoriasOrdenadas]);
        }
      } catch (error) {
      }
    };

    const loadProductos = async () => {
      try {
        setLoading(true);
        const res = await menuApi.obtenerProductos();
        const data = Array.isArray(res?.data) ? res.data : res || [];

        if (data.length === 0) {
          setItems([]);
          return;
        }

        setItems(data);
      } catch (error) {
        alert('Error al cargar el menú. Verifica la conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    };
    // Cargar datos cuando se abre el modal
    Promise.all([
      loadCategorias(),
      loadProductos()
    ]).catch(error => {
      alert('Error al cargar los datos. Por favor, intenta nuevamente.');
    });
  }, [open]);

  const addToCart = (producto) => {
    setCart((prev) => {
      const curr = prev[producto.id] || { producto, qty: 0 };
      showSuccess(`${producto.nombre} agregado al carrito`);
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
        showInfo(`${producto.nombre} eliminado del carrito`);
      }
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce(
    (sum, it) => sum + (Number(it.producto.precio) || 0) * it.qty,
    0
  );

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      showWarning('Agrega productos al carrito antes de enviar la orden');
      return;
    }

    setLoading(true);
    try {
      showInfo('Creando orden...');
      const userStr = sessionStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const meseroId = user?.id ?? null;

      const payload = {
        numeroMesa: mesa,
        meseroId,
        estado: 'OCUPADA', // Estado inicial de la mesa
        detalles: cartItems.map(({ producto, qty }) => ({
          productoId: producto.id,
          cantidad: qty,
          precioUnitario: producto.precio,
          estado: 'PENDIENTE' // Estado inicial del item
        })),
      };


      // Crear la orden
      const response = await mesaOrdenesApi.crearOrden(payload);

      // La orden ya se crea con estado OCUPADA, no necesitamos actualizarlo
      showSuccess(`¡Orden creada! Mesa ${mesa} - Total: ${formatColones(total)}`);
      
      // Notificar al componente padre con la orden creada
      onCreated?.(response.data);
      onClose?.();
    } catch (err) {

      let errorMsg = 'No fue posible crear la orden';
      if (err.response?.status === 500) {
        errorMsg = 'Error del servidor. Verifica que el backend esté funcionando';
      } else if (err.response?.status === 401) {
        errorMsg = 'No tienes permisos. Inicia sesión nuevamente';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Error de conexión. Verifica que el servidor esté corriendo';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
      <div className="w-[95vw] max-w-6xl max-h-[90vh] bg-black text-white rounded-2xl overflow-hidden shadow-2xl border border-[#c5a028]/30">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c5a028]/30 bg-[#d4af37]/10">
          <h3 className="text-lg font-title font-semibold text-[#d4af37]">
            Crear orden - Mesa {mesa}
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-[#d4af37] text-black hover:bg-[#c5a028] font-semibold"
          >
            Cerrar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Catálogo */}
          <div className="lg:col-span-8 p-5 space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                // Asegurarse de que la categoría sea una cadena
                const catName = String(category || 'Otros');
                return (
                  <button
                    key={catName}
                    onClick={() => setFilter(catName)}
                    className={`px-3 py-1.5 rounded-full text-sm border font-medium ${
                      filter === catName
                        ? 'bg-[#d4af37] text-black border-[#d4af37]'
                        : 'bg-black/50 border-[#c5a028]/30 text-white hover:bg-[#d4af37]/20 hover:border-[#d4af37]'
                    }`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>

            {/* Productos */}
            <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {productsToShow.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl overflow-hidden bg-black/50 border border-[#c5a028]/20 hover:border-[#d4af37]/50 transition-all"
                >
                  <div className="aspect-video bg-black/60">
                    {p.imagenUrl && !['null', 'undefined', ''].includes(p.imagenUrl) ? (
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x100?text=Sin+imagen';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#d4af37]/60 gap-1">
                        <span className="text-2xl">Sin imagen</span>
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-1.5">
                    <p className="font-semibold text-white">{p.nombre || 'Producto sin nombre'}</p>
                    <p className="text-[#bfbfbf] text-sm">{p.categoria?.nombre || 'Otros'}</p>
                    <p className="text-[#d4af37] font-semibold font-title">{formatColones(p.precio || 0)}</p>
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full mt-2 px-3 py-1.5 rounded-md bg-[#d4af37] text-black hover:bg-[#c5a028] font-semibold transition-transform hover:scale-105"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#c5a028]/30 p-5 flex flex-col max-h-[70vh]">
            <h4 className="font-title font-semibold mb-3 text-[#d4af37]">Carrito</h4>
            <div className="flex-1 overflow-y-auto space-y-3">
              {cartItems.length === 0 ? (
                <p className="text-[#bfbfbf] text-sm">No hay productos en el carrito.</p>
              ) : (
                cartItems.map(({ producto, qty }) => (
                  <div key={producto.id} className="flex items-center gap-3 bg-black/40 rounded-lg p-3 border border-[#c5a028]/20">
                    <div className="w-14 h-14 bg-[#111] rounded-md overflow-hidden">
                      {producto.imagenUrl && !['null', 'undefined', ''].includes(producto.imagenUrl) ? (
                        <img
                          src={producto.imagenUrl}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#d4af37]/60">
                          <span>Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white truncate">{producto.nombre}</p>
                      <p className="text-[#bfbfbf] text-sm">{formatColones(producto.precio)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                        onClick={() => decFromCart(producto.id)}
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-white font-semibold">{qty}</span>
                      <button
                        className="px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                        onClick={() => addToCart(producto)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white"
                      onClick={() => removeFromCart(producto.id)}
                    >
                      
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="pt-3 mt-3 border-t border-[#c5a028]/30">
              <div className="flex justify-between items-center">
                <span className="text-[#bfbfbf] font-medium">Total</span>
                <span className="text-xl font-title font-semibold text-[#d4af37]">
                  {formatColones(total)}
                </span>
              </div>
              <button
                disabled={loading || cartItems.length === 0}
                onClick={handleSubmit}
                className="w-full mt-3 px-4 py-2 rounded-lg bg-[#d4af37] text-black hover:bg-[#c5a028] font-semibold hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar orden'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalCrearOrden.propTypes = {
  mesa: PropTypes.number,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreated: PropTypes.func,
};

export default ModalCrearOrden;
