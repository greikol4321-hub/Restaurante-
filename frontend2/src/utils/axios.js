import axios from 'axios';

// Configuración base de axios
const instance = axios.create({
  baseURL: 'http://localhost:8080', // URL de tu API
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para CORS con credenciales
});

// Interceptor para agregar información de usuario si está disponible
instance.interceptors.request.use(
  (config) => {
    // Debug: log de todas las requests
    console.log('🔄 Axios Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data
    });
    
    // Agregar el ID del usuario si está disponible
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      config.headers['X-User-Id'] = userData.id;
      console.log('User ID en headers:', userData.id); // Para debug
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🚨 Axios Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    
    // Como no hay autenticación real en el backend, no necesitamos manejar 401s especialmente
    // Solo registrar el error y continuar
    return Promise.reject(error);
  }
);

export default instance;
