import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import Header from './Header';
import { menuApi } from '../../utils/api';
import { formatColones } from '../../utils/formatters';
import { useToast } from '../common/ToastContainer';
import { removeCachedImage } from '../../utils/imageCache';
import PageLayout from '../common/PageLayout';

/* -------------------- FORMULARIO DE PRODUCTOS -------------------- */
const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagenUrl: '',
    categoriaId: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    // Solo actualizar el formulario cuando tengamos tanto el producto como las categorías cargadas
    if (product && categorias.length > 0) {
      console.log('Producto a editar:', product);
      console.log('Categorías disponibles:', categorias);
      
      // Intentar obtener el ID de la categoría de múltiples formas posibles
      const catId = product.categoriaId || product.categoria?.id || '';
      console.log('Categoria ID detectada:', catId);
      console.log('Estructura de categoría completa:', product.categoria);
      
      setForm({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        imagenUrl: product.imagenUrl || '',
        categoriaId: String(catId), // Convertir a string para que coincida con el select
      });
    } else if (!product) {
      // Limpiar el formulario si no hay producto
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        imagenUrl: '',
        categoriaId: '',
      });
    }
  }, [product, categorias]);

  const fetchCategorias = async () => {
    try {
      const response = await menuApi.obtenerCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        imagenUrl: '',
        categoriaId: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Guardando...';
    if (product) return 'Actualizar';
    return 'Crear';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-[#bfbfbf] mb-2">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full rounded-xl bg-[#111111] border border-[#c5a028]/30 px-4 py-3
                   text-[#ffffff] placeholder-[#bfbfbf]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-[#bfbfbf] mb-2">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
          rows="3"
          className="w-full rounded-xl bg-[#111111] border border-[#c5a028]/30 px-4 py-3
                   text-[#ffffff] placeholder-[#bfbfbf]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="precio" className="block text-sm font-medium text-[#bfbfbf] mb-2">
          Precio
        </label>
        <input
          id="precio"
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          className="w-full rounded-xl bg-[#111111] border border-[#c5a028]/30 px-4 py-3
                   text-[#ffffff] placeholder-[#bfbfbf]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="imagenUrl" className="block text-sm font-medium text-[#bfbfbf] mb-2">
          URL de Imagen
        </label>
        <input
          id="imagenUrl"
          type="url"
          name="imagenUrl"
          value={form.imagenUrl}
          onChange={handleChange}
          required
          className="w-full rounded-xl bg-[#111111] border border-[#c5a028]/30 px-4 py-3
                   text-[#ffffff] placeholder-[#bfbfbf]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="categoriaId" className="block text-sm font-medium text-[#bfbfbf] mb-2">
          Categoría {categorias.length > 0 && (
            <span className="text-[#d4af37]/60 text-xs ml-2">
              ({categorias.length} disponibles)
            </span>
          )}
        </label>
        <select
          id="categoriaId"
          name="categoriaId"
          value={form.categoriaId}
          onChange={handleChange}
          required
          className="w-full rounded-xl bg-[#111111] border border-[#c5a028]/30 px-4 py-3
                   text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {form.categoriaId && (
          <p className="text-[#d4af37]/80 text-xs mt-1">
            ✓ Categoría seleccionada: {categorias.find(c => c.id === parseInt(form.categoriaId))?.nombre || form.categoriaId}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-[#1a1a1a] text-[#bfbfbf] border border-[#c5a028]/30 rounded-full font-medium
                     hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#d4af37] text-[#000000] rounded-full font-semibold
                   hover:bg-[#c5a028] transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

/* -------------------- DIÁLOGO DE CONFIRMACIÓN -------------------- */
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0b0b0b] border border-[#c5a028]/30 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-title font-bold text-[#d4af37] mb-3">{title}</h3>
        <p className="text-[#bfbfbf] mb-8 text-lg">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-[#1a1a1a] text-[#bfbfbf] border border-[#c5a028]/30 rounded-full font-medium
                       hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 text-[#ffffff] rounded-full font-semibold
                       hover:bg-red-700 transition-colors duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

/* -------------------- COMPONENTE PRINCIPAL -------------------- */
const ProductAdmin = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, product: null });

  // Scroll automático al formulario cuando se abre
  useEffect(() => {
    if (showForm) {
      setTimeout(() => {
        const formElement = document.getElementById('product-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showForm]);

  const fetchProducts = async (search = '') => {
    try {
      setLoading(true);
      const response = search
        ? await menuApi.buscarProductos(search)
        : await menuApi.obtenerProductos();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await menuApi.obtenerCategorias();
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  // Cargar productos y categorías inicialmente
  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    if (!searchTerm) {
      fetchProducts();
      return;
    }

    const delaySearch = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleCreateUpdate = async (formData) => {
    try {
      setError('');
      setSuccess('');
      
      // Buscar el nombre de la categoría usando el categoriaId
      let categoriaNombre;
      
      if (formData.categoriaId) {
        // Usuario seleccionó una categoría en el formulario
        categoriaNombre = categorias.find(c => c.id === parseInt(formData.categoriaId))?.nombre;
      } else if (editingProduct?.categoria?.nombre) {
        // Mantener la categoría actual del producto si no se cambió
        categoriaNombre = editingProduct.categoria.nombre;
      }
      
      if (!categoriaNombre) {
        showError('Debe seleccionar una categoría válida');
        setError('❌ Debe seleccionar una categoría válida');
        return;
      }
      
      // Preparar los datos para enviar al backend con categoriaNombre
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        imagenUrl: formData.imagenUrl,
        categoriaNombre: categoriaNombre // Backend espera categoriaNombre, no categoriaId
      };
      
      if (editingProduct) {
        showInfo('Actualizando producto...');
        await menuApi.actualizarProducto(editingProduct.id, dataToSend);
        showSuccess(`¡Producto "${formData.nombre}" actualizado exitosamente!`);
        setSuccess(`¡Producto "${formData.nombre}" actualizado exitosamente!`);
      } else {
        showInfo('Creando producto...');
        await menuApi.crearProducto(dataToSend);
        showSuccess(`¡Producto "${formData.nombre}" creado exitosamente!`);
        setSuccess(`¡Producto "${formData.nombre}" creado exitosamente!`);
      }
      
      fetchProducts(searchTerm);
      setShowForm(false);
      setEditingProduct(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al guardar el producto';
      showError(errorMsg);
      setError(`❌ ${errorMsg}`);
      console.error(err);
    }
  };

  const handleDelete = async (product) => {
    try {
      setError('');
      setSuccess('');
      showInfo('Eliminando producto...');
      
      // Eliminar producto del servidor
      await menuApi.eliminarProducto(product.id);
      
      // Eliminar imagen del caché
      await removeCachedImage(product.id);
      
      showSuccess(`¡Producto "${product.nombre}" eliminado exitosamente!`);
      setSuccess(`¡Producto "${product.nombre}" eliminado exitosamente!`);
      setConfirmDelete({ show: false, product: null });
      fetchProducts(searchTerm);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al eliminar el producto';
      showError(errorMsg);
      setError(`❌ ${errorMsg}`);
      console.error(err);
    }
  };

  return (
    <PageLayout>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto animate-slideInUp">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-title font-bold text-[#d4af37]">Gestión de Productos</h1>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="bg-[#d4af37] text-[#000000] px-6 py-3 rounded-full font-semibold
                       hover:bg-[#c5a028] transition-colors duration-200 flex items-center space-x-2"
            >
              <FaPlus />
              <span>Nuevo Producto</span>
            </button>
          </div>

          <div className="mb-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#bfbfbf]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="pl-12 pr-4 py-3 w-full rounded-xl bg-[#111111] border border-[#c5a028]/30
                         text-[#ffffff] placeholder-[#bfbfbf]/50 focus:outline-none focus:ring-2 
                         focus:ring-[#d4af37] focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-600/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-600/10 border border-green-500/50 text-green-400 px-6 py-4 rounded-xl mb-6">
              {success}
            </div>
          )}

          {showForm && (
            <div 
              id="product-form"
              className="bg-[#0b0b0b] border border-[#c5a028]/30 p-8 rounded-2xl mb-8 shadow-2xl
                       scroll-mt-24"
            >
              <h2 className="text-2xl font-title font-semibold text-[#d4af37] mb-6">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <ProductForm
                product={editingProduct}
                onSubmit={handleCreateUpdate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent 
                              rounded-full animate-spin"></div>
              </div>
              <p className="text-[#bfbfbf] text-lg">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                           border-2 border-[#c5a028]/20 hover:border-[#d4af37]/60 
                           rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.3)]
                           hover:shadow-[0_8px_24px_rgba(212,175,55,0.2)]
                           transition-all duration-200 overflow-hidden
                           will-change-transform"
                >
                  {/* Imagen del producto */}
                  <div className="relative h-56 overflow-hidden bg-[#0a0a0a]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-transparent z-10"></div>
                    <img
                      src={product.imagenUrl}
                      alt={product.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-[#d4af37] 
                                  px-4 py-2 rounded-full border-2 border-[#c5a028]">
                      <span className="text-[#000000] font-black text-lg">
                        {formatColones(product.precio)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Contenido */}
                  <div className="relative p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-[#d4af37] 
                                   transition-colors duration-200 line-clamp-1">
                        {product.nombre}
                      </h3>
                      <p className="text-[#888888] text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {product.descripcion}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-4 border-t-2 border-[#c5a028]/20">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                          showInfo(`Editando producto: ${product.nombre}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                                 bg-gradient-to-br from-[#d4af37]/20 to-[#c5a028]/20 
                                 border-2 border-[#d4af37]/50 text-[#d4af37] rounded-2xl 
                                 hover:from-[#d4af37] hover:to-[#c5a028] hover:text-[#000000]
                                 hover:border-[#d4af37] transition-colors duration-200
                                 font-bold"
                        title="Editar producto"
                      >
                        <FaEdit className="text-lg" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ show: true, product })}
                        className="px-4 py-3 bg-gradient-to-br from-red-600/20 to-red-700/20 
                                 border-2 border-red-500/50 text-red-400 rounded-2xl 
                                 hover:from-red-600 hover:to-red-700 hover:text-[#ffffff]
                                 hover:border-red-500 transition-colors duration-200"
                        title="Eliminar producto"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.show}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${confirmDelete.product?.nombre}"?`}
        onConfirm={() => handleDelete(confirmDelete.product)}
        onCancel={() => setConfirmDelete({ show: false, product: null })}
      />
    </PageLayout>
  );
};

export default ProductAdmin;
