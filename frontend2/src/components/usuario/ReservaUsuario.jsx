import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaPhone, FaEdit, FaTrash, FaClock, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { reservasApi } from '../../utils/api';
import { useToast } from '../common/ToastContainer';
import axios from '../../utils/axios';
import HeaderUsuario from './HeaderUsuario';
import PageLayout from '../common/PageLayout';

const ReservaUsuario = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [verificandoDisponibilidad, setVerificandoDisponibilidad] = useState(false);
  const [disponibilidadInfo, setDisponibilidadInfo] = useState(null);

  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    numeroPersonas: '',
    telefono: '',
    id: null,
  });

  const [reservasPorFecha, setReservasPorFecha] = useState({});
  const [fechasLlenas, setFechasLlenas] = useState(new Set());

  // Verificar disponibilidad automáticamente cuando cambian fecha, hora o personas
  useEffect(() => {
    if (form.fecha && form.hora && form.numeroPersonas && showForm) {
      const timer = setTimeout(() => {
        checkDisponibilidadSilencioso();
      }, 500); // Reducir tiempo de espera para mejor UX
      
      return () => clearTimeout(timer);
    }
  }, [form.fecha, form.hora, form.numeroPersonas, showForm]);

  // Cargar datos de disponibilidad al abrir el formulario
  useEffect(() => {
    if (showForm) {
      cargarDisponibilidadGeneral();
    }
  }, [showForm]);

  // Cargar disponibilidad general y fechas llenas
  const cargarDisponibilidadGeneral = async () => {
    try {
      // Simular carga de reservas existentes para los próximos 30 días
      const hoy = new Date();
      const reservasData = {};
      const fechasCompletas = new Set();
      
      for (let i = 0; i < 30; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const fechaStr = fecha.toISOString().split('T')[0];
        
        // Simular diferentes niveles de ocupación
        const random = Math.random();
        let reservasPorHora = {};
        
        // Horarios disponibles: 11:00 a 20:00
        for (let hora = 11; hora <= 20; hora++) {
          const horaStr = `${hora.toString().padStart(2, '0')}:00`;
          
          // Simular ocupación variable por hora
          let ocupacion = 0;
          if (random > 0.7) { // 30% de días muy ocupados
            ocupacion = Math.floor(Math.random() * 8) + 2; // 2-10 mesas ocupadas
          } else if (random > 0.3) { // 40% de días moderadamente ocupados
            ocupacion = Math.floor(Math.random() * 5) + 1; // 1-6 mesas ocupadas
          } else { // 30% de días poco ocupados
            ocupacion = Math.floor(Math.random() * 3); // 0-3 mesas ocupadas
          }
          
          reservasPorHora[horaStr] = Math.min(ocupacion, 10); // Máximo 10 mesas
        }
        
        reservasData[fechaStr] = reservasPorHora;
        
        // Marcar como lleno si la mayoría de horarios están ocupados
        const horariosLlenos = Object.values(reservasPorHora).filter(r => r >= 8).length;
        if (horariosLlenos >= 6) { // Si 6 o más horarios están casi llenos
          fechasCompletas.add(fechaStr);
        }
      }
      
      setReservasPorFecha(reservasData);
      setFechasLlenas(fechasCompletas);
      
    } catch (error) {
      console.error('Error cargando disponibilidad:', error);
    }
  };

  // Versión silenciosa que no muestra errores, solo info
  const checkDisponibilidadSilencioso = async () => {
    if (!form.fecha || !form.hora || !form.numeroPersonas) return;
    
    try {
      const fechaSeleccionada = form.fecha;
      const horaSeleccionada = form.hora;
      const personas = parseInt(form.numeroPersonas);
      const now = new Date();
      const fechaReserva = new Date(`${fechaSeleccionada}T${horaSeleccionada}`);
      
      let disponible = true;
      let mensaje = '';
      
      // Validaciones básicas
      if (fechaReserva <= now) {
        disponible = false;
        mensaje = 'Selecciona una fecha y hora futura';
      } else if (personas > 10) {
        disponible = false;
        mensaje = 'Máximo 10 personas por reserva';
      } else if (personas < 1) {
        disponible = false;
        mensaje = 'Mínimo 1 persona';
      } else {
      // Verificar disponibilidad específica
      const reservasDelDia = reservasPorFecha[fechaSeleccionada] || {};
      const ocupacionHora = reservasDelDia[horaSeleccionada] || 0;
      
      if (fechasLlenas.has(fechaSeleccionada)) {
        disponible = false;
        mensaje = 'Esta fecha está completamente reservada. Te sugerimos probar el día siguiente o elegir entre las fechas con mejor disponibilidad.';
      } else if (ocupacionHora >= 9) {
        disponible = false;
        mensaje = 'Esta hora está llena. Prueba una hora anterior (11 AM - 2 PM tienen mejor disponibilidad) o posterior.';
      } else if (ocupacionHora >= 7) {
        disponible = true;
        mensaje = 'Pocas mesas disponibles en esta hora. Te recomendamos confirmar pronto.';
      } else if (ocupacionHora >= 4) {
        disponible = true;
        mensaje = 'Disponibilidad moderada para esta hora. Buen momento para reservar.';
      } else {
        disponible = true;
        mensaje = '¡Excelente disponibilidad! Esta es una hora ideal para tu reserva.';
      }        // Ajustes para grupos grandes
        if (disponible && personas > 6) {
          if (ocupacionHora >= 6) {
            disponible = false;
            mensaje = 'No hay mesas grandes disponibles para esta hora';
          } else {
            mensaje += ' (Mesa grande requerida)';
          }
        }
      }
      
      setDisponibilidadInfo({ disponible, mensaje });
      
    } catch (err) {
      console.error('Error en verificación silenciosa:', err);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!userData || !userData.id) {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchReservas();
  }, [navigate, mostrarHistorial]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener el ID del usuario logueado
      const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (!userData || !userData.id) {
        setError('No hay usuario logueado');
        return;
      }
      
      // Obtener las reservas del usuario
      const response = await reservasApi.listarReservasPorUsuario(userData.id);
      let data = response.data || response || [];
      
      // Filtrar reservas según mostrarHistorial
      data = data.filter(reserva => {
        if (mostrarHistorial) {
          return reserva.estado === 'COMPLETADA' || reserva.estado === 'CANCELADA';
        } else {
          return reserva.estado !== 'COMPLETADA' && reserva.estado !== 'CANCELADA';
        }
      });
      
      setReservas(data);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError('Error al cargar las reservas. Por favor, intenta de nuevo.');
      showError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    setError(null); // Limpiar errores anteriores
    
    if (!form.fecha || !form.hora || !form.numeroPersonas || !form.telefono) {
      showWarning('Por favor completa todos los campos');
      setError('Por favor completa todos los campos');
      return false;
    }
    
    // Validar formato de fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(form.fecha)) {
      showError('Formato de fecha inválido');
      setError('Formato de fecha inválido');
      return false;
    }
    
    // Validar formato de hora
    const horaRegex = /^\d{2}:\d{2}$/;
    if (!horaRegex.test(form.hora)) {
      showError('Formato de hora inválido');
      setError('Formato de hora inválido');
      return false;
    }
    
    const now = new Date();
    const fechaReserva = new Date(`${form.fecha}T${form.hora}:00`);
    const personas = parseInt(form.numeroPersonas);

    // Validar que la fecha no sea en el pasado
    if (fechaReserva <= now) {
      showError('La fecha y hora de reserva debe ser en el futuro');
      setError('La fecha y hora de reserva debe ser en el futuro');
      return false;
    }

    // Validar horario de reserva (11 AM - 8 PM)
    const hora = parseInt(form.hora.split(':')[0]);
    if (hora < 11 || hora > 20) {
      showWarning('Las reservas solo están disponibles entre las 11:00 AM y 8:00 PM');
      setError('Las reservas solo están disponibles entre las 11:00 AM y 8:00 PM');
      return false;
    }

    // Validar número de personas
    if (isNaN(personas) || personas < 1 || personas > 10) {
      showError('El número de personas debe estar entre 1 y 10');
      setError('El número de personas debe estar entre 1 y 10');
      return false;
    }

    // Validar anticipación mínima de 2 horas
    const diff = (fechaReserva - now) / (1000 * 60 * 60);
    if (diff < 2) {
      showWarning('Las reservas deben hacerse con al menos 2 horas de anticipación');
      setError('Las reservas deben hacerse con al menos 2 horas de anticipación');
      return false;
    }

    // Validar teléfono básico
    const telefonoLimpio = form.telefono.replace(/\D/g, ''); // Solo números
    if (telefonoLimpio.length < 8) {
      showError('Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)');
      setError('Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)');
      return false;
    }

    return true;
  };

  const checkDisponibilidad = async () => {
    // Validación silenciosa (sin mostrar errores) para verificar disponibilidad
    if (!form.fecha || !form.hora || !form.numeroPersonas || !form.telefono) {
      return false;
    }
    
    // Validaciones básicas de formato
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    const horaRegex = /^\d{2}:\d{2}$/;
    if (!fechaRegex.test(form.fecha) || !horaRegex.test(form.hora)) {
      return false;
    }
    
    const now = new Date();
    const fechaReserva = new Date(`${form.fecha}T${form.hora}:00`);
    const personas = parseInt(form.numeroPersonas);
    
    // Validaciones básicas sin mostrar error
    if (fechaReserva <= now || isNaN(personas) || personas < 1 || personas > 10) {
      return false;
    }
    
    const hora = parseInt(form.hora.split(':')[0]);
    if (hora < 11 || hora > 20) {
      return false;
    }
    
    // Validar anticipación mínima de 2 horas
    const diff = (fechaReserva - now) / (1000 * 60 * 60);
    if (diff < 2) {
      const horaMinima = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Sumar 2 horas
      const horaReferencia = horaMinima.getHours();
      let sugerencia = '';
      
      if (horaReferencia <= 18) { // Si aún es posible reservar hoy
        sugerencia = `Puedes reservar a partir de las ${horaReferencia}:00 de hoy.`;
      } else { // Si ya es muy tarde para hoy
        sugerencia = 'Selecciona mañana o cualquier día futuro.';
      }
      
      setDisponibilidadInfo({ 
        disponible: false, 
        mensaje: `Las reservas deben hacerse con al menos 2 horas de anticipación. ${sugerencia}` 
      });
      return false;
    }

    try {
      setVerificandoDisponibilidad(true);
      
      const fechaSeleccionada = form.fecha;
      const horaSeleccionada = form.hora;
      const personas = parseInt(form.numeroPersonas);
      
      // Verificar disponibilidad usando los datos cargados
      const reservasDelDia = reservasPorFecha[fechaSeleccionada] || {};
      const ocupacionHora = reservasDelDia[horaSeleccionada] || 0;
      
      let disponible = true;
      let mensaje = '';
      
      if (fechasLlenas.has(fechaSeleccionada)) {
        disponible = false;
        mensaje = 'Esta fecha está completamente reservada. Por favor selecciona otro día.';
      } else if (ocupacionHora >= 9) {
        disponible = false;
        mensaje = 'Esta hora está completamente llena. Por favor selecciona otro horario.';
      } else if (personas > 6 && ocupacionHora >= 6) {
        disponible = false;
        mensaje = 'No hay mesas grandes disponibles para esta hora. Prueba otro horario o divide el grupo.';
      } else {
        disponible = true;
        if (ocupacionHora >= 7) {
          mensaje = 'Pocas mesas disponibles - Confirma rápidamente';
        } else if (ocupacionHora >= 4) {
          mensaje = 'Disponibilidad moderada para esta hora';
        } else {
          mensaje = '¡Excelente disponibilidad!';
        }
      }
      
      if (!disponible) {
        setDisponibilidadInfo({ disponible: false, mensaje });
      } else {
        setDisponibilidadInfo({ disponible: true, mensaje });
      }
      
      return disponible;
      
    } catch (err) {
      console.error('❌ Error al verificar disponibilidad:', err);
      
      // Si hay error en la verificación, asumir disponibilidad limitada
      setDisponibilidadInfo({ 
        disponible: true, 
        mensaje: 'Verificación limitada - Proceder con precaución' 
      });
      return true;
      
    } finally {
      setVerificandoDisponibilidad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Primero hacer validación completa del formulario
    if (!validateForm()) {
      return; // validateForm ya estableció el error apropiado
    }

    // Verificar que el usuario esté logueado
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    
    if (!userData || !userData.id) {
      showError('Debes iniciar sesión para crear una reserva');
      setError('Debes iniciar sesión para crear una reserva');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Verificar disponibilidad
    showInfo('Verificando disponibilidad...');
    const isDisponible = await checkDisponibilidad();
    if (!isDisponible) {
      // Usar el mensaje específico de disponibilidad
      const mensajeError = disponibilidadInfo?.mensaje || 'No hay disponibilidad para la fecha y hora seleccionadas';
      showError(mensajeError);
      setError(`❌ ${mensajeError}`);
      return;
    }

    try {
      if (editMode) {
        showInfo('Actualizando reserva...');
        const fechaReserva = `${form.fecha}T${form.hora}:00`;
        const reservaData = {
          fechaReserva,
          numeroPersonas: parseInt(form.numeroPersonas),
          telefono: form.telefono
        };
        await reservasApi.actualizarReserva(form.id, reservaData);
        showSuccess('¡Reserva actualizada exitosamente!');
        setSuccess('✅ Reserva actualizada exitosamente. Los cambios han sido guardados.');
      } else {
        showInfo('Creando reserva...');
        const fechaReserva = `${form.fecha}T${form.hora}:00`;
        const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
        
        // Formatear teléfono al formato esperado por el backend (####-####)
        let telefonoFormateado = form.telefono.replace(/\D/g, ''); // Quitar caracteres no numéricos
        if (telefonoFormateado.length === 8) {
          telefonoFormateado = `${telefonoFormateado.substring(0, 4)}-${telefonoFormateado.substring(4)}`;
        } else if (telefonoFormateado.length > 8) {
          // Si tiene más de 8 dígitos, tomar los últimos 8
          telefonoFormateado = telefonoFormateado.slice(-8);
          telefonoFormateado = `${telefonoFormateado.substring(0, 4)}-${telefonoFormateado.substring(4)}`;
        }
        
        const reservaData = {
          fechaReserva,
          numeroPersonas: parseInt(form.numeroPersonas),
          telefono: telefonoFormateado,
          usuario: {
            id: userData.id
          }
        };
        await reservasApi.crearReserva(reservaData);
        showSuccess('¡Reserva creada exitosamente! Te contactaremos para confirmar');
        setSuccess('¡Reserva creada exitosamente! Te contactaremos para confirmar los detalles.');
      }

      // Limpiar formulario
      setForm({ fecha: '', hora: '', numeroPersonas: '', telefono: '', id: null });
      setEditMode(false);
      setShowForm(false);
      setDisponibilidadInfo(null);
      
      // Recargar lista de reservas
      await fetchReservas();
    } catch (err) {
      console.error('Error al procesar la reserva:', err);
      
      // Mostrar mensaje de error específico
      let errorMessage = 'Error al procesar la reserva';
      
      if (err.response) {
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.status === 400) {
          errorMessage = 'Datos inválidos. Verifica todos los campos';
        } else if (err.response.status === 401) {
          errorMessage = 'Sesión expirada. Inicia sesión nuevamente';
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde';
        } else {
          errorMessage = `Error del servidor (${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = 'Error de conexión. Verifica tu internet';
      } else {
        errorMessage = err.message || 'Error desconocido';
      }
      
      showError(errorMessage);
      setError(errorMessage);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Está seguro que desea cancelar esta reserva?')) {
      return;
    }

    try {
      showInfo('Cancelando reserva...');
      await reservasApi.cancelarReserva(id);
      showSuccess('Reserva cancelada exitosamente');
      setSuccess('Reserva cancelada exitosamente');
      await fetchReservas(); // Recargar lista
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cancelar la reserva';
      showError(errorMsg);
      setError(errorMsg);
      console.error('Error al cancelar reserva:', err);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'CONFIRMADA': return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'CANCELADA': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'COMPLETADA': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return <FaClock className="inline mr-2" />;
      case 'CONFIRMADA': return <FaCheck className="inline mr-2" />;
      case 'CANCELADA': return <FaTimes className="inline mr-2" />;
      case 'COMPLETADA': return <FaCheck className="inline mr-2" />;
      default: return <FaClock className="inline mr-2" />;
    }
  };

  return (
    <PageLayout>
      <HeaderUsuario />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="animate-slideInUp">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-title text-4xl font-bold text-[#d4af37] mb-2">
            {mostrarHistorial ? 'Historial de Reservas' : 'Mis Reservas'}
          </h1>
          <p className="text-[#bfbfbf]">
            {mostrarHistorial
              ? 'Consulta tus reservas completadas y canceladas'
              : 'Gestiona tus reservas de mesa en nuestro restaurante'}
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <div className="flex items-center space-x-2">
              <FaTimes className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
            <div className="flex items-center space-x-2">
              <FaCheck className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Botón para nueva reserva */}
        {!showForm && (
          <div className="mb-8">
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditMode(false);
                  setForm({ fecha: '', hora: '', numeroPersonas: '', telefono: '', id: null });
                  setError(null);
                  setSuccess(null);
                  setDisponibilidadInfo(null);
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#d4af37] text-[#000000] rounded-xl font-semibold hover:bg-[#c5a028] transition-colors hover-glow"
              >
                <FaPlus />
                <span>Nueva Reserva</span>
              </button>
              <button
                onClick={() => setMostrarHistorial(!mostrarHistorial)}
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                  mostrarHistorial
                    ? 'bg-[#1a1a1a] text-[#d4af37] border border-[#d4af37]/30'
                    : 'bg-[#d4af37] text-[#000000] hover:bg-[#c5a028]'
                }`}
              >
                <FaCalendarAlt />
                <span>{mostrarHistorial ? 'Ver Reservas Activas' : 'Ver Historial'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Formulario de reserva */}
        {showForm && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-[#000000] to-[#1a1a1a] border border-[#c5a028]/30 hover-glow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#d4af37]">
                {editMode ? 'Editar Reserva' : 'Nueva Reserva'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditMode(false);
                  setForm({ fecha: '', hora: '', numeroPersonas: '', telefono: '', id: null });
                  setError(null);
                  setDisponibilidadInfo(null);
                }}
                className="text-[#bfbfbf] hover:text-[#ffffff] transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información de disponibilidad general */}
              {showForm && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#0b0b0b] border border-[#c5a028]/20">
                  <h3 className="text-lg font-semibold text-[#d4af37] mb-3">ℹ️ Información de Disponibilidad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-[#bfbfbf]">Alta disponibilidad (0-3 mesas ocupadas)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-[#bfbfbf]">Disponibilidad moderada (4-6 mesas ocupadas)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">⏰</span>
                        <span className="text-[#bfbfbf]">Muy pronto (menos de 2 horas de anticipación)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-[#bfbfbf]">Pocas mesas disponibles (7-8 mesas ocupadas)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-[#bfbfbf]">No disponible (9+ mesas ocupadas)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fecha */}
                <div>
                  <label className="flex items-center space-x-2 text-[#d4af37] font-semibold mb-3">
                    <FaCalendarAlt />
                    <span>Fecha</span>
                  </label>
                  <input
                    type="date"
                    value={form.fecha}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#000000]/50 border border-[#c5a028]/30 text-[#ffffff] focus:border-[#d4af37] focus:outline-none transition-colors"
                    required
                  />
                  {form.fecha && fechasLlenas.has(form.fecha) && (
                    <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                      <FaTimes className="flex-shrink-0" />
                      <span>⚠️ Esta fecha está completamente reservada</span>
                    </p>
                  )}
                  {form.fecha && !fechasLlenas.has(form.fecha) && (
                    <p className="mt-2 text-sm text-green-400 flex items-center space-x-1">
                      <FaCheck className="flex-shrink-0" />
                      <span>✅ Fecha disponible</span>
                    </p>
                  )}
                </div>

                {/* Hora */}
                <div>
                  <label className="flex items-center space-x-2 text-[#d4af37] font-semibold mb-3">
                    <FaClock />
                    <span>Hora</span>
                  </label>
                  <select
                    value={form.hora}
                    onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#000000]/50 border border-[#c5a028]/30 text-[#ffffff] focus:border-[#d4af37] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Seleccionar hora</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const hora = i + 11;
                      const horaStr = `${hora.toString().padStart(2, '0')}:00`;
                      const ocupacion = form.fecha ? (reservasPorFecha[form.fecha]?.[horaStr] || 0) : 0;
                      
                      // Verificar si la hora cumple con la anticipación mínima
                      const now = new Date();
                      const fechaHora = new Date(`${form.fecha}T${horaStr}:00`);
                      const diff = (fechaHora - now) / (1000 * 60 * 60);
                      const faltaAnticipacion = diff < 2;
                      
                      let disponibilidad = '';
                      let disabled = false;
                      let emoji = '';
                      
                      if (faltaAnticipacion) {
                        disponibilidad = ' - Muy pronto';
                        disabled = true;
                        emoji = '⏰';
                      } else if (ocupacion >= 9) {
                        disponibilidad = ' - Lleno';
                        disabled = true;
                        emoji = '🔴';
                      } else if (ocupacion >= 7) {
                        disponibilidad = ' - Pocas mesas';
                        emoji = '🟠';
                      } else if (ocupacion >= 4) {
                        disponibilidad = ' - Disponible';
                        emoji = '🟡';
                      } else {
                        disponibilidad = ' - Muy disponible';
                        emoji = '🟢';
                      }
                      
                      return (
                        <option 
                          key={hora} 
                          value={horaStr}
                          disabled={disabled}
                        >
                          {emoji} {hora === 11 ? '11:00 AM' : 
                           hora === 12 ? '12:00 PM' : 
                           hora > 12 ? `${hora - 12}:00 PM` : `${hora}:00 AM`}
                          {disponibilidad}
                        </option>
                      );
                    })}
                  </select>
                  
                  {/* Mostrar disponibilidad de horas cuando se selecciona una fecha */}
                  {form.fecha && (
                    <div className="mt-3 p-3 bg-[#1a1a1a]/50 rounded-lg border border-[#c5a028]/20">
                      <p className="text-sm text-[#d4af37] font-semibold mb-2">Disponibilidad para {form.fecha}:</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {Array.from({ length: 10 }, (_, i) => {
                          const hora = i + 11;
                          const horaStr = `${hora.toString().padStart(2, '0')}:00`;
                          const ocupacion = reservasPorFecha[form.fecha]?.[horaStr] || 0;
                          
                          // Verificar anticipación mínima
                          const now = new Date();
                          const fechaHora = new Date(`${form.fecha}T${horaStr}:00`);
                          const diff = (fechaHora - now) / (1000 * 60 * 60);
                          const faltaAnticipacion = diff < 2;
                          
                          let colorClass = '';
                          let emoji = '';
                          
                          if (faltaAnticipacion) {
                            colorClass = 'text-gray-500';
                            emoji = '⏰';
                          } else if (ocupacion >= 9) {
                            colorClass = 'text-red-400';
                            emoji = '🔴';
                          } else if (ocupacion >= 7) {
                            colorClass = 'text-orange-400';
                            emoji = '🟠';
                          } else if (ocupacion >= 4) {
                            colorClass = 'text-yellow-400';
                            emoji = '🟡';
                          } else {
                            colorClass = 'text-green-400';
                            emoji = '🟢';
                          }
                          
                          return (
                            <div key={hora} className={`${colorClass} flex items-center space-x-1`}>
                              <span>{emoji}</span>
                              <span>
                                {hora === 11 ? '11 AM' : 
                                 hora === 12 ? '12 PM' : 
                                 hora > 12 ? `${hora - 12} PM` : `${hora} AM`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <p className="mt-2 text-sm text-[#888888]">
                    🕐 <strong>Horario:</strong> 11:00 AM - 8:00 PM<br/>
                    ⏰ <strong>Anticipación:</strong> Mínimo 2 horas
                  </p>
                </div>

                {/* Número de Personas */}
                <div>
                  <label className="flex items-center space-x-2 text-[#d4af37] font-semibold mb-3">
                    <FaUsers />
                    <span>Personas</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.numeroPersonas}
                    onChange={(e) => setForm({ ...form, numeroPersonas: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#000000]/50 border border-[#c5a028]/30 text-[#ffffff] focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Ej: 4"
                    required
                  />
                  <p className="mt-2 text-sm text-[#888888]">
                    👥 <strong>Máximo:</strong> 10 personas<br/>
                    🍽️ <strong>Grupos grandes:</strong> Mesa especial requerida
                  </p>
                </div>
              </div>

              {/* Indicador de disponibilidad */}
              {form.fecha && form.hora && form.numeroPersonas && disponibilidadInfo && (
                <div className={`p-4 rounded-lg border ${
                  disponibilidadInfo.disponible 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  <div className="flex items-center space-x-2">
                    {disponibilidadInfo.disponible ? (
                      <FaCheck className="flex-shrink-0" />
                    ) : (
                      <FaTimes className="flex-shrink-0" />
                    )}
                    <span className="font-medium">{disponibilidadInfo.mensaje}</span>
                  </div>
                  
                  {/* Mostrar fechas sugeridas si la actual no está disponible */}
                  {!disponibilidadInfo.disponible && form.fecha && (
                    <div className="mt-3 pt-3 border-t border-red-500/30">
                      <p className="text-sm font-semibold mb-2">� Sugerencias para tu reserva:</p>
                      
                      {fechasLlenas.has(form.fecha) && (
                        <div className="mb-3">
                          <p className="text-sm mb-2">�📅 Fechas con mejor disponibilidad:</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 7 }, (_, i) => {
                              const fechaSugerida = new Date();
                              fechaSugerida.setDate(fechaSugerida.getDate() + i + 1);
                              const fechaStr = fechaSugerida.toISOString().split('T')[0];
                              
                              if (!fechasLlenas.has(fechaStr)) {
                                return (
                                  <button
                                    key={fechaStr}
                                    onClick={() => setForm({ ...form, fecha: fechaStr })}
                                    className="px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-300 rounded-full text-sm hover:bg-green-500/30 transition-colors"
                                  >
                                    {fechaSugerida.toLocaleDateString('es-ES', { 
                                      weekday: 'short', 
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </button>
                                );
                              }
                              return null;
                            }).filter(Boolean).slice(0, 4)}
                          </div>
                        </div>
                      )}
                      
                      {form.fecha && !fechasLlenas.has(form.fecha) && (
                        <div className="text-sm space-y-1">
                          <p>🕐 <strong>Horarios con mayor disponibilidad:</strong> 11:00 AM - 2:00 PM y 4:00 PM - 6:00 PM</p>
                          <p>👥 <strong>Para grupos grandes (7+ personas):</strong> Recomendamos horarios de 11:00 AM - 1:00 PM</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Teléfono */}
              <div>
                <label className="flex items-center space-x-2 text-[#d4af37] font-semibold mb-3">
                  <FaPhone />
                  <span>Teléfono de Contacto</span>
                </label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => {
                    // Permitir solo números y guión
                    let valor = e.target.value.replace(/[^\d-]/g, '');
                    // Auto-formatear mientras escribe
                    if (valor.length === 4 && !valor.includes('-')) {
                      valor = valor + '-';
                    }
                    setForm({ ...form, telefono: valor });
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-[#000000]/50 border border-[#c5a028]/30 text-[#ffffff] focus:border-[#d4af37] focus:outline-none transition-colors"
                  placeholder="1234-5678"
                  maxLength="9"
                  required
                />
                <p className="mt-2 text-sm text-[#888888]">
                  📞 <strong>Formato:</strong> 1234-5678 (8 dígitos)<br/>
                  ℹ️ <strong>Ejemplo:</strong> 6116-1249
                </p>
              </div>

              {/* Botones */}
              <div className="flex flex-col space-y-3">
                {/* Mensaje cuando no hay disponibilidad */}
                {disponibilidadInfo && !disponibilidadInfo.disponible && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm text-center">
                      ⚠️ No se puede crear la reserva: {disponibilidadInfo.mensaje}
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={verificandoDisponibilidad || (disponibilidadInfo && !disponibilidadInfo.disponible)}
                    className="flex-1 py-3 px-6 bg-[#d4af37] text-[#000000] rounded-lg font-semibold hover:bg-[#c5a028] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verificandoDisponibilidad ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#000000]"></div>
                        <span>Verificando disponibilidad...</span>
                      </div>
                    ) : editMode ? (
                      'Actualizar Reserva'
                    ) : (
                      'Confirmar Reserva'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditMode(false);
                      setForm({ fecha: '', hora: '', numeroPersonas: '', telefono: '', id: null });
                      setDisponibilidadInfo(null);
                    }}
                    className="px-6 py-3 bg-[#666666] text-[#ffffff] rounded-lg font-semibold hover:bg-[#555555] transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Lista de reservas */}
        <div className="rounded-xl bg-gradient-to-br from-[#000000] to-[#1a1a1a] border border-[#c5a028]/30 p-6">
          <h2 className="text-2xl font-bold text-[#d4af37] mb-6">Historial de Reservas</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
              <p className="mt-4 text-[#bfbfbf]">Cargando reservas...</p>
            </div>
          ) : reservas.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-6xl text-[#666666] mx-auto mb-4" />
              <p className="text-[#bfbfbf] text-lg">No tienes reservas aún</p>
              <p className="text-[#888888]">¡Haz tu primera reserva para disfrutar en nuestro restaurante!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="p-6 rounded-lg bg-[#1a1a1a]/50 border border-[#c5a028]/20 hover:border-[#d4af37]/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="text-[#d4af37]">
                          <FaCalendarAlt className="text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#ffffff]">
                            {new Date(reserva.fechaReserva).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className="text-[#bfbfbf]">
                            {new Date(reserva.fechaReserva).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-[#bfbfbf]">
                        <div className="flex items-center space-x-2">
                          <FaUsers />
                          <span>{reserva.numeroPersonas} personas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaPhone />
                          <span>{reserva.telefono}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getEstadoColor(reserva.estado)}`}>
                        {getEstadoIcon(reserva.estado)}
                        {reserva.estado}
                      </span>

                      {reserva.estado === 'PENDIENTE' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // Separar fecha y hora del datetime existente
                              const fechaReserva = new Date(reserva.fechaReserva);
                              const fecha = fechaReserva.toISOString().split('T')[0];
                              const hora = fechaReserva.toTimeString().substring(0, 5);
                              
                              setForm({
                                fecha: fecha,
                                hora: hora,
                                numeroPersonas: reserva.numeroPersonas.toString(),
                                telefono: reserva.telefono,
                                id: reserva.id,
                              });
                              setEditMode(true);
                              setShowForm(true);
                              setError(null);
                              setSuccess(null);
                              setDisponibilidadInfo(null);
                            }}
                            className="p-2 bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] rounded-lg hover:bg-[#d4af37]/30 transition-colors"
                            title="Editar reserva"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleCancelar(reserva.id)}
                            className="p-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Cancelar reserva"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReservaUsuario;
