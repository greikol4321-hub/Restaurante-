import { useEffect, useState } from 'react';
import HeroCocinero from './HeroCocinero';
import HeaderCocinero from './HeaderCocinero';
import { pedidosApi, mesaOrdenesApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../common/PageLayout';

// Función auxiliar para formatear fecha
const getFechaHoy = () => new Date().toISOString().slice(0, 10);

const estadosActivos = ['PENDIENTE', 'PREPARANDO', 'PREPARADO'];

const metricasIniciales = {
  pendientes: 0,
  completadas: 0,
  canceladas: 0,
  totalOrdenes: 0,
  promedioCompletadas: 0,
};

const HomeCocinero = () => {
  const [nombre, setNombre] = useState('');
  const [metricas, setMetricas] = useState(metricasIniciales);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMetricas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener pedidos y órdenes
      const pedidosResponse = await pedidosApi.listarPedidos();
      const ordenesResponse = await mesaOrdenesApi.listarOrdenes();
      

      // Extraer los datos correctamente de las respuestas
      const pedidos = Array.isArray(pedidosResponse) ? pedidosResponse : [];
      const ordenes = ordenesResponse?.data || [];


      // Para métricas acumuladas (todo el sistema) contamos todos los pedidos y órdenes
      const pedidosAll = pedidos || [];
      const ordenesAll = ordenes || [];


      let pendientes = 0,
        completadas = 0,
        canceladas = 0;

      // Estados para la cocina
      const estadosCompletados = ['PREPARADO', 'LISTO', 'ENTREGADO', 'COBRADO', 'PAGADO'];
      const estadosPendientes = ['PENDIENTE', 'PREPARANDO'];

      // Contar pedidos en cada estado (todo el historial)
      pedidosAll.forEach(pedido => {
        const estado = pedido.estado?.toUpperCase() || '';
        if (estadosPendientes.includes(estado)) {
          pendientes++;
        } else if (estadosCompletados.includes(estado)) {
          completadas++;
        } else if (estado === 'CANCELADO') {
          canceladas++;
        }
      });

      // Contar órdenes de mesa en cada estado (todo el historial)
      ordenesAll.forEach(orden => {
        const estado = orden.estado?.toUpperCase() || '';
        if (estadosPendientes.includes(estado)) {
          pendientes++;
        } else if (estadosCompletados.includes(estado)) {
          completadas++;
        } else if (estado === 'CANCELADO') {
          canceladas++;
        }
      });

      const totalOrdenes = pedidosAll.length + ordenesAll.length;
      const promedioCompletadas = totalOrdenes > 0 ? ((completadas / totalOrdenes) * 100).toFixed(1) : '0.0';

      
      setMetricas({ pendientes, completadas, canceladas, totalOrdenes, promedioCompletadas });
    } catch (err) {
      setError('Error al cargar métricas: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user || !user.rol || user.rol.toLowerCase() !== 'cocinero') {
      navigate('/');
      return;
    }
    setNombre(user?.nombre || 'Chef');
    
    // Cargar métricas inicialmente
    fetchMetricas();
    
    // Actualiza cada 30s
    const interval = setInterval(fetchMetricas, 30000);
    
    return () => clearInterval(interval);
  }, []); // Removido navigate de las dependencias ya que es estable

  return (
    <PageLayout>
      <HeaderCocinero />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto animate-slideInUp">
        <HeroCocinero nombre={nombre} />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            label="Total de órdenes del sistema"
            value={metricas.totalOrdenes}
            loading={loading}
            color="text-[#d4af37]"
          />
          <MetricCard
            label="Órdenes canceladas"
            value={metricas.canceladas}
            loading={loading}
            color="text-red-400"
          />
          <MetricCard
            label="Promedio de órdenes completadas (%)"
            value={metricas.promedioCompletadas}
            loading={loading}
            color="text-green-400"
          />
          <MetricCard
            label="Órdenes completadas"
            value={metricas.completadas}
            loading={loading}
            color="text-green-400"
          />
          <MetricCard
            label="Órdenes pendientes"
            value={metricas.pendientes}
            loading={loading}
            color="text-orange-400"
          />
        </div>
        {error && (
          <div className="mt-6 p-5 bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/30 backdrop-blur-sm rounded-2xl text-red-400 font-medium fade-up">
            {error}
          </div>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/ordenes-cocina')}
            className="px-8 py-3 bg-[#d4af37] text-black font-semibold rounded-lg hover:bg-[#c5a028] transition-colors duration-200"
          >
            Ver Órdenes Detalladas
          </button>
          <button
            onClick={fetchMetricas}
            disabled={loading}
            className="px-8 py-3 bg-[#333333] text-white font-semibold rounded-lg hover:bg-[#444444] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Actualizando...' : 'Actualizar Métricas'}
          </button>
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

const MetricCard = ({ label, value, loading, color = 'text-[#d4af37]' }) => (
  <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6 transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-lg">
    <h3 className="text-sm text-gray-400 mb-2">{label}</h3>
    <div className="text-3xl font-bold mb-2">
      {loading ? (
        <span className="inline-block animate-pulse text-gray-500">...</span>
      ) : (
        <span className={color}>{value}</span>
      )}
    </div>
  </div>
);

export default HomeCocinero;