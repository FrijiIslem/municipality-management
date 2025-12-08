import { useQuery } from 'react-query'
import { tourAPI, containerAPI, notificationAPI } from '../services/api'
import { Route, Trash2, Bell, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { data: tours = [] } = useQuery('tours', tourAPI.getAll)
  const { data: containers = [] } = useQuery('containers', containerAPI.getAll)
  const { data: notifications = [] } = useQuery('notifications', notificationAPI.getUnread)

  const activeTours = tours.filter(t => t.etat === 'EN_COURS')
  const pendingTours = tours.filter(t => t.etat === 'PLANIFIEE')
  const fullContainers = containers.filter(c => c.etatRemplissage === 'PLEIN')

  const stats = [
    {
      label: 'Tournées actives',
      value: activeTours.length,
      icon: Route,
      color: 'eco-green',
      link: '/tours',
    },
    {
      label: 'En attente',
      value: pendingTours.length,
      icon: CheckCircle,
      color: 'urban-blue',
      link: '/tours',
    },
    {
      label: 'Conteneurs pleins',
      value: fullContainers.length,
      icon: Trash2,
      color: 'red-500',
      link: '/containers',
    },
    {
      label: 'Notifications',
      value: notifications.length,
      icon: Bell,
      color: 'mint-green',
      link: '/notifications',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">Vue d'ensemble de vos activités</p>
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

      {/* Active Tours */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-anthracite">
            Tournées actives
          </h2>
          <Link
            to="/tours"
            className="text-eco-green hover:underline text-sm font-medium"
          >
            Voir tout
          </Link>
        </div>
        
        {activeTours.length > 0 ? (
          <div className="space-y-3">
            {activeTours.slice(0, 3).map((tour) => (
              <Link
                key={tour.id}
                to={`/tours/${tour.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-eco-green hover:bg-light-gray transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-anthracite">
                      Tournée #{tour.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {tour.conteneurs?.length || 0} conteneurs • Zone {tour.zone}
                    </p>
                  </div>
                  <span className="badge badge-success">En cours</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Aucune tournée active
          </p>
        )}
      </div>
    </div>
  )
}

export default Dashboard

