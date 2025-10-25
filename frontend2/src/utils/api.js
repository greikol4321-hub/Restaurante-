import axios from './axios';

// Endpoints para Pedidos
// Endpoints para Mesa Órdenes
export const mesaOrdenesApi = {
  crearOrden: (ordenDTO) => axios.post('/api/mesas-ordenes', ordenDTO),

  listarOrdenes: () => axios.get('/api/mesas-ordenes'),

  obtenerOrden: (ordenId) => axios.get(`/api/mesas-ordenes/${ordenId}`),

  listarOrdenesPorMesero: (meseroId) => axios.get(`/api/mesas-ordenes/mesero/${meseroId}`),

  actualizarOrden: (ordenId, data) => axios.put(`/api/mesas-ordenes/${ordenId}`, data),

  actualizarEstadoOrden: async (ordenId, estado) => {
    try {
      // Validar que el estado sea uno de los valores permitidos
        const estadosPermitidos = ['PENDIENTE', 'PREPARANDO', 'LISTO', 'ENTREGADO', 'COBRADO', 'PAGADO', 'CANCELADO'];
      if (!estadosPermitidos.includes(estado)) {
        throw new Error(`Estado inválido. Debe ser uno de: ${estadosPermitidos.join(', ')}`);
      }

      const response = await axios.put(`/api/mesas-ordenes/${ordenId}/estado`, { 
        estado: estado
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
      }
      throw error;
    }
  },

  eliminarOrden: (ordenId) => axios.delete(`/api/mesas-ordenes/${ordenId}`),
};

// Endpoints para Pedidos
export const pedidosApi = {
  // Obtener todos los pedidos
  listarPedidos: async () => {
    try {
      const response = await axios.get('/api/pedidos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener pedidos del usuario
  listarPedidosPorUsuario: async (usuarioId) => {
    try {
      const response = await axios.get(`/api/pedidos/usuario/${usuarioId}`);
      // Asegurarse de que los datos sean un array y tengan el formato correcto
      const pedidos = Array.isArray(response.data) ? response.data : [];
      
      // Limpiar duplicados usando el ID como clave
      const uniquePedidos = pedidos.reduce((acc, current) => {
        if (!acc.find(item => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      // Formatear las fechas y asegurar que los datos estén completos
      return uniquePedidos.map(pedido => ({
        ...pedido,
        fecha_pedido: pedido.fecha_pedido || new Date().toISOString(),
        estado: pedido.estado || 'PENDIENTE',
        total: pedido.total || 0
      }));
    } catch (error) {
      throw error;
    }
  },

  // Obtener pedido por ID
  obtenerPedido: async (pedidoId) => {
    try {
      const response = await axios.get(`/api/pedidos/${pedidoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo pedido
  crearPedido: async (pedidoData) => {
    try {
      const response = await axios.post('/api/pedidos', pedidoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar estado del pedido
  actualizarEstado: async (pedidoId, estado) => {
    try {
      const response = await axios.put(`/api/pedidos/${pedidoId}/estado`, { estado });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener pedidos para cocina
  obtenerPedidosCocina: async () => {
    try {
      const response = await axios.get('/api/pedidos/cocina');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener órdenes de mesas
  obtenerOrdenesMesas: async () => {
    try {
      const response = await axios.get('/api/mesas-ordenes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar pedido
  eliminarPedido: (pedidoId) => axios.delete(`/api/pedidos/${pedidoId}`),
};

// Endpoints para Reservas
export const reservasApi = {
  // Obtener todas las reservas
  listarReservas: () => axios.get('/api/reservas'),
  obtenerReservas: () => axios.get('/api/reservas'),

  // Obtener reservas del usuario
  listarReservasPorUsuario: (usuarioId) => axios.get(`/api/reservas/usuario/${usuarioId}`),

  // Verificar disponibilidad
  verificarDisponibilidad: (fecha, personas) =>
    axios.get('/api/reservas/disponibilidad', {
      params: { fecha, personas },
    }),

  // Crear una nueva reserva
  crearReserva: (reservaData) => axios.post('/api/reservas', reservaData),

  // Actualizar reserva
  actualizarReserva: (reservaId, reservaData) => axios.put(`/api/reservas/${reservaId}`, reservaData),

  // Actualizar estado de la reserva
  actualizarEstado: (reservaId, estado) => 
    axios.patch(`/api/reservas/${reservaId}/estado?estado=${estado}`),

  // Cancelar una reserva
  cancelarReserva: (reservaId) => axios.patch(`/api/reservas/${reservaId}/estado`, 'CANCELADA'),

  // Eliminar/Cancelar una reserva
  eliminarReserva: (reservaId) => axios.delete(`/api/reservas/${reservaId}`),
};

// Endpoints para Autenticación
export const authApi = {
  login: (credentials) => axios.post('/api/auth/login', credentials),

  register: (userData) => axios.post('/api/auth/register', userData),

  logout: () => axios.post('/api/auth/logout'),
};

// Endpoints para Pagos
export const pagosApi = {
  crearPago: (pagoData) => axios.post('/api/pagos', pagoData),

  listarPagos: () => axios.get('/api/pagos'),

  obtenerPago: (pagoId) => axios.get(`/api/pagos/${pagoId}`),

  listarPagosPorPedido: (pedidoId) => axios.get(`/api/pagos/pedido/${pedidoId}`),

  eliminarPago: (pagoId) => axios.delete(`/api/pagos/${pagoId}`),
};

// Endpoints para Usuario
export const usuarioApi = {
  obtenerUsuarios: () => axios.get('/api/usuarios'),

  obtenerUsuario: (userId) => axios.get(`/api/usuarios/${userId}`),

  crearUsuario: (userData) => axios.post('/api/usuarios', userData),

  actualizarUsuario: (userId, userData) => axios.put(`/api/usuarios/${userId}`, userData),

  eliminarUsuario: (userId) => axios.delete(`/api/usuarios/${userId}`),

  cambiarEstado: (userId, estado) =>
    axios.put(`/api/usuarios/${userId}/estado`, { activo: estado }),

  obtenerMeseros: () => axios.get('/api/usuarios/meseros'),

  buscarUsuarios: (query) => axios.get('/api/usuarios/buscar', { params: { query } }),
};

// Endpoints para Menú
export const menuApi = {
  // Endpoints para Productos
  crearProducto: (productoDTO) => axios.post('/api/productos', productoDTO),

  obtenerProductos: () => axios.get('/api/productos'),

  obtenerProducto: (productoId) => axios.get(`/api/productos/${productoId}`),

  actualizarProducto: (productoId, productoDTO) =>
    axios.put(`/api/productos/${productoId}`, productoDTO),

  eliminarProducto: (productoId) => axios.delete(`/api/productos/${productoId}`),

  buscarProductos: (query) => axios.get('/api/productos/buscar', { params: { query } }),

  // Endpoints para Categorías
  crearCategoria: (categoriaData) => axios.post('/api/categorias', categoriaData),

  obtenerCategorias: () => axios.get('/api/categorias'),

  obtenerCategoria: (categoriaId) => axios.get(`/api/categorias/${categoriaId}`),

  eliminarCategoria: (categoriaId) => axios.delete(`/api/categorias/${categoriaId}`),
};

// Endpoints para Carrito
export const carritoApi = {
  crearCarrito: () => axios.post('/api/carritos'),

  obtenerCarrito: (usuarioId) => axios.get(`/api/carritos/usuario/${usuarioId}`),

  agregarItem: (carritoId, item) => axios.post(`/api/carritos/${carritoId}/items`, item),

  eliminarItem: (carritoId, itemId) => axios.delete(`/api/carritos/${carritoId}/items/${itemId}`),

  vaciarCarrito: (carritoId) => axios.delete(`/api/carritos/${carritoId}/vaciar`),

  obtenerItems: (carritoId) => axios.get(`/api/carritos/${carritoId}/items`),

  convertirAPedido: (carritoId) => axios.put(`/api/carritos/${carritoId}/convertir-pedido`),
};

// Utilidades para Cocinero
export const getPedidosCocina = async () => {
  try {
    return await pedidosApi.obtenerPedidosCocina();
  } catch (error) {
    throw error;
  }
};

export const getOrdenesMesa = async () => {
  try {
    return await mesaOrdenesApi.listarOrdenes();
  } catch (error) {
    throw error;
  }
};

export const updateEstadoPedido = async (id, estado) => {
  try {
    await pedidosApi.actualizarEstado(id, estado);
  } catch (error) {
    throw error;
  }
};

export const updateEstadoOrdenMesa = async (id, estado) => {
  try {
    await mesaOrdenesApi.actualizarEstadoOrden(id, estado);
  } catch (error) {
    throw error;
  }
};
