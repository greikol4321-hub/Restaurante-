import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaClipboardCheck, FaReceipt, FaBoxOpen } from 'react-icons/fa';
import HeaderCajero from './HeaderCajero';
import { pedidosApi, mesaOrdenesApi } from '../../utils/api';
import { formatColones } from '../../utils/formatters';
import PageLayout from '../common/PageLayout';

const MetricCard = ({ title, value, icon: Icon, isMonetary = false, isHighlighted = false, color = 'blue' }) => {
  const colors = {
    blue: { border: 'border-blue-500/20', hover: 'hover:border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-400', bar: 'bg-blue-500' },
    green: { border: 'border-green-500/20', hover: 'hover:border-green-500/50', bg: 'bg-green-500/10', text: 'text-green-400', bar: 'bg-green-500' },
    orange: { border: 'border-orange-500/20', hover: 'hover:border-orange-500/50', bg: 'bg-orange-500/10', text: 'text-orange-400', bar: 'bg-orange-500' },
    gold: { border: 'border-[#d4af37]/30', hover: 'hover:border-[#d4af37]/70', bg: 'bg-[#d4af37]/10', text: 'text-[#d4af37]', bar: 'bg-[#d4af37]' }
  };
  
  const c = isHighlighted ? colors.gold : colors[color];
  
  return (
    <div className={`relative bg-[#0a0a0a] border ${c.border} ${c.hover} rounded-xl p-6 
                    transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg`}>
      {/* Icono flotante superior derecha */}
      <div className={`absolute top-4 right-4 w-12 h-12 ${c.bg} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
      
      {/* Contenido */}
      <div className="pr-16">
        <p className="text-xs text-[#888888] uppercase tracking-wider mb-2">{title}</p>
        <p className={`text-3xl font-bold ${c.text} mb-2`}>
          {isMonetary ? formatColones(value) : value}
        </p>
        {/* Barra de progreso decorativa */}
        <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div className={`h-full ${c.bar} rounded-full animate-pulse`} style={{width: isHighlighted ? '90%' : '60%'}}></div>
        </div>
      </div>
      {/* Eliminado el indicador de tendencia */}
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  isMonetary: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  color: PropTypes.string,
};

const HomeCajero = () => {
  const navigate = useNavigate();
  const [metricas, setMetricas] = useState({
    pendientes: 0,
    cancelados: 0,
    totalPedidos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerMetricas = async () => {
    try {
      setLoading(true);
      const [respuestaPedidos, respuestaMesas] = await Promise.all([
        pedidosApi.listarPedidos(),
        mesaOrdenesApi.listarOrdenes(),
      ]);
      const pedidosData = respuestaPedidos.data || respuestaPedidos || [];
      const mesasData = respuestaMesas.data || respuestaMesas || [];
      const hoy = new Date().toDateString();
      const pedidosHoy = pedidosData.filter((pedido) => {
        const fechaPedido = new Date(pedido.fechaCreacion || pedido.fecha || Date.now()).toDateString();
        return fechaPedido === hoy;
      });
      const mesasHoy = mesasData.filter((orden) => {
        const fechaOrden = new Date(orden.fechaCreacion || orden.fecha || Date.now()).toDateString();
        return fechaOrden === hoy;
      });
      const pendientes = pedidosHoy.filter((p) => p.estado === 'PENDIENTE').length + mesasHoy.filter((m) => m.estado === 'PENDIENTE').length;
      const cancelados = pedidosHoy.filter((p) => p.estado === 'CANCELADO').length + mesasHoy.filter((m) => m.estado === 'CANCELADO').length;
      const totalPedidos = pedidosHoy.length + mesasHoy.length;
      setMetricas({ pendientes, cancelados, totalPedidos });
    } catch (err) {
      setError('Error al cargar las métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMetricas();
    const intervalo = setInterval(obtenerMetricas, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(intervalo);
  }, []);

  const usuario = JSON.parse(sessionStorage.getItem('user') || '{}');

  if (loading) {
    return (
      <PageLayout>
        <HeaderCajero />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center animate-slideInUp">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#d4af37] border-r-transparent border-b-[#c5a028] border-l-transparent mx-auto"></div>
            <p className="mt-6 text-[#bfbfbf] text-lg">Cargando métricas...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <HeaderCajero />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/30 backdrop-blur-sm rounded-2xl px-6 py-5 text-red-400 animate-slideInUp">
            <p className="font-medium">{error}</p>
            <button
              onClick={obtenerMetricas}
              className="mt-3 px-6 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all duration-300 hover:scale-105"
            >
              Reintentar
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <HeaderCajero />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <div className="animate-slideInUp">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#ffffff] mb-1">Dashboard de Caja</h1>
              <p className="text-[#888888]">Resumen de actividad del día</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                <p className="text-xs text-[#888888]">Última actualización</p>
                <p className="text-sm text-[#d4af37] font-medium">Hace 2 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <MetricCard
            title="Pedidos Pendientes"
            value={metricas.pendientes}
            icon={FaClipboardCheck}
            color="blue"
          />
          <MetricCard 
            title="Pedidos Cancelados" 
            value={metricas.cancelados} 
            icon={FaBoxOpen}
            color="orange"
          />
          <MetricCard
            title="Total de pedidos del día"
            value={metricas.totalPedidos}
            icon={FaReceipt}
            color="green"
          />
        </div>

        {/* Acciones rápidas */}
        <div className="grid md:grid-cols-2 gap-5">
          <button
            onClick={() => navigate('/cajero/pedidos')}
            className="group relative bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#d4af37]/50 
                     rounded-xl p-6 text-left transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#ffffff] mb-1">Gestionar Pedidos</h3>
                <p className="text-sm text-[#888888]">Ver y procesar pedidos pendientes</p>
              </div>
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center
                            group-hover:bg-[#d4af37]/20 transition-colors duration-300">
                <svg className="w-6 h-6 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#ffffff] mb-4">Estado del Sistema</h3>
            <div className="space-y-3">
              {[
                { label: 'Caja abierta', status: 'Activo', color: 'green' },
                { label: 'Conexión', status: 'Estable', color: 'blue' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color === 'green' ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`}></div>
                    <span className={`text-sm font-medium ${item.color === 'green' ? 'text-green-400' : 'text-blue-400'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomeCajero;
