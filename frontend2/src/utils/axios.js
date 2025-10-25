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
    // Agregar el ID del usuario si está disponible
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      config.headers['X-User-Id'] = userData.id;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Como no hay autenticación real en el backend, no necesitamos manejar 401s especialmente
    // Solo registrar el error y continuar
    return Promise.reject(error);
  }
);

export default instance;
