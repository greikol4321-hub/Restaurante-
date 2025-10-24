import { useState } from 'react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { menuApi } from '../../utils/api';
import { clearImageCache } from '../../utils/imageCache';

const EliminarTodosProductos = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const eliminarTodosLosProductos = async () => {
    try {
      setLoading(true);
      setResultado(null);
      
      console.log('🗑️ Iniciando eliminación de todos los productos...');
      
      // Obtener todos los productos
      const response = await menuApi.obtenerProductos();
      const productos = response.data || response || [];
      
      console.log(`📋 Se encontraron ${productos.length} productos para eliminar`);
      
      if (productos.length === 0) {
        setResultado({
          tipo: 'info',
          mensaje: 'No hay productos para eliminar',
          eliminados: 0,
          errores: 0,
          total: 0
        });
        return;
      }
      
      let eliminados = 0;
      let errores = 0;
      const detalles = [];
      
      // Eliminar cada producto
      for (const producto of productos) {
        try {
          await menuApi.eliminarProducto(producto.id);
          eliminados++;
          detalles.push(`✅ ${producto.nombre}`);
          console.log(`✅ Producto eliminado: ${producto.nombre} (ID: ${producto.id})`);
        } catch (error) {
          errores++;
          detalles.push(`❌ ${producto.nombre} - Error: ${error.message}`);
          console.error(`❌ Error al eliminar producto ${producto.nombre}:`, error);
        }
      }
      
      // Limpiar el caché de productos y las imágenes
      localStorage.removeItem('menuProducts');
      localStorage.removeItem('menuCategories');
      localStorage.removeItem('menuCacheTimestamp');
      await clearImageCache();
      console.log('🗑️ Caché de imágenes limpiado');
      
      setResultado({
        tipo: eliminados === productos.length ? 'success' : errores > 0 ? 'warning' : 'error',
        mensaje: eliminados === productos.length 
          ? '¡Todos los productos fueron eliminados exitosamente!' 
          : errores > 0 
            ? 'Algunos productos fueron eliminados, pero hubo errores'
            : 'No se pudo eliminar ningún producto',
        eliminados,
        errores,
        total: productos.length,
        detalles
      });
      
    } catch (error) {
      console.error('💥 Error al obtener la lista de productos:', error);
      setResultado({
        tipo: 'error',
        mensaje: `Error al obtener la lista de productos: ${error.message}`,
        eliminados: 0,
        errores: 1,
        total: 0
      });
    } finally {
      setLoading(false);
      setMostrarConfirmacion(false);
    }
  };

  const getColorClasses = (tipo) => {
    switch (tipo) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#000000] to-[#1a1a1a] border border-[#c5a028]/30 rounded-xl">
      <div className="flex items-center space-x-3 mb-4">
        <FaTrash className="text-red-400 text-xl" />
        <h3 className="text-xl font-bold text-[#ffffff]">Eliminar Todos los Productos</h3>
      </div>
      
      <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <FaExclamationTriangle className="text-red-400" />
          <span className="text-red-400 font-semibold">¡ADVERTENCIA!</span>
        </div>
        <p className="text-red-300 text-sm">
          Esta acción eliminará TODOS los productos de la base de datos de forma permanente. 
          Esta acción NO SE PUEDE DESHACER.
        </p>
      </div>

      {!mostrarConfirmacion ? (
        <button
          onClick={() => setMostrarConfirmacion(true)}
          disabled={loading}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Eliminando...' : 'Eliminar Todos los Productos'}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-[#ffffff] font-medium">
            ¿Estás completamente seguro de que quieres eliminar TODOS los productos?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={eliminarTodosLosProductos}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Eliminando...' : 'SÍ, Eliminar Todo'}
            </button>
            <button
              onClick={() => setMostrarConfirmacion(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="mt-2 text-[#bfbfbf]">Eliminando productos...</p>
        </div>
      )}

      {resultado && (
        <div className={`mt-4 p-4 rounded-lg border ${getColorClasses(resultado.tipo)}`}>
          <p className="font-semibold mb-2">{resultado.mensaje}</p>
          <div className="text-sm space-y-1">
            <p>✅ Eliminados: {resultado.eliminados}</p>
            <p>❌ Errores: {resultado.errores}</p>
            <p>📊 Total procesados: {resultado.total}</p>
          </div>
          
          {resultado.detalles && resultado.detalles.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium">Ver detalles</summary>
              <div className="mt-2 text-xs space-y-1 max-h-40 overflow-y-auto">
                {resultado.detalles.map((detalle, index) => (
                  <p key={index}>{detalle}</p>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default EliminarTodosProductos;