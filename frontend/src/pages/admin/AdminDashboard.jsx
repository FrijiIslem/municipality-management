import { useQuery } from 'react-query'
import { tourAPI, containerAPI, incidentAPI, agentAPI, citoyenAPI, vehicleAPI, notificationAPI } from '../../services/api'
import { Route, Trash2, AlertTriangle, Users, Truck, UserCheck, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const AdminDashboard = () => {
  const { data: tours = [] } = useQuery('tours', tourAPI.getAll)
  const { data: containers = [] } = useQuery('containers', containerAPI.getAll)
  const { data: incidents = [] } = useQuery('incidents', incidentAPI.getAll)
  const { data: agents = [] } = useQuery('agents', agentAPI.getAll)
  const { data: citoyens = [] } = useQuery('citoyens', citoyenAPI.getAll)
  const { data: vehicles = [] } = useQuery('vehicles', vehicleAPI.getAll)
  const { data: notifications = [] } = useQuery('notifications', notificationAPI.getAll)

  const activeTours = tours.filter(t => t.etat === 'EN_COURS' || t.etat === 'ENCOURS')
  const pendingTours = tours.filter(t => t.etat === 'PLANIFIEE')
  const pendingIncidents = incidents.filter(i => i.statut === 'EN_ATTENTE')
  const fullContainers = containers.filter(c => c.etatRemplissage === 'saturee' || c.etatRemplissage === 'SATUREE')
  
  // Notifications récentes pour l'admin (planification automatique)
  const recentPlanningNotifications = notifications
    .filter(n => n.destination === 'admin' && (n.type === 'REMINDER' || n.message?.includes('planifiée')))
    .slice(0, 3)
    .sort((a, b) => new Date(b.dateEnvoi || b.dateCreation || 0) - new Date(a.dateEnvoi || a.dateCreation || 0))

  const stats = [
    {
      label: 'Agents',
      value: agents.length,
      icon: UserCheck,
      color: 'blue-500',
      link: '/admin/users',
    },
    {
      label: 'Citoyens',
      value: citoyens.length,
      icon: Users,
      color: 'green-500',
      link: '/admin/users',
    },
    {
      label: 'Tournées actives',
      value: activeTours.length,
      icon: Route,
      color: 'purple-500',
      link: '/admin/tours',
    },
    {
      label: 'Tournées à valider',
      value: pendingTours.length,
      icon: Bell,
      color: 'yellow-500',
      link: '/admin/tours',
    },
    {
      label: 'Conteneurs pleins',
      value: fullContainers.length,
      icon: Trash2,
      color: 'red-500',
      link: '/admin/containers',
    },
    {
      label: 'Incidents en attente',
      value: pendingIncidents.length,
      icon: AlertTriangle,
      color: 'orange-500',
      link: '/admin/incidents',
    },
    {
      label: 'Véhicules',
      value: vehicles.length,
      icon: Truck,
      color: 'indigo-500',
      link: '/admin/vehicles',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
          Tableau de bord Administrateur
        </h1>
        <p className="text-gray-600">Vue d'ensemble du système</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Recent Planning Notifications */}
      {recentPlanningNotifications.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-anthracite">
              Notifications de planification
            </h2>
            <Link
              to="/admin/notifications"
              className="text-red-500 hover:underline text-sm font-medium"
            >
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentPlanningNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg hover:border-yellow-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-anthracite mb-1">
                      Planification automatique
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {notification.message || notification.contenu}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.dateEnvoi || notification.dateCreation
                        ? format(
                            new Date(notification.dateEnvoi || notification.dateCreation),
                            'dd MMM yyyy à HH:mm',
                            { locale: fr }
                          )
                        : 'Date inconnue'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Incidents */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-anthracite">
            Incidents récents
          </h2>
          <Link
            to="/admin/incidents"
            className="text-red-500 hover:underline text-sm font-medium"
          >
            Voir tout
          </Link>
        </div>
        
        {incidents.length > 0 ? (
          <div className="space-y-3">
            {incidents.slice(0, 5).map((incident) => (
              <div
                key={incident.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-light-gray transition-all"
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
        ) : (
          <p className="text-gray-500 text-center py-8">
            Aucun incident
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

