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
    // Gestion spéciale pour les erreurs de connexion
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
      error.message = 'Le serveur backend n\'est pas accessible. Veuillez démarrer le backend Spring Boot sur le port 9090.'
      error.isConnectionError = true
      console.error('❌ Erreur de connexion au backend:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: 'Assurez-vous que le backend est démarré avec: cd projetJEE && mvnw spring-boot:run'
      })
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // Extraire le message d'erreur du backend Spring Boot
    if (error.response?.data) {
      const data = error.response.data
      
      // Si c'est une string, l'utiliser directement
      if (typeof data === 'string') {
        error.message = data
      }
      // Si c'est un objet avec un message
      else if (data.message) {
        error.message = data.message
      }
      // Si c'est un objet avec un champ error (format Spring Boot standard)
      else if (data.error) {
        error.message = typeof data.error === 'string' ? data.error : data.error.message || data.error
      }
      // Si c'est un tableau de messages (validation errors)
      else if (Array.isArray(data) && data.length > 0) {
        error.message = data.map(err => err.message || err).join(', ')
      }
      // Si c'est un objet avec d'autres champs, essayer de trouver un message
      else if (typeof data === 'object') {
        // Chercher un champ qui pourrait contenir le message
        const possibleFields = ['message', 'error', 'reason', 'detail', 'status']
        for (const field of possibleFields) {
          if (data[field]) {
            error.message = typeof data[field] === 'string' ? data[field] : String(data[field])
            break
          }
        }
      }
    }
    
    // Si aucun message n'a été trouvé, utiliser le message par défaut
    if (!error.message || error.message === 'Request failed with status code ' + error.response?.status) {
      const statusMessages = {
        409: 'Cette ressource existe déjà',
        400: 'Données invalides',
        404: 'Ressource non trouvée',
        500: 'Erreur serveur',
      }
      error.message = statusMessages[error.response?.status] || 'Une erreur est survenue'
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
  planifyAutomatic: () => api.post('/tournees/planifier-automatique'),
  validate: (id) => api.put(`/tournees/${id}/valider`),
  release: (id) => api.put(`/tournees/${id}/liberer`),
  start: (id) => api.put(`/tournees/${id}/start`),
  complete: (id) => api.put(`/tournees/${id}/complete`),
}

// Container API
export const containerAPI = {
  getAll: () => api.get('/conteneurs'),
  getById: (id) => api.get(`/conteneurs/${id}`),
  create: (data) => api.post('/conteneurs', data),
  update: (id, data) => api.put(`/conteneurs/${id}`, data),
  delete: (id) => api.delete(`/conteneurs/${id}`),
  markEmpty: (id) => api.put(`/conteneurs/${id}/empty`),
  getByZone: (zoneId) => api.get(`/conteneurs/zone/${zoneId}`),
}

// Notification API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => {
    // Filter unread notifications on client side if backend doesn't have endpoint
    return api.get('/notifications').then(data => 
      Array.isArray(data) ? data.filter(n => !n.lu) : []
    )
  },
  getByDestination: (destination) => api.get(`/notifications/destination/${destination}`),
  getByType: (type) => api.get(`/notifications/type/${type}`),
  create: (data) => api.post('/notifications', data),
  // Note: These endpoints may need to be implemented in the backend
  markAsRead: (id) => {
    // For now, just return a promise that resolves
    // In a real app, this would call the backend
    return Promise.resolve({ id, lu: true })
  },
  markAllAsRead: () => {
    // For now, just return a promise that resolves
    // In a real app, this would call the backend
    return Promise.resolve({ success: true })
  },
}

// Agent API
export const agentAPI = {
  getAll: () => api.get('/utilisateurs/getagents'),
  getAvailable: (typeTache) => api.get(`/utilisateurs/getagenttache/${typeTache}`),
  create: (data) => {
    console.log('=== DEBUG: Envoi Agent ===', JSON.stringify(data, null, 2))
    return api.post('/utilisateurs/agents', data)
  },
  update: (data) => api.put('/utilisateurs/agentsMod', data),
  delete: (id) => api.delete(`/utilisateurs/agentssupp/${id}`),
  getCount: () => api.get('/utilisateurs/agents/count'),
}

// Citoyen API
export const citoyenAPI = {
  getAll: () => api.get('/utilisateurs/getcitoyens'),
  getById: (id) => api.get(`/utilisateurs/citoyens/${id}`),
  create: (data) => api.post('/utilisateurs/citoyens', data),
  update: (ancienPassword, data) => api.put('/utilisateurs/citoyensMod', data, {
    params: { ancienPassword },
  }),
  delete: (id) => api.delete(`/utilisateurs/citoyenssupp/${id}`),
  getCount: () => api.get('/utilisateurs/citoyens/count'),
}

// Incident API
export const incidentAPI = {
  getAll: () => api.get('/Incidents/all'),
  getByStatut: (statut) => api.get(`/Incidents/statut/${statut}`),
  search: (date, hour) => api.get('/Incidents/search', {
    params: { date, hour },
  }),
  countByCategorie: (categorie) => api.get(`/Incidents/countByCategorie/${categorie}`),
  create: (data) => api.post('/Incidents/create', data),
}

// Vehicle API
export const vehicleAPI = {
  getAll: () => api.get('/vehicules'),
  getAvailable: () => api.get('/vehicules?disponible=true'),
  getById: (id) => api.get(`/vehicules/${id}`),
  create: (data) => api.post('/vehicules', data),
  update: (id, data) => api.put(`/vehicules/${id}`, data),
  delete: (id) => api.delete(`/vehicules/${id}`),
}

// Authentication API
export const authAPI = {
  login: (email, password) => api.post('/utilisateurs/auth', null, {
    params: { email, password },
  }),
  getCurrentUser: () => api.get('/utilisateurs/me'),
}

export default api

