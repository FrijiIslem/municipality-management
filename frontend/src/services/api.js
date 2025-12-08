import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Tour API
export const tourAPI = {
  getAll: () => api.get('/tournees'),
  getById: (id) => api.get(`/tournees/${id}`),
  create: (data) => api.post('/tournees', data),
  update: (id, data) => api.put(`/tournees/${id}`, data),
  delete: (id) => api.delete(`/tournees/${id}`),
  accept: (id) => api.put(`/tournees/${id}/accept`),
  start: (id) => api.put(`/tournees/${id}/start`),
  complete: (id) => api.put(`/tournees/${id}/complete`),
  getOptimalRoute: (tourneeId) => api.get(`/tournees/${tourneeId}/route`),
}

// Container API
export const containerAPI = {
  getAll: () => api.get('/conteneurs'),
  getById: (id) => api.get(`/conteneurs/${id}`),
  update: (id, data) => api.put(`/conteneurs/${id}`, data),
  markEmpty: (id) => api.put(`/conteneurs/${id}/empty`),
  getByZone: (zoneId) => api.get(`/conteneurs/zone/${zoneId}`),
}

// Notification API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
}

// Agent API
export const agentAPI = {
  getAll: () => api.get('/utilisateurs/getagents'),
  getAvailable: (typeTache) => api.get(`/utilisateurs/getagenttache/${typeTache}`),
}

// Vehicle API
export const vehicleAPI = {
  getAll: () => api.get('/vehicules'),
  getAvailable: () => api.get('/vehicules?disponible=true'),
}

export default api

