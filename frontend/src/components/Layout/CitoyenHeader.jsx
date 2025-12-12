import { Bell, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { notificationAPI } from '../../services/api'
import useAuthStore from '../../store/authStore'

const CitoyenHeader = () => {
  const { user, logout } = useAuthStore()
  const { data: unreadCount = 0 } = useQuery(
    ['unreadNotifications', 'citoyen'],
    () => notificationAPI.getUnreadFor('citoyen'),
    {
      select: (data) => data?.length || 0,
      refetchInterval: 30000,
    }
  )

  return (
    <header className="bg-white shadow-card sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-eco-green to-mint-green rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-xl">U</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-anthracite">
            Urbanova Citoyen
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/citoyen/notifications"
            className="relative p-2 rounded-lg hover:bg-light-gray transition-colors"
          >
            <Bell className="w-6 h-6 text-anthracite" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-eco-green rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-anthracite">
                {user?.prenom || 'Citoyen'} {user?.nom || ''}
              </p>
              <p className="text-xs text-gray-500">{user?.email || 'Citoyen'}</p>
            </div>
            <button
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}
              className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default CitoyenHeader

