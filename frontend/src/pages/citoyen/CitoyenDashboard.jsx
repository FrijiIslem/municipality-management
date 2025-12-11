import { useQuery } from 'react-query'
import { incidentAPI, containerAPI, notificationAPI } from '../../services/api'
import { AlertTriangle, Trash2, Bell, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

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

  const myIncidents = incidents.filter(i => i.utilisateurId === user?.id)
  const pendingIncidents = myIncidents.filter(i => i.statut === 'EN_ATTENTE')
  const fullContainers = containers.filter(c => c.etatRemplissage === 'PLEIN')
  const unreadNotifications = notifications.filter(n => !n.lu)

  const stats = [
    {
      label: 'Mes incidents',
      value: myIncidents.length,
      icon: AlertTriangle,
      color: 'orange-500',
      link: '/citoyen/incidents',
    },
    {
      label: 'En attente',
      value: pendingIncidents.length,
      icon: AlertTriangle,
      color: 'yellow-500',
      link: '/citoyen/incidents',
    },
    {
      label: 'Conteneurs pleins',
      value: fullContainers.length,
      icon: Trash2,
      color: 'red-500',
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
      <div>
        <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
          Bienvenue, {user?.prenom || 'Citoyen'} !
        </h1>
        <p className="text-gray-600">Votre tableau de bord personnel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="card card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-anthracite">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
            </Link>
          )
        })}
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

