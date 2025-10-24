import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosApi, menuApi } from '../../utils/api';
import { useToast } from '../common/ToastContainer';
import { cacheProductImages, getCachedImage } from '../../utils/imageCache';
import ShoppingCart from '../cart/ShoppingCart';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import { FaArrowLeft } from 'react-icons/fa';
import PageLayout from '../common/PageLayout';

function MenuDigital() {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const cartRef = useRef(null);

  // Agregar showInfo para el mensaje de procesamiento
  const showInfo = useToast().showInfo;

  // Controlar el scroll para mostrar/ocultar la barra
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // Función para obtener la ruta del dashboard según el rol
  const getDashboardPath = (role) => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'CAJERO':
        return '/cajero';
      case 'COCINERO':
        return '/cocinero';
      case 'MESERO':
        return '/mesero';
      case 'CLIENTE':
        return '/home-usuario';
      case 'USUARIO':
        return '/home-usuario';
      default:
        return '/home-usuario';
    }
  };

  // Obtener rol del usuario
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.rol) {
      setUserRole(user.rol);
      console.log('Role del usuario:', user.rol); // Para debug
    }
  }, []);

  // Obtener productos y categorías (con cache)
  useEffect(() => {
    let isMounted = true;

    const fetchAndCacheData = async () => {
      // Forzar recarga si venimos de eliminar productos
      const forceReload = localStorage.getItem('forceReload');
      if (forceReload) {
        localStorage.removeItem('forceReload');
        localStorage.removeItem('menuProducts');
        localStorage.removeItem('menuCategories');
        localStorage.removeItem('menuCacheTimestamp');
      }

      const cachedProducts = localStorage.getItem('menuProducts');
      const cachedCategories = localStorage.getItem('menuCategories');
      const cacheTimestamp = localStorage.getItem('menuCacheTimestamp');

      const isCacheValid =
        cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < 300000;

      if (isCacheValid && cachedProducts && cachedCategories) {
        setProducts(JSON.parse(cachedProducts));
        setCategories(JSON.parse(cachedCategories));
        setLoading(false);
      } else {
        try {
          const productsResponse = await menuApi.obtenerProductos();
          const categoriesResponse = await menuApi.obtenerCategorias();

          if (isMounted) {
            const processedData = productsResponse.data
              .filter(product => {
                // Filtrar productos inválidos
                return (
                  product &&
                  product.id &&
                  product.nombre &&
                  product.precio &&
                  !isNaN(parseFloat(product.precio)) &&
                  parseFloat(product.precio) > 0 &&
                  product.categoria &&
                  product.categoria.nombre
                );
              })
              .map((product) => ({
                id: product.id,
                name: product.nombre,
                description: product.descripcion || '',
                price: Number(parseFloat(product.precio).toFixed(2)),
                imagenUrl: product.imagenUrl || null,
                category: product.categoria.nombre,
              }));

            const categorias = categoriesResponse.data.map((cat) => cat.nombre);

            setProducts(processedData);
            setCategories(categorias);
            setLoading(false);

            localStorage.setItem('menuProducts', JSON.stringify(processedData));
            localStorage.setItem('menuCategories', JSON.stringify(categorias));
            localStorage.setItem('menuCacheTimestamp', Date.now().toString());

            // Cachear imágenes de productos en segundo plano
            cacheProductImages(processedData).then(() => {
              console.log('✅ Imágenes de productos cacheadas');
            });
          }
        } catch (err) {
          if (isMounted) {
            console.error('Error al cargar los productos:', err);
            setError('Error al cargar los productos. Por favor, intente más tarde.');
            setLoading(false);
          }
        }
      }
    };

    fetchAndCacheData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Funciones del carrito
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    
    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      showSuccess(`${product.name} (x${existingItem.quantity + 1})`);
    } else {
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
      showSuccess(`${product.name} agregado al carrito`);
    }
    
    // Hacer scroll suave hacia el carrito en móvil/tablet
    setTimeout(() => {
      if (cartRef.current && window.innerWidth < 1024) {
        cartRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 100);
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    if (item) {
      showInfo(`${item.name} eliminado del carrito`);
    }
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handlePagar = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      console.log('Datos del usuario en sessionStorage:', user); // Debug

      if (!user) {
        showError('Debes iniciar sesión para realizar un pedido');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      if (!user.id) {
        showError('ID de usuario no encontrado. Por favor, inicia sesión nuevamente');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!user.rol) {
        showError('Rol de usuario no encontrado. Por favor, inicia sesión nuevamente');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (cartItems.length === 0) {
        showWarning('El carrito está vacío. Agrega productos antes de continuar');
        return;
      }

      console.log('Usuario validado:', { id: user.id, rol: user.rol }); // Debug
      
      showInfo('Procesando tu pedido...');
      
      const pedidoData = {
        usuarioId: user.id,
        estado: 'PENDIENTE',
        fechaPedido: new Date().toISOString(),
        detallesPedido: cartItems.map((item) => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.price
        }))
      };

      await pedidosApi.crearPedido(pedidoData);
      
      // Éxito
      showSuccess('¡Pedido creado exitosamente! Puedes ver su estado en "Mis Pedidos"');
      setCartItems([]); // Limpiar carrito después del pago
      
      // Redirigir a pedidos del usuario después de 2 segundos
      setTimeout(() => {
        navigate('/pedidos-usuario');
      }, 2000);
      
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      
      // Obtener mensaje de error del servidor
      const errorMessage = error.response?.data?.message || error.message;
      console.log('Mensaje de error:', errorMessage);

      // Manejar diferentes tipos de errores
      if (errorMessage.includes('Usuario no encontrado') || error.message === 'Usuario no encontrado') {
        showError('Usuario no encontrado. Por favor, inicia sesión nuevamente');
        setTimeout(() => navigate('/login'), 2000);
        return;
      } else if (errorMessage.includes('cantidad debe ser mayor')) {
        showError('Error: Verifica las cantidades de los productos');
      } else if (errorMessage.includes('producto no encontrado')) {
        showError('Error: Uno o más productos no están disponibles');
      } else if (error.response?.status === 500) {
        showError('Error del servidor. Por favor, intenta nuevamente más tarde');
      } else {
        showError('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente');
      }
      
      // Log detallado para debugging
      console.log('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
  };

  // Filtrado de productos
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (loading) return (
    <PageLayout>
      <div className="text-center py-24 animate-slideInUp">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#d4af37] border-r-transparent border-b-[#c5a028] border-l-transparent mx-auto"></div>
        <p className="mt-6 text-[#bfbfbf] text-lg">Cargando menú...</p>
      </div>
    </PageLayout>
  );
  
  if (error) return (
    <PageLayout>
      <div className="text-center py-24 text-red-400 animate-slideInUp">{error}</div>
    </PageLayout>
  );

  return (
    <PageLayout>
      {/* Barra de navegación y filtros */}
      <div className={`sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="bg-[#0a0a0a] border-b border-[#d4af37]/10 py-4 px-6 backdrop-blur-lg bg-opacity-80">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(getDashboardPath(userRole))}
                className="flex items-center gap-2 text-[#d4af37] hover:text-[#ffffff] transition-colors duration-300"
              >
                <FaArrowLeft />
                <span>Volver al Dashboard</span>
              </button>
              <h2 className="text-[#ffffff] font-semibold">Menú Digital</h2>
            </div>
          </div>
        </nav>
        
        <div className="bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#d4af37]/10 py-4 px-6">
          <div className="container mx-auto">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Sección principal del menú */}
          <div className="flex-1">

            {/* Grid de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          </div>

          {/* Carrito de compras */}
          <div ref={cartRef} className="lg:w-96 lg:sticky lg:top-[8rem]">
            <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl shadow-black/30 border border-[#d4af37]/10">
              <ShoppingCart
                cartItems={cartItems}
                onDecrease={decreaseQuantity}
                onIncrease={increaseQuantity}
                onRemove={removeFromCart}
                onPagar={handlePagar}
                pagarDisabled={cartItems.length === 0}
                autoExpand={true}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default MenuDigital;
