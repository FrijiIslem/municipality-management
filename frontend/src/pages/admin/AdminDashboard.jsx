import { useQuery } from 'react-query'
import { tourAPI, containerAPI, incidentAPI, agentAPI, citoyenAPI, vehicleAPI } from '../../services/api'
import { Route, Trash2, AlertTriangle, Users, Truck, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const { data: tours = [] } = useQuery('tours', tourAPI.getAll)
  const { data: containers = [] } = useQuery('containers', containerAPI.getAll)
  const { data: incidents = [] } = useQuery('incidents', incidentAPI.getAll)
  const { data: agents = [] } = useQuery('agents', agentAPI.getAll)
  const { data: citoyens = [] } = useQuery('citoyens', citoyenAPI.getAll)
  const { data: vehicles = [] } = useQuery('vehicles', vehicleAPI.getAll)

  const activeTours = tours.filter(t => t.etat === 'EN_COURS')
  const pendingIncidents = incidents.filter(i => i.statut === 'EN_ATTENTE')
  const fullContainers = containers.filter(c => c.etatRemplissage === 'PLEIN')

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

