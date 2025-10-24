import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTools, FaArrowLeft, FaExclamationTriangle, FaTrash, FaCalendarTimes, 
         FaImage, FaChartBar, FaUtensils, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import EliminarTodosProductos from './EliminarTodosProductos';
import { pedidosApi, reservasApi, mesaOrdenesApi } from '../../utils/api';
import { clearImageCache } from '../../utils/imageCache';
import { useToast } from '../common/ToastContainer';
import axios from '../../utils/axios';
import PageLayout from '../common/PageLayout';

/* ==================== COMPONENTE: Eliminar Todos los Pedidos ==================== */
const EliminarTodosPedidos = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);

  const eliminarTodos = async () => {
    try {
      setLoading(true);
      showInfo('Eliminando todos los pedidos...');
      const response = await pedidosApi.listarPedidos();
      const pedidos = response.data || [];
      
      for (const pedido of pedidos) {
        await pedidosApi.eliminarPedido(pedido.id);
      }
      
      showSuccess(`✅ ${pedidos.length} pedidos eliminados exitosamente`);
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error('Error:', error);
      showError('❌ Error al eliminar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                  border-2 border-red-500/20 hover:border-red-500/60 
                  rounded-3xl p-6 transition-all duration-500 shadow-xl
                  hover:shadow-[0_12px_48px_rgba(239,68,68,0.3)] overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full 
                    blur-3xl group-hover:bg-red-500/15 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 
                        flex items-center justify-center shadow-lg">
            <FaTrash className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-red-400 
                         transition-colors duration-300">
              Eliminar Pedidos
            </h3>
            <p className="text-[#888888] text-sm">Eliminar todos los pedidos del sistema</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4">
          <p className="text-red-300 text-sm">
            ⚠️ Esta acción eliminará TODOS los pedidos de usuarios (app) de la base de datos de forma permanente.
          </p>
        </div>

        <button
          onClick={() => setMostrarConfirmacion(true)}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white 
                   rounded-2xl font-bold hover:from-red-700 hover:to-red-800
                   disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]
                   shadow-lg hover:shadow-red-500/50"
        >
          {loading ? '⏳ Eliminando...' : '🗑️ Eliminar Todos los Pedidos'}
        </button>

        {mostrarConfirmacion && (
          <ModalConfirmacion
            titulo="¿Eliminar todos los pedidos?"
            mensaje="Esta acción eliminará permanentemente TODOS los pedidos del sistema. No se puede deshacer."
            onConfirmar={eliminarTodos}
            onCancelar={() => setMostrarConfirmacion(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

/* ==================== COMPONENTE: Eliminar Todas las Reservas ==================== */
const EliminarTodasReservas = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);

  const eliminarTodas = async () => {
    try {
      setLoading(true);
      showInfo('Eliminando todas las reservas...');
      const response = await reservasApi.listarReservas();
      const reservas = response.data || [];
      
      for (const reserva of reservas) {
        await reservasApi.eliminarReserva(reserva.id);
      }
      
      showSuccess(`✅ ${reservas.length} reservas eliminadas exitosamente`);
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error('Error:', error);
      showError('❌ Error al eliminar las reservas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                  border-2 border-orange-500/20 hover:border-orange-500/60 
                  rounded-3xl p-6 transition-all duration-500 shadow-xl
                  hover:shadow-[0_12px_48px_rgba(249,115,22,0.3)] overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full 
                    blur-3xl group-hover:bg-orange-500/15 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 
                        flex items-center justify-center shadow-lg">
            <FaCalendarTimes className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-orange-400 
                         transition-colors duration-300">
              Eliminar Reservas
            </h3>
            <p className="text-[#888888] text-sm">Eliminar todas las reservas del sistema</p>
          </div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-4">
          <p className="text-orange-300 text-sm">
            ⚠️ Esta acción eliminará TODAS las reservas de la base de datos de forma permanente.
          </p>
        </div>

        <button
          onClick={() => setMostrarConfirmacion(true)}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white 
                   rounded-2xl font-bold hover:from-orange-700 hover:to-orange-800
                   disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]
                   shadow-lg hover:shadow-orange-500/50"
        >
          {loading ? '⏳ Eliminando...' : '📅 Eliminar Todas las Reservas'}
        </button>

        {mostrarConfirmacion && (
          <ModalConfirmacion
            titulo="¿Eliminar todas las reservas?"
            mensaje="Esta acción eliminará permanentemente TODAS las reservas del sistema. No se puede deshacer."
            onConfirmar={eliminarTodas}
            onCancelar={() => setMostrarConfirmacion(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

/* ==================== COMPONENTE: Limpiar Caché de Imágenes ==================== */
const LimpiarCacheImagenes = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [loading, setLoading] = useState(false);

  const limpiarCache = async () => {
    try {
      setLoading(true);
      showInfo('Limpiando caché de imágenes...');
      await clearImageCache();
      showSuccess('✅ Caché de imágenes limpiado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      showError('❌ Error al limpiar el caché');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                  border-2 border-purple-500/20 hover:border-purple-500/60 
                  rounded-3xl p-6 transition-all duration-500 shadow-xl
                  hover:shadow-[0_12px_48px_rgba(168,85,247,0.3)] overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full 
                    blur-3xl group-hover:bg-purple-500/15 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 
                        flex items-center justify-center shadow-lg">
            <FaImage className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-purple-400 
                         transition-colors duration-300">
              Limpiar Caché
            </h3>
            <p className="text-[#888888] text-sm">Eliminar imágenes en caché del navegador</p>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 mb-4">
          <p className="text-purple-300 text-sm">
            💡 Esto eliminará todas las imágenes de productos almacenadas en IndexedDB. Las imágenes se volverán a descargar cuando sean necesarias.
          </p>
        </div>

        <button
          onClick={limpiarCache}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white 
                   rounded-2xl font-bold hover:from-purple-700 hover:to-purple-800
                   disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]
                   shadow-lg hover:shadow-purple-500/50"
        >
          {loading ? '⏳ Limpiando...' : '🧹 Limpiar Caché de Imágenes'}
        </button>
      </div>
    </div>
  );
};

/* ==================== COMPONENTE: Estadísticas del Sistema ==================== */
const EstadisticasSistema = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const [productos, usuarios, reservas, pedidos, ordenes, categorias] = await Promise.all([
        axios.get('/api/productos'),
        axios.get('/api/usuarios'),
        axios.get('/api/reservas'),
        pedidosApi.listarPedidos(),
        mesaOrdenesApi.listarOrdenes(),
        axios.get('/api/categorias')
      ]);

      const pedidosData = pedidos.data || pedidos || [];
      const ordenesData = ordenes.data || ordenes || [];
      const usuariosData = usuarios.data || [];
      const reservasData = reservas.data || [];
      const productosData = productos.data || [];

      // Estadísticas de usuarios por rol
      const usuariosPorRol = {
        admin: usuariosData.filter(u => u.rol === 'ADMIN').length,
        mesero: usuariosData.filter(u => u.rol === 'MESERO').length,
        cocinero: usuariosData.filter(u => u.rol === 'COCINERO').length,
        cajero: usuariosData.filter(u => u.rol === 'CAJERO').length,
        cliente: usuariosData.filter(u => u.rol === 'CLIENTE').length,
      };

      // Estadísticas de pedidos por estado
      const pedidosPorEstado = {
        pendiente: pedidosData.filter(p => p.estado === 'PENDIENTE').length,
        preparando: pedidosData.filter(p => p.estado === 'PREPARANDO').length,
        preparado: pedidosData.filter(p => p.estado === 'PREPARADO').length,
        cobrado: pedidosData.filter(p => p.estado === 'COBRADO').length,
        entregado: pedidosData.filter(p => p.estado === 'ENTREGADO').length,
        cancelado: pedidosData.filter(p => p.estado === 'CANCELADO').length,
      };

      // Estadísticas de órdenes de mesa por estado
      const ordenesPorEstado = {
        pendiente: ordenesData.filter(o => o.estado === 'PENDIENTE').length,
        preparando: ordenesData.filter(o => o.estado === 'PREPARANDO').length,
        listo: ordenesData.filter(o => o.estado === 'LISTO').length,
        servida: ordenesData.filter(o => o.estado === 'SERVIDA').length,
        cobrado: ordenesData.filter(o => o.estado === 'COBRADO').length,
        cancelado: ordenesData.filter(o => o.estado === 'CANCELADO').length,
      };

      // Estadísticas de reservas por estado
      const reservasPorEstado = {
        pendiente: reservasData.filter(r => r.estado === 'PENDIENTE').length,
        confirmada: reservasData.filter(r => r.estado === 'CONFIRMADA').length,
        completada: reservasData.filter(r => r.estado === 'COMPLETADA').length,
        cancelada: reservasData.filter(r => r.estado === 'CANCELADA').length,
      };

      // Calcular totales de ventas
      const totalVentasPedidos = pedidosData.reduce((sum, p) => sum + (Number(p.total) || 0), 0);
      const totalVentasOrdenes = ordenesData.reduce((sum, o) => {
        const total = (o.detalles || []).reduce((t, d) => 
          t + ((Number(d.cantidad) || 0) * (Number(d.precioUnitario) || 0)), 0
        );
        return sum + total;
      }, 0);

      setStats({
        // Totales generales
        productos: productosData.length,
        categorias: (categorias.data || []).length,
        usuarios: usuariosData.length,
        usuariosActivos: usuariosData.filter(u => u.activo === true).length,
        reservas: reservasData.length,
        pedidos: pedidosData.length,
        ordenes: ordenesData.length,
        
        // Desglose por rol
        usuariosPorRol,
        
        // Desglose por estado
        pedidosPorEstado,
        ordenesPorEstado,
        reservasPorEstado,
        
        // Estadísticas de ventas
        totalVentasPedidos,
        totalVentasOrdenes,
        totalVentasGeneral: totalVentasPedidos + totalVentasOrdenes,
        
        // Promedios
        promedioVentaPedido: pedidosData.length > 0 ? totalVentasPedidos / pedidosData.length : 0,
        promedioVentaOrden: ordenesData.length > 0 ? totalVentasOrdenes / ordenesData.length : 0,
      });
      
      setMostrarModal(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                    border-2 border-blue-500/20 hover:border-blue-500/60 
                    rounded-3xl p-6 transition-all duration-500 shadow-xl
                    hover:shadow-[0_12px_48px_rgba(59,130,246,0.3)] overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full 
                      blur-3xl group-hover:bg-blue-500/15 transition-all duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 
                          flex items-center justify-center shadow-lg">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-blue-400 
                           transition-colors duration-300">
                Estadísticas Completas
              </h3>
              <p className="text-[#888888] text-sm">Ver todas las estadísticas del sistema</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-4">
            <p className="text-blue-300 text-sm">
              💡 Genera un reporte completo con todas las métricas del sistema: usuarios, productos, pedidos, reservas, ventas y más.
            </p>
          </div>

          <button
            onClick={cargarEstadisticas}
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                     rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800
                     disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]
                     shadow-lg hover:shadow-blue-500/50"
          >
            {loading ? '⏳ Cargando...' : '📊 Ver Estadísticas Completas'}
          </button>
        </div>
      </div>

      {/* Modal con estadísticas completas */}
      {mostrarModal && stats && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 
                      animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] border-2 border-blue-500/30 
                        rounded-3xl p-8 max-w-6xl w-full my-8
                        shadow-[0_20px_60px_rgba(59,130,246,0.3)]
                        animate-[slideUp_0.3s_ease-out]">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 
                              flex items-center justify-center shadow-lg">
                  <FaChartBar className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-blue-600 
                               bg-clip-text text-transparent">
                    Estadísticas del Sistema
                  </h2>
                  <p className="text-[#888888] text-sm">Reporte completo actualizado</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarModal(false)}
                className="p-3 bg-red-500/20 border-2 border-red-500/50 text-red-400 rounded-2xl 
                         hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Grid de estadísticas */}
            <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
              
              {/* Resumen General */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 
                            rounded-2xl p-6">
                <h3 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-2">
                  <span>📊</span> Resumen General
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Productos" value={stats.productos} color="blue" />
                  <StatCard label="Total Categorías" value={stats.categorias} color="blue" />
                  <StatCard label="Total Usuarios" value={stats.usuarios} color="blue" />
                  <StatCard label="Usuarios Activos" value={stats.usuariosActivos} color="green" />
                  <StatCard label="Total Reservas" value={stats.reservas} color="blue" />
                  <StatCard label="Total Pedidos" value={stats.pedidos} color="blue" />
                  <StatCard label="Total Órdenes Mesa" value={stats.ordenes} color="blue" />
                  <StatCard label="Ventas Totales" value={`₡${stats.totalVentasGeneral.toLocaleString('es-CR', {minimumFractionDigits: 2})}`} color="green" />
                </div>
              </div>

              {/* Usuarios por Rol */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 
                            rounded-2xl p-6">
                <h3 className="text-xl font-black text-purple-400 mb-4 flex items-center gap-2">
                  <span>👥</span> Usuarios por Rol
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <StatCard label="Administradores" value={stats.usuariosPorRol.admin} color="red" />
                  <StatCard label="Meseros" value={stats.usuariosPorRol.mesero} color="purple" />
                  <StatCard label="Cocineros" value={stats.usuariosPorRol.cocinero} color="orange" />
                  <StatCard label="Cajeros" value={stats.usuariosPorRol.cajero} color="blue" />
                  <StatCard label="Clientes" value={stats.usuariosPorRol.cliente} color="green" />
                </div>
              </div>

              {/* Pedidos por Estado */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 
                            rounded-2xl p-6">
                <h3 className="text-xl font-black text-orange-400 mb-4 flex items-center gap-2">
                  <span>🛒</span> Pedidos (App) por Estado
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard label="Pendientes" value={stats.pedidosPorEstado.pendiente} color="yellow" />
                  <StatCard label="Preparando" value={stats.pedidosPorEstado.preparando} color="blue" />
                  <StatCard label="Preparados" value={stats.pedidosPorEstado.preparado} color="green" />
                  <StatCard label="Cobrados" value={stats.pedidosPorEstado.cobrado} color="purple" />
                  <StatCard label="Entregados" value={stats.pedidosPorEstado.entregado} color="green" />
                  <StatCard label="Cancelados" value={stats.pedidosPorEstado.cancelado} color="red" />
                </div>
              </div>

              {/* Órdenes de Mesa por Estado */}
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-2 border-green-500/30 
                            rounded-2xl p-6">
                <h3 className="text-xl font-black text-green-400 mb-4 flex items-center gap-2">
                  <span>🍽️</span> Órdenes de Mesa por Estado
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard label="Pendientes" value={stats.ordenesPorEstado.pendiente} color="yellow" />
                  <StatCard label="Preparando" value={stats.ordenesPorEstado.preparando} color="blue" />
                  <StatCard label="Listas" value={stats.ordenesPorEstado.listo} color="green" />
                  <StatCard label="Servidas" value={stats.ordenesPorEstado.servida} color="purple" />
                  <StatCard label="Cobradas" value={stats.ordenesPorEstado.cobrado} color="green" />
                  <StatCard label="Canceladas" value={stats.ordenesPorEstado.cancelado} color="red" />
                </div>
              </div>

              {/* Reservas por Estado */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 
                            rounded-2xl p-6">
                <h3 className="text-xl font-black text-yellow-400 mb-4 flex items-center gap-2">
                  <span>📅</span> Reservas por Estado
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Pendientes" value={stats.reservasPorEstado.pendiente} color="yellow" />
                  <StatCard label="Confirmadas" value={stats.reservasPorEstado.confirmada} color="blue" />
                  <StatCard label="Completadas" value={stats.reservasPorEstado.completada} color="green" />
                  <StatCard label="Canceladas" value={stats.reservasPorEstado.cancelada} color="red" />
                </div>
              </div>

              {/* Estadísticas de Ventas */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 
                            rounded-2xl p-6">
                <h3 className="text-xl font-black text-green-400 mb-4 flex items-center gap-2">
                  <span>💰</span> Estadísticas de Ventas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 text-sm uppercase tracking-wider mb-2">Total Pedidos App</p>
                    <p className="text-green-400 text-3xl font-black">
                      ₡{stats.totalVentasPedidos.toLocaleString('es-CR', {minimumFractionDigits: 2})}
                    </p>
                    <p className="text-green-300 text-xs mt-2">
                      Promedio: ₡{stats.promedioVentaPedido.toLocaleString('es-CR', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 text-sm uppercase tracking-wider mb-2">Total Órdenes Mesa</p>
                    <p className="text-green-400 text-3xl font-black">
                      ₡{stats.totalVentasOrdenes.toLocaleString('es-CR', {minimumFractionDigits: 2})}
                    </p>
                    <p className="text-green-300 text-xs mt-2">
                      Promedio: ₡{stats.promedioVentaOrden.toLocaleString('es-CR', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/50 
                              rounded-xl p-6 text-center">
                  <p className="text-green-300 text-sm uppercase tracking-wider mb-2">💎 TOTAL VENTAS GENERAL</p>
                  <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 
                               bg-clip-text text-transparent">
                    ₡{stats.totalVentasGeneral.toLocaleString('es-CR', {minimumFractionDigits: 2})}
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t-2 border-blue-500/20">
              <button
                onClick={() => setMostrarModal(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                         rounded-2xl font-black text-lg hover:from-blue-700 hover:to-blue-800
                         transition-all duration-300 hover:scale-[1.02]
                         shadow-lg hover:shadow-blue-500/50"
              >
                ✅ Cerrar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* Componente auxiliar para cards de estadísticas */
const StatCard = ({ label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    pink: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
  };

  return (
    <div className={`${colorClasses[color]} border-2 rounded-xl p-4 text-center 
                   hover:scale-105 transition-transform duration-300`}>
      <p className="text-xs uppercase tracking-wider mb-2 opacity-80">{label}</p>
      <p className="text-2xl md:text-3xl font-black">{value}</p>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};

/* ==================== COMPONENTE: Resetear Órdenes de Mesa ==================== */
const ResetearOrdenesMesa = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetearOrdenes = async () => {
    try {
      setLoading(true);
      showInfo('Eliminando todas las órdenes de mesa...');
      const response = await mesaOrdenesApi.listarOrdenes();
      const ordenes = (response.data || response || []);
      
      for (const orden of ordenes) {
        await mesaOrdenesApi.eliminarOrden(orden.id);
      }
      
      showSuccess(`✅ ${ordenes.length} órdenes de mesa eliminadas exitosamente`);
      setMostrarConfirmacion(false);
    } catch (error) {
      console.error('Error:', error);
      showError('❌ Error al eliminar las órdenes de mesa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                  border-2 border-green-500/20 hover:border-green-500/60 
                  rounded-3xl p-6 transition-all duration-500 shadow-xl
                  hover:shadow-[0_12px_48px_rgba(34,197,94,0.3)] overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full 
                    blur-3xl group-hover:bg-green-500/15 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 
                        flex items-center justify-center shadow-lg">
            <FaUtensils className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#ffffff] group-hover:text-green-400 
                         transition-colors duration-300">
              Resetear Mesas
            </h3>
            <p className="text-[#888888] text-sm">Eliminar todas las órdenes de mesa</p>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
          <p className="text-green-300 text-sm">
            ⚠️ Esta acción eliminará TODAS las órdenes de mesa del sistema de forma permanente.
          </p>
        </div>

        <button
          onClick={() => setMostrarConfirmacion(true)}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white 
                   rounded-2xl font-bold hover:from-green-700 hover:to-green-800
                   disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]
                   shadow-lg hover:shadow-green-500/50"
        >
          {loading ? '⏳ Eliminando...' : '🍽️ Resetear Órdenes de Mesa'}
        </button>

        {mostrarConfirmacion && (
          <ModalConfirmacion
            titulo="¿Eliminar todas las órdenes de mesa?"
            mensaje="Esta acción eliminará permanentemente TODAS las órdenes de mesa del sistema. No se puede deshacer."
            onConfirmar={resetearOrdenes}
            onCancelar={() => setMostrarConfirmacion(false)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

/* ==================== COMPONENTE: Modal de Confirmación ==================== */
const ModalConfirmacion = ({ titulo, mensaje, onConfirmar, onCancelar, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center 
                  animate-[fadeIn_0.2s_ease-out]">
      <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0b0b0b] 
                    border-2 border-red-500/30 rounded-3xl p-8 max-w-md w-full mx-4 
                    shadow-[0_20px_60px_rgba(239,68,68,0.3)]
                    animate-[slideUp_0.3s_ease-out]">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br 
                      from-red-500 to-red-600 rounded-2xl flex items-center justify-center 
                      shadow-[0_8px_24px_rgba(239,68,68,0.4)]">
          <span className="text-2xl">⚠️</span>
        </div>
        
        <h3 className="text-2xl font-black text-red-400 mb-3 mt-4 text-center">{titulo}</h3>
        <p className="text-[#bfbfbf] mb-8 text-center leading-relaxed">{mensaje}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#1a1a1a] border-2 border-[#c5a028]/30 text-[#ffffff] 
                     rounded-2xl hover:border-[#d4af37] hover:scale-105 transition-all duration-300
                     font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FaTimes /> Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-[#ffffff] 
                     rounded-2xl hover:scale-105 transition-all duration-300 font-bold
                     shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_30px_rgba(239,68,68,0.6)]
                     disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? '⏳ Procesando...' : <><FaCheckCircle /> Confirmar</>}
          </button>
        </div>
      </div>
    </div>
  );
};

ModalConfirmacion.propTypes = {
  titulo: PropTypes.string.isRequired,
  mensaje: PropTypes.string.isRequired,
  onConfirmar: PropTypes.func.isRequired,
  onCancelar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const ToolsAdmin = () => {
  const navigate = useNavigate();
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(true);

  return (
    <PageLayout>
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="animate-slideInUp">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-[#d4af37] hover:text-[#c5a028] transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Volver al Panel de Administración</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <FaTools className="text-[#d4af37] text-2xl" />
            <h1 className="font-title text-4xl font-bold text-[#d4af37]">
              Herramientas de Administración
            </h1>
          </div>
          <p className="text-[#bfbfbf]">
            Herramientas avanzadas para gestión del sistema. Usar con precaución.
          </p>
        </div>

        {mostrarAdvertencia && (
          <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-red-400 text-xl mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-400 font-bold text-lg mb-2">
                  ⚠️ ZONA DE PELIGRO - HERRAMIENTAS AVANZADAS
                </h3>
                <p className="text-red-300 mb-3">
                  Las herramientas en esta sección pueden realizar cambios irreversibles en la base de datos. 
                  Asegúrate de entender completamente lo que estás haciendo antes de proceder.
                </p>
                <ul className="text-red-300 text-sm space-y-1 mb-4 ml-4">
                  <li>• Las eliminaciones masivas NO se pueden deshacer</li>
                  <li>• Siempre haz respaldos antes de usar estas herramientas</li>
                  <li>• Estas acciones afectan a todos los usuarios del sistema</li>
                  <li>• Se recomienda usar solo en entornos de desarrollo/prueba</li>
                </ul>
                <button
                  onClick={() => setMostrarAdvertencia(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Entiendo los riesgos, continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {!mostrarAdvertencia && (
          <div className="grid gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Herramienta 1: Eliminar todos los productos */}
              <EliminarTodosProductos />

              {/* Herramienta 2: Eliminar todos los pedidos */}
              <EliminarTodosPedidos />

              {/* Herramienta 3: Eliminar todas las reservas */}
              <EliminarTodasReservas />

              {/* Herramienta 4: Limpiar caché de imágenes */}
              <LimpiarCacheImagenes />

              {/* Herramienta 5: Estadísticas del sistema */}
              <EstadisticasSistema />

              {/* Herramienta 6: Resetear órdenes de mesa */}
              <ResetearOrdenesMesa />
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 
                          border-2 border-blue-500/30 rounded-3xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 
                              flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-blue-400 font-black text-xl mb-3">Consejos de Seguridad</h3>
                  <div className="text-blue-300 space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                      <p className="font-semibold mb-1">🔧 Desarrollo</p>
                      <p className="text-sm">Estas herramientas son útiles para limpiar datos de prueba y resetear el sistema</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <p className="font-semibold mb-1">⚠️ Producción</p>
                      <p className="text-sm">NUNCA uses estas herramientas en producción sin respaldo completo</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                      <p className="font-semibold mb-1">💾 Respaldos</p>
                      <p className="text-sm">Siempre crea backups antes de operaciones masivas</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                      <p className="font-semibold mb-1">✅ Verificación</p>
                      <p className="text-sm">Verifica dos veces antes de confirmar eliminaciones</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ToolsAdmin;