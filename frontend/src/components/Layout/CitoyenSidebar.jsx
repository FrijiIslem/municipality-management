import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Trash2, 
  Bell,
  User,
  LogOut 
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const menuItems = [
  { path: '/citoyen', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/citoyen/incidents', icon: AlertTriangle, label: 'Signaler un incident' },
  { path: '/citoyen/containers', icon: Trash2, label: 'Conteneurs proches' },
  { path: '/citoyen/notifications', icon: Bell, label: 'Notifications' },
  { path: '/citoyen/profile', icon: User, label: 'Mon profil' },
]

const CitoyenSidebar = () => {
  const { logout } = useAuthStore()

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-card">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-eco-green text-white'
                        : 'text-anthracite hover:bg-light-gray'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={() => {
              logout()
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default CitoyenSidebar

