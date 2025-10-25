import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { FaBox, FaUsers, FaReceipt, FaCalendar, FaTrash } from 'react-icons/fa';
import Header from './Header';
import PageLayout from '../common/PageLayout';

const AdminButton = ({ icon: Icon, text, to, gradient }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="group relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] 
                 border-2 border-[#c5a028]/20 hover:border-[#d4af37]/60
                 p-8 rounded-3xl transition-all duration-500
                 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                 hover:shadow-[0_12px_48px_rgba(212,175,55,0.3)]
                 transform hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* Barra superior gradiente */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${gradient} opacity-0 group-hover:opacity-100 
                     transition-opacity duration-300 rounded-t-3xl`}></div>
      
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/0 rounded-full blur-3xl 
                    group-hover:bg-[#d4af37]/15 transition-all duration-500"></div>
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-[#c5a028]/10 
                        border-2 border-[#d4af37]/30 flex items-center justify-center
                        group-hover:border-[#d4af37] group-hover:scale-110 group-hover:from-[#d4af37]/20 
                        group-hover:to-[#c5a028]/20 transition-all duration-300 group-hover:rotate-6
                        shadow-lg group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          <Icon className="w-9 h-9 text-[#d4af37] group-hover:text-[#f4d47b] transition-colors duration-300" />
        </div>
        
        <div className="flex-1 text-left">
          <h3 className="text-2xl font-black text-[#ffffff] mb-2 group-hover:text-[#d4af37] 
                       transition-colors duration-300">
            {text}
          </h3>
          <p className="text-sm text-[#888888] group-hover:text-[#bfbfbf] transition-colors duration-300
                      font-semibold">
            Click para gestionar →
          </p>
        </div>
        
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#d4af37]/10 border-2 border-[#d4af37]/30
                      flex items-center justify-center group-hover:bg-[#d4af37] group-hover:border-[#d4af37]
                      transition-all duration-300 group-hover:translate-x-2 shadow-lg">
          <svg className="w-6 h-6 text-[#d4af37] group-hover:text-[#000000] transition-colors duration-300" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

AdminButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  gradient: PropTypes.string,
};

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProductos: '---',
    totalUsuarios: '---',
    reservasActivas: '---',
    totalPedidos: '---',
    pedidosPendientes: '---',
    reservasCompletadas: '---',
    usuariosActivos: '---',
  });

  const cargarEstadisticas = async () => {
    try {
      const [productos, usuarios, reservas, pedidos] = await Promise.all([
        axios.get('/api/productos'),
        axios.get('/api/usuarios'),
        axios.get('/api/reservas'),
        axios.get('/api/pedidos')
      ]);

      const reservasActivas = reservas.data.filter(
        r => !['COMPLETADA', 'CANCELADA'].includes(r.estado)
      ).length;

      const reservasCompletadas = reservas.data.filter(
        r => r.estado === 'COMPLETADA'
      ).length;

      const pedidosPendientes = pedidos.data.filter(
        p => p.estado === 'PENDIENTE'
      ).length;

      const usuariosActivos = usuarios.data.filter(
        u => u.activo === true
      ).length;

      setStats({
        totalProductos: productos.data.length.toString(),
        totalUsuarios: usuarios.data.length.toString(),
        reservasActivas: reservasActivas.toString(),
        reservasCompletadas: reservasCompletadas.toString(),
        totalPedidos: pedidos.data.length.toString(),
        pedidosPendientes: pedidosPendientes.toString(),
        usuariosActivos: usuariosActivos.toString(),
      });
    } catch (error) {
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user?.rol?.toLowerCase() !== 'admin') {
      navigate('/');
    } else {
      cargarEstadisticas();
    }
  }, [navigate]);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const estadisticas = [
    { label: 'Total Productos', value: stats.totalProductos },
    { label: 'Total Usuarios', value: stats.totalUsuarios },
    { label: 'Usuarios Activos', value: stats.usuariosActivos },
    { label: 'Reservas Activas', value: stats.reservasActivas },
    { label: 'Reservas Completadas', value: stats.reservasCompletadas },
    { label: 'Total Pedidos', value: stats.totalPedidos },
    { label: 'Pedidos Pendientes', value: stats.pedidosPendientes },
  ];

  return (
    <PageLayout>
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto animate-slideInUp">
          {/* Header */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] border border-[#d4af37]/20 rounded-2xl p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#ffffff] mb-2">
                    Panel de Administración
                  </h1>
                  <p className="text-[#888888]">
                    Bienvenido, <span className="text-[#d4af37] font-semibold">{user.nombre || 'Admin'}</span>
                  </p>
                </div>
                <div className="px-6 py-3 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl">
                  <p className="text-sm text-[#888888]">ROL</p>
                  <p className="text-lg font-bold text-[#d4af37]">ADMINISTRADOR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de opciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminButton icon={FaBox} text="Productos" to="/admin/productos" gradient="bg-gradient-to-r from-blue-500 to-cyan-500" />
            <AdminButton icon={FaUsers} text="Usuarios" to="/admin/usuarios" gradient="bg-gradient-to-r from-purple-500 to-pink-500" />
            <AdminButton icon={FaReceipt} text="Pedidos" to="/admin/pedidos" gradient="bg-gradient-to-r from-orange-500 to-red-500" />
            <AdminButton icon={FaCalendar} text="Reservas" to="/admin/reservas" gradient="bg-gradient-to-r from-green-500 to-emerald-500" />
            <AdminButton icon={FaTrash} text="Herramientas" to="/admin/tools" gradient="bg-gradient-to-r from-red-600 to-red-800" />
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {estadisticas.map((stat, i) => (
              <div key={i} className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] 
                                    border-2 border-[#c5a028]/20 hover:border-[#d4af37]/60 
                                    rounded-2xl p-5 text-center transition-all duration-500
                                    shadow-[0_4px_16px_rgba(0,0,0,0.3)]
                                    hover:shadow-[0_8px_32px_rgba(212,175,55,0.2)]
                                    hover:scale-105 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 to-[#d4af37]/5 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <p className="text-xs text-[#888888] mb-3 uppercase tracking-widest font-bold 
                              group-hover:text-[#bfbfbf] transition-colors duration-300">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-black bg-gradient-to-r from-[#d4af37] to-[#f4d47b] 
                              bg-clip-text text-transparent group-hover:scale-110 
                              transition-transform duration-300 inline-block">
                    {stat.value}
                  </p>
                </div>
                
                {/* Barra decorativa */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                              from-transparent via-[#d4af37] to-transparent opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminHome;
