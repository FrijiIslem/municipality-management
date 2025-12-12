import { useState, useCallback } from 'react'
import { useQuery } from 'react-query'
import { containerAPI } from '../../services/api'
import { Trash2, MapPin, AlertCircle } from 'lucide-react'
import ContainerMap from '../../components/Map/ContainerMap'

const TUNIS_CENTER = [36.8002068, 10.1857757]
const TUNIS_BOUNDS = [[36.6925111, 10.0037899], [36.9430196, 10.3548094]]

const getFillStateColor = (etat) => {
  // Convertir en majuscules pour la rétrocompatibilité
  const etatUpper = etat?.toUpperCase()
  const colors = {
    VIDE: 'bg-green-100 text-green-800',
    SATUREE: 'bg-red-100 text-red-800',
    MOYEN: 'bg-orange-100 text-orange-800',
    PLEIN: 'bg-red-100 text-red-800',
    FAIBLE: 'bg-yellow-100 text-yellow-800',
  }
  return colors[etatUpper] || colors.VIDE
}

const getFillStateLabel = (etat) => {
  // Convertir en majuscules pour la rétrocompatibilité
  const etatUpper = etat?.toUpperCase()
  const labels = {
    VIDE: 'Vide',
    SATUREE: 'Saturé',
    MOYEN: 'Moyen',
    PLEIN: 'Plein',
    FAIBLE: 'Faible',
  }
  return labels[etatUpper] || 'Inconnu'
}

const CitoyenContainers = () => {
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [selectedPosition, setSelectedPosition] = useState(null)

  const { data: containers = [], isLoading } = useQuery(
    'containers',
    containerAPI.getAll
  )

  const handleContainerClick = useCallback((container) => {
    setSelectedContainer(container)
    if (container?.localisation?.latitude && container?.localisation?.longitude) {
      setSelectedPosition({
        lat: parseFloat(container.localisation.latitude),
        lng: parseFloat(container.localisation.longitude)
      })
    } else {
      // Essayer de parser depuis localisation string
      try {
        const loc = typeof container.localisation === 'string' 
          ? JSON.parse(container.localisation) 
          : container.localisation
        if (loc?.latitude && loc?.longitude) {
          setSelectedPosition({
            lat: parseFloat(loc.latitude),
            lng: parseFloat(loc.longitude)
          })
        }
      } catch (e) {
        console.warn('Impossible de parser la localisation:', e)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
          Conteneurs de collecte
        </h1>
        <p className="text-gray-600">Trouvez les conteneurs près de chez vous sur la carte</p>
      </div>

      <div className="card">
        {containers.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
            <ContainerMap 
              containers={containers}
              onMapClick={setSelectedPosition}
              selectedPosition={selectedPosition}
              selectedContainer={selectedContainer}
              onContainerClick={handleContainerClick}
              bounds={TUNIS_BOUNDS}
              centerOverride={TUNIS_CENTER}
            />
            {selectedContainer && (
              <div className="bg-white p-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Détails du conteneur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ID</p>
                    <p className="font-medium text-anthracite">{selectedContainer.id?.substring(0, 8) || selectedContainer.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-anthracite">
                        {selectedContainer.localisation?.adresse || 
                         (typeof selectedContainer.localisation === 'string' 
                           ? JSON.parse(selectedContainer.localisation)?.adresse 
                           : 'Non spécifiée') || 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">État de remplissage</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFillStateColor(selectedContainer.etatRemplissage)}`}>
                      {getFillStateLabel(selectedContainer.etatRemplissage)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut couleur</p>
                    <span className="badge badge-info">
                      {selectedContainer.couleurStatut || 'N/A'}
                    </span>
                  </div>
                  {(selectedContainer.etatRemplissage === 'PLEIN' || selectedContainer.etatRemplissage === 'SATUREE') && (
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Conteneur plein - Collecte nécessaire</span>
                      </div>
                    </div>
                  )}
                  {selectedContainer.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Dernière mise à jour</p>
                      <p className="font-medium text-anthracite">
                        {new Date(selectedContainer.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun conteneur disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CitoyenContainers

