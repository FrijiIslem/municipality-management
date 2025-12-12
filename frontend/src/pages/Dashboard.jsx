import { useState } from 'react'
import { useQuery } from 'react-query'
import { tourAPI, containerAPI, notificationAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import { Route, Trash2, Bell, CheckCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import TourMap from '../components/Map/TourMap'
import IncidentModal from '../components/Incident/IncidentModal'

const Dashboard = () => {
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const { role, user } = useAuthStore()
  const { data: tours = [] } = useQuery(
    ['tours', role, user?.id],
    () => role === 'ADMIN' ? tourAPI.getAll() : (user?.id ? tourAPI.getByAgent(user.id) : Promise.resolve([]))
  )
  const { data: containers = [] } = useQuery('containers', containerAPI.getAll)
  
  // Récupérer les notifications par ID utilisateur (le backend utilise l'ID comme destination)
  const { data: notifications = [] } = useQuery(
    ['unreadNotifications', user?.id || 'anon'],
    () => {
      if (!user?.id) return Promise.resolve([])
      // Le backend envoie les notifications avec destination = agent.getId()
      return notificationAPI.getByDestination(user.id).then(data => 
        Array.isArray(data) ? data.filter(n => !n.lu) : []
      )
    },
    { enabled: !!user?.id }
  )

  const activeTours = (Array.isArray(tours) ? tours : []).filter(t => t.etat === 'EN_COURS' || t.etat === 'ENCOURS')
  const pendingTours = tours.filter(t => t.etat === 'PLANIFIEE')
  const fullContainers = containers.filter(c => c.etatRemplissage === 'PLEIN')

  const activeTour = activeTours[0]
  const { data: activeRoute = [], isLoading: routeLoading } = useQuery(
    ['active-tour-route', activeTour?.id],
    () => tourAPI.getOptimalRoute(activeTour.id),
    { enabled: !!activeTour?.id, retry: 1 }
  )

  const getMapCenter = () => {
    const TUNIS_CENTER = [36.8065, 10.1815]
    const tour = activeTour
    if (!tour?.conteneurs || tour.conteneurs.length === 0) return TUNIS_CENTER
    try {
      const first = tour.conteneurs[0]
      let lat, lng
      if (first?.localisation) {
        if (typeof first.localisation === 'string') {
          const loc = JSON.parse(first.localisation)
          lat = parseFloat(loc.latitude || loc.lat)
          lng = parseFloat(loc.longitude || loc.lng)
        } else if (typeof first.localisation === 'object') {
          lat = parseFloat(first.localisation.latitude || first.localisation.lat)
          lng = parseFloat(first.localisation.longitude || first.localisation.lng)
        }
        if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) return [lat, lng]
      }
    } catch {}
    return TUNIS_CENTER
  }

  const stats = [
    {
      label: 'Tournées actives',
      value: activeTours.length,
      icon: Route,
      color: 'eco-green',
      link: '/app/tours',
    },
    {
      label: 'En attente',
      value: pendingTours.length,
      icon: CheckCircle,
      color: 'urban-blue',
      link: '/app/tours',
    },
    {
      label: 'Conteneurs pleins',
      value: fullContainers.length,
      icon: Trash2,
      color: 'red-500',
      link: '/app/containers',
    },
    {
      label: 'Notifications',
      value: notifications.length,
      icon: Bell,
      color: 'mint-green',
      link: '/app/notifications',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">Vue d'ensemble de vos activités</p>
        </div>
        <button
          onClick={() => setShowIncidentModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Signaler un incident
        </button>
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
      {showIncidentModal && (
        <IncidentModal onClose={() => setShowIncidentModal(false)} />
      )}

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="card border-l-4 border-l-eco-green">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-eco-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-eco-green" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-anthracite">
                  Notifications récentes
                </h2>
                <p className="text-sm text-gray-500">
                  {notifications.length} notification(s) non lue(s)
                </p>
              </div>
            </div>
            <Link
              to="/app/notifications"
              className="text-eco-green hover:underline text-sm font-medium flex items-center gap-1"
            >
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className="p-4 bg-eco-green bg-opacity-5 border border-eco-green border-opacity-20 rounded-lg hover:bg-opacity-10 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-eco-green mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-anthracite mb-1">
                      {notification.titre || 'Nouvelle notification'}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {notification.message || notification.contenu}
                    </p>
                    <p className="text-xs text-gray-500">
                      {notification.dateEnvoi || notification.dateCreation
                        ? new Date(notification.dateEnvoi || notification.dateCreation).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Date inconnue'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-anthracite">
            Tournées actives
          </h2>
          <Link
            to="/app/tours"
            className="text-eco-green hover:underline text-sm font-medium"
          >
            Voir tout
          </Link>
        </div>
        {/* Map of the first active tour */}
        {activeTour && (
          <div className="mb-4">
            <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
              <TourMap
                containers={activeTour.conteneurs || []}
                route={activeRoute}
                itineraire={activeTour.itineraire}
                center={getMapCenter()}
                zoom={13}
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Trajet de la tournée #{activeTour.id}
            </div>
          </div>
        )}
        
        {activeTours.length > 0 ? (
          <div className="space-y-3">
            {activeTours.slice(0, 3).map((tour) => (
              <Link
                key={tour.id}
                to={`/app/tours/${tour.id}`}
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

