import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { incidentAPI, containerAPI, notificationAPI } from '../../services/api'
import { AlertTriangle, Trash2, Bell, MapPin, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import NearbyContainersMap from '../../components/Container/NearbyContainersMap'
import WeatherWidget from '../../components/Weather/WeatherWidget'
import TrashChatbot from '../../components/Chatbot/TrashChatbot'

// Trash schedule by day of week
const TRASH_SCHEDULE = {
  1: { type: 'organique', label: 'Organique', color: 'green', icon: '🌱' },
  2: { type: 'plastique', label: 'Plastique', color: 'blue', icon: '♻️' },
  3: { type: 'organique', label: 'Organique', color: 'green', icon: '🌱' },
  4: { type: 'mixte', label: 'Mixte', color: 'purple', icon: '🗑️' },
  5: { type: 'métals', label: 'Métaux', color: 'gray', icon: '🔩' },
  6: { type: 'organique', label: 'Organique', color: 'green', icon: '🌱' },
  0: { type: 'verre', label: 'Verre', color: 'cyan', icon: '🍾' },
}

const getTodayTrashType = () => {
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
  return TRASH_SCHEDULE[today] || TRASH_SCHEDULE[1]
}

const getDayName = (dayIndex) => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  return days[dayIndex]
}

const CitoyenDashboard = () => {
  const { user } = useAuthStore()

  const { data: incidents = [] } = useQuery(
    'myIncidents',
    () => incidentAPI.getAll(),
    {
      select: (data) => data.filter(i => i.utilisateurId === user?.id) || [],
    }
  )
  const { data: containers = [] } = useQuery('containers', containerAPI.getAll)
  const destination = 'citoyen'
  const { data: notifications = [] } = useQuery(
    ['notifications', destination, user?.id || 'anon'],
    () => notificationAPI.getAllFor(destination),
    {
      select: (data) => {
        const list = Array.isArray(data) ? data : []
        if (!user?.id) return list
        return list.filter(n => (
          n?.userId === user.id ||
          n?.utilisateurId === user.id ||
          n?.destinataireId === user.id ||
          n?.citoyenId === user.id
        ))
      }
    }
  )

  const todayTrash = getTodayTrashType()
  const today = new Date()
  const dayName = getDayName(today.getDay())

  const [nearbyContainersCount, setNearbyContainersCount] = useState(0)

  const myIncidents = incidents.filter(i => i.utilisateurId === user?.id)
  const unreadNotifications = notifications.filter(n => !n.lu)

  // Calculate nearby containers count
  useEffect(() => {
    if (containers.length > 0) {
      // Count containers with valid locations
      // In a real scenario with geocoding, this would be more accurate
      // For now, we count all containers that have a localisation field
      const validContainers = containers.filter(c => {
        if (!c.localisation) return false
        // Check if it's an object with coordinates or a string (address to be geocoded)
        if (typeof c.localisation === 'object' && c.localisation !== null) {
          return !!(c.localisation.latitude || c.localisation.lat || c.localisation.adresse)
        }
        if (typeof c.localisation === 'string') {
          return c.localisation.trim().length > 0
        }
        return false
      })
      setNearbyContainersCount(validContainers.length)
    } else {
      setNearbyContainersCount(0)
    }
  }, [containers])

  const stats = [
    {
      label: 'Mes incidents',
      value: myIncidents.length,
      icon: AlertTriangle,
      color: 'orange-500',
      link: '/citoyen/incidents',
    },
    {
      label: 'Conteneurs proches',
      value: nearbyContainersCount,
      icon: MapPin,
      color: 'green-500',
      link: '/citoyen/containers',
    },
    {
      label: 'Notifications',
      value: unreadNotifications.length,
      icon: Bell,
      color: 'blue-500',
      link: '/citoyen/notifications',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Chatbot */}
      <TrashChatbot />

      <div>
        <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
          Bienvenue, {user?.prenom || 'Citoyen'} !
        </h1>
        <p className="text-gray-600">Votre tableau de bord personnel</p>
      </div>

      {/* Today's Trash Type */}
      <div className="card bg-gradient-to-r from-eco-green/10 to-green-100 border-2 border-eco-green/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-eco-green rounded-lg flex items-center justify-center text-3xl shadow-lg">
              {todayTrash.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-gray-600" />
                <p className="text-sm text-gray-600">{dayName}</p>
              </div>
              <h2 className="text-2xl font-heading font-bold text-anthracite">
                Collecte d'aujourd'hui : {todayTrash.label}
              </h2>
              <p className="text-gray-600 mt-1">
                N'oubliez pas de sortir vos déchets {todayTrash.label.toLowerCase()} aujourd'hui
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-eco-green">
              {today.getDate()}
            </div>
            <div className="text-sm text-gray-600">
              {today.toLocaleDateString('fr-FR', { month: 'long' })}
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Containers Map - Moved to top */}
      <NearbyContainersMap userAddress={user?.adresse} />

      {/* Stats Cards and Weather Widget - Improved styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorMap = {
            'orange-500': {
              bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
              iconBg: 'bg-gradient-to-br from-orange-400 to-orange-500',
              border: 'border-orange-200',
              text: 'text-orange-700'
            },
            'green-500': {
              bg: 'bg-gradient-to-br from-green-50 to-green-100',
              iconBg: 'bg-gradient-to-br from-green-400 to-green-500',
              border: 'border-green-200',
              text: 'text-green-700'
            },
            'blue-500': {
              bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
              iconBg: 'bg-gradient-to-br from-blue-400 to-blue-500',
              border: 'border-blue-200',
              text: 'text-blue-700'
            }
          }
          const colors = colorMap[stat.color] || colorMap['blue-500']
          
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className={`card card-hover ${colors.bg} ${colors.border} border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${colors.text} mb-2 opacity-80`}>{stat.label}</p>
                  <p className={`text-4xl font-bold ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-xs text-gray-600 opacity-70">Cliquez pour voir plus →</p>
              </div>
            </Link>
          )
        })}
        
        {/* Weather Widget */}
        <WeatherWidget />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/citoyen/incidents"
          className="card card-hover border-2 border-orange-200 hover:border-orange-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-anthracite mb-1">
                Signaler un incident
              </h3>
              <p className="text-gray-600">
                Signalez un problème lié à la collecte des déchets
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/citoyen/containers"
          className="card card-hover border-2 border-green-200 hover:border-green-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-anthracite mb-1">
                Conteneurs proches
              </h3>
              <p className="text-gray-600">
                Trouvez les conteneurs de collecte près de chez vous
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Incidents */}
      {myIncidents.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-anthracite">
              Mes incidents récents
            </h2>
            <Link
              to="/citoyen/incidents"
              className="text-eco-green hover:underline text-sm font-medium"
            >
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-3">
            {myIncidents.slice(0, 3).map((incident) => (
              <div
                key={incident.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-light-gray transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-anthracite">
                      {incident.categorie || 'Incident'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {incident.description || 'Aucune description'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {incident.date ? new Date(incident.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </p>
                  </div>
                  <span className={`badge ${
                    incident.statut === 'FIXEE' ? 'badge-success' :
                    incident.statut === 'EN_ATTENTE' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {incident.statut || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CitoyenDashboard
