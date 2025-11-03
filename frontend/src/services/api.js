import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API de autenticación
export const authAPI = {
  // Registrar usuario
  register: (userData) => api.post('/auth/register', userData),
  
  // Iniciar sesión
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Cerrar sesión
  logout: () => api.post('/auth/logout'),
  
  // Obtener perfil
  getProfile: () => api.get('/auth/profile'),
  
  // Actualizar perfil
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  
  // Cambiar contraseña
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  
  // Refrescar token
  refreshToken: () => api.post('/auth/refresh'),
  
  // Verificar email
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  
  // Solicitar recuperación de contraseña
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Restablecer contraseña
  resetPassword: (tokenData) => api.post('/auth/reset-password', tokenData)
};

// API de convocatorias
export const convocatoriasAPI = {
  // Obtener todas las convocatorias
  getAll: (params = {}) => api.get('/convocatorias', { params }),
  
  // Obtener convocatoria por ID
  getById: (id) => api.get(`/convocatorias/${id}`),
  
  // Crear convocatoria
  create: (convocatoriaData) => api.post('/convocatorias', convocatoriaData),
  
  // Actualizar convocatoria
  update: (id, convocatoriaData) => api.put(`/convocatorias/${id}`, convocatoriaData),
  
  // Eliminar convocatoria
  delete: (id) => api.delete(`/convocatorias/${id}`),
  
  // Cambiar estado de convocatoria
  changeStatus: (id, status) => api.patch(`/convocatorias/${id}/status`, { status }),
  
  // Postularse a convocatoria
  apply: (id, applicationData) => api.post(`/convocatorias/${id}/apply`, applicationData),
  
  // Obtener postulaciones de una convocatoria
  getApplications: (id, params = {}) => api.get(`/convocatorias/${id}/applications`, { params })
};

// API de docentes
export const docentesAPI = {
  // Obtener todos los docentes
  getAll: (params = {}) => api.get('/docentes', { params }),
  
  // Obtener docente por ID
  getById: (id) => api.get(`/docentes/${id}`),
  
  // Actualizar perfil de docente
  updateProfile: (id, profileData) => api.put(`/docentes/${id}`, profileData),
  
  // Subir CV
  uploadCV: (id, formData) => api.post(`/docentes/${id}/cv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Obtener postulaciones del docente
  getApplications: (id, params = {}) => api.get(`/docentes/${id}/applications`, { params })
};

// API de instituciones
export const institucionesAPI = {
  // Obtener todas las instituciones
  getAll: (params = {}) => api.get('/instituciones', { params }),
  
  // Obtener institución por ID
  getById: (id) => api.get(`/instituciones/${id}`),
  
  // Crear institución
  create: (institucionData) => api.post('/instituciones', institucionData),
  
  // Actualizar institución
  update: (id, institucionData) => api.put(`/instituciones/${id}`, institucionData),
  
  // Eliminar institución
  delete: (id) => api.delete(`/instituciones/${id}`)
};

// API de administración
export const adminAPI = {
  // Obtener estadísticas del dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Obtener usuarios
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  
  // Crear usuario
  createUser: (userData) => api.post('/admin/users', userData),
  
  // Actualizar usuario
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  
  // Eliminar usuario
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Obtener configuraciones
  getConfigurations: () => api.get('/admin/configurations'),
  
  // Actualizar configuración
  updateConfiguration: (key, value) => api.put('/admin/configurations', { key, value })
};

// Función para verificar salud del servidor
export const healthCheck = () => api.get('/health');

// Función para probar conexión
export const testConnection = async () => {
  try {
    const response = await healthCheck();
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al probar conexión:', error);
    return { success: false, error: error.message };
  }
};

// Alias para mantener compatibilidad con componentes
export const docentesService = docentesAPI;

export default api;
