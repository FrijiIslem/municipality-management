import { create } from 'zustand'
import { citoyenAPI, authAPI } from '../services/api'

// Simple localStorage-based persistence
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('auth-storage')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const setStoredAuth = (data) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save auth to localStorage', e)
  }
}

const clearStoredAuth = () => {
  try {
    localStorage.removeItem('auth-storage')
  } catch (e) {
    console.error('Failed to clear auth from localStorage', e)
  }
}

const useAuthStore = create((set) => {
  // Initialize from localStorage
  const stored = getStoredAuth()
  const initialState = stored || {
    user: null,
    role: null,
    isAuthenticated: false,
    token: null,
  }

  return {
    ...initialState,
    
    login: (userData, token) => {
      const newState = {
        user: userData,
        role: userData?.role || 'AGENT',
        isAuthenticated: true,
        token: token,
      }
      set(newState)
      setStoredAuth(newState)
      if (token) {
        localStorage.setItem('token', token)
      }
    },
    
    register: async ({ nom, prenom, email, telephone, adresse, password, role = 'CITOYEN' }) => {
      const payload = {
        nom,
        prenom,
        email,
        numeroTel: telephone,
        telephone,
        adresse,
        password,
        role,
      }
      await citoyenAPI.create(payload)
      const response = await authAPI.login(email, password)
      const userData = {
        id: response.id,
        email: response.email,
        nom: response.nom,
        prenom: response.prenom,
        numeroTel: response.numeroTel,
        role: response.role || 'CITOYEN',
      }
      const newState = {
        user: userData,
        role: userData.role || 'CITOYEN',
        isAuthenticated: true,
        token: null,
      }
      set(newState)
      setStoredAuth(newState)
      return userData
    },
    
    logout: () => {
      const newState = {
        user: null,
        role: null,
        isAuthenticated: false,
        token: null,
      }
      set(newState)
      clearStoredAuth()
      localStorage.removeItem('token')
    },
    
    setUser: (userData) => {
      const currentState = getStoredAuth() || {}
      const newState = {
        ...currentState,
        user: userData,
        role: userData?.role || 'AGENT',
      }
      set(newState)
      setStoredAuth(newState)
    },
  }
})

export default useAuthStore

