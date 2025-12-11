import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { tourAPI } from '../services/api'
import { toast } from 'react-hot-toast'
import { Play, CheckCircle, MapPin, Users, Calendar } from 'lucide-react'
import TourMap from '../components/Map/TourMap'
import ContainerList from '../components/Tour/ContainerList'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const TUNIS_BOUNDS = [[36.6925111, 10.0037899], [36.9430196, 10.3548094]]

const TourDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: tour, isLoading } = useQuery(
    ['tour', id],
    () => tourAPI.getById(id),
    { enabled: !!id }
  )

  const { data: route = [], error: routeError, isLoading: routeLoading } = useQuery(
    ['tour-route', id],
    () => tourAPI.getOptimalRoute(id),
    { 
      enabled: !!id && !!tour, // Toujours récupérer la route si la tournée existe
      retry: 1, // Ne réessayer qu'une fois
      onError: (error) => {
        console.warn('Erreur lors de la récupération de la route détaillée:', error);
        // Ne pas afficher d'erreur à l'utilisateur, on utilisera l'itinéraire de fallback
      }
    }
  )

  const startMutation = useMutation(
    () => tourAPI.start(id),
    {
      onSuccess: () => {
        toast.success('Tournée démarrée avec succès')
        queryClient.invalidateQueries(['tour', id])
        queryClient.invalidateQueries(['tour-route', id])
        queryClient.invalidateQueries('tours')
      },
      onError: (error) => {
        const message = error?.response?.data?.message || error?.message || 'Erreur lors du démarrage de la tournée'
        toast.error(message)
      },
    }
  )

  const completeMutation = useMutation(
    () => tourAPI.complete(id),
    {
      onSuccess: () => {
        toast.success('Tournée terminée avec succès. Les ressources ont été libérées.')
        queryClient.invalidateQueries(['tour', id])
        queryClient.invalidateQueries('tours')
        navigate('/tours')
      },
      onError: (error) => {
        const message = error?.response?.data?.message || error?.message || 'Erreur lors de la finalisation de la tournée'
        toast.error(message)
      },
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tournée introuvable</p>
      </div>
    )
  }

  const canStart = tour.etat === 'VALIDEE' || tour.etat === 'ACCEPTEE'
  const canComplete = tour.etat === 'EN_COURS' || tour.etat === 'ENCOURS'
  const isActive = tour.etat === 'EN_COURS' || tour.etat === 'ENCOURS'

  // Calculer le centre de la carte depuis les conteneurs ou utiliser Tunis par défaut
  const getMapCenter = () => {
    const TUNIS_CENTER = [36.8065, 10.1815] // [lat, lng] format pour Leaflet
    
    if (!tour.conteneurs || tour.conteneurs.length === 0) {
      return TUNIS_CENTER
    }
    
    // Essayer de parser la localisation du premier conteneur
    try {
      const firstContainer = tour.conteneurs[0]
      let lat, lng
      
      if (firstContainer?.localisation) {
        if (typeof firstContainer.localisation === 'string') {
          const loc = JSON.parse(firstContainer.localisation)
          lat = parseFloat(loc.latitude || loc.lat)
          lng = parseFloat(loc.longitude || loc.lng)
        } else if (typeof firstContainer.localisation === 'object') {
          lat = parseFloat(firstContainer.localisation.latitude || firstContainer.localisation.lat)
          lng = parseFloat(firstContainer.localisation.longitude || firstContainer.localisation.lng)
        }
        
        if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
          return [lat, lng]
        }
      }
    } catch (e) {
      console.warn('Erreur lors du parsing de la localisation:', e)
    }
    
    return TUNIS_CENTER
  }
  
  const mapCenter = getMapCenter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Tournée #{tour.id}
          </h1>
          <p className="text-gray-600">Détails de la tournée de collecte</p>
        </div>
        
        <div className="flex gap-3">
          {canStart && (
            <button
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Démarrer la tournée
            </button>
          )}
          {canComplete && (
            <button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isLoading}
              className="btn-secondary flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Terminer la tournée
            </button>
          )}
        </div>
      </div>

      {/* Tour Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-urban-blue bg-opacity-10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-urban-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Date de début</p>
              <p className="font-semibold text-anthracite">
                {tour.dateDebut
                  ? format(new Date(tour.dateDebut), 'dd MMM yyyy HH:mm', { locale: fr })
                  : 'Non définie'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-mint-green bg-opacity-10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-mint-green" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Zone</p>
              <p className="font-semibold text-anthracite">
                Zone {tour.zone || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-eco-green bg-opacity-10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-eco-green" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Équipe</p>
              <p className="font-semibold text-anthracite">
                {tour.agentRamasseurs?.length || 0} ramasseur(s)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map and Container List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-heading font-semibold text-anthracite">
                Carte de la tournée
              </h2>
            </div>
            <div className="h-[600px]">
              <TourMap
                containers={tour.conteneurs || []}
                route={route}
                itineraire={tour.itineraire} // Passer l'itinéraire JSON optimisé
                center={mapCenter}
                zoom={13}
                bounds={TUNIS_BOUNDS}
              />
            </div>
          </div>
        </div>

        <div>
          <ContainerList
            containers={tour.conteneurs || []}
            tourId={tour.id}
            isActive={isActive}
          />
        </div>
      </div>
    </div>
  )
}

export default TourDetail

