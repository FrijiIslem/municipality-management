import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, role } = useAuthStore()
  
  // En mode développement, permettre l'accès admin sans authentification
  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development'
  const allowAdminAccess = isDevelopment && requiredRole === 'ADMIN'

  // Si c'est une route admin en développement, permettre l'accès sans auth
  if (allowAdminAccess && !isAuthenticated) {
    console.warn('⚠️ Mode développement : Accès admin sans authentification')
    return children
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    // Rediriger vers la page appropriée selon le rôle
    if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    } else if (role === 'CITOYEN') {
      return <Navigate to="/citoyen" replace />
    } else {
      return <Navigate to="/app" replace />
    }
  }

  return children
}

export default ProtectedRoute

