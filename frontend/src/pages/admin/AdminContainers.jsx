import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { containerAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { Trash2, Plus, X, MapPin } from 'lucide-react'
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
  }
  return labels[etatUpper] || 'Inconnu'
}

const AdminContainers = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [selectedContainer, setSelectedContainer] = useState(null)
  const queryClient = useQueryClient()
  const [mapView, setMapView] = useState(true) // Pour basculer entre la vue tableau et la vue carte

  const { data: containers = [], isLoading } = useQuery(
    'containers',
    containerAPI.getAll
  )

  const createMutation = useMutation(
    (data) => containerAPI.create(data),
    {
      onSuccess: () => {
        toast.success('Conteneur créé avec succès')
        queryClient.invalidateQueries('containers')
        setShowModal(false)
        setSelectedPosition(null)
      },
      onError: () => toast.error('Erreur lors de la création du conteneur')
    }
  )

  const deleteMutation = useMutation(
    (id) => containerAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Conteneur supprimé avec succès')
        queryClient.invalidateQueries('containers')
        setSelectedContainer(null)
        setSelectedPosition(null)
      },
      onError: (err) => toast.error(err?.message || 'Erreur lors de la suppression du conteneur')
    }
  )

  const handleMapClick = (position) => {
    setSelectedPosition(position)
  }

  const handleContainerClick = useCallback((container) => {
    setSelectedContainer(container)
    if (container?.localisation?.latitude && container?.localisation?.longitude) {
      setSelectedPosition({
        lat: parseFloat(container.localisation.latitude),
        lng: parseFloat(container.localisation.longitude)
      })
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Gestion des conteneurs
          </h1>
          <p className="text-gray-600">Gérer tous les conteneurs de collecte</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setMapView(!mapView)}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <MapPin className="mr-2 h-5 w-5" />
            {mapView ? 'Voir le tableau' : 'Voir la carte'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Ajouter un conteneur
          </button>
        </div>
      </div>

      <div className="card">
        {containers.length > 0 ? (
          !showModal && mapView ? (
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
                  <h3 className="text-lg font-medium text-gray-900">Détails du conteneur</h3>
                  <div className="mt-2">
                    <p><span className="font-medium">ID:</span> {selectedContainer.id}</p>
                    <p><span className="font-medium">Adresse:</span> {selectedContainer.localisation?.adresse || 'Non spécifiée'}</p>
                    <p>
                      <span className="font-medium">État:</span>{' '}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFillStateColor(selectedContainer.etatRemplissage)}`}>
                        {getFillStateLabel(selectedContainer.etatRemplissage)}
                      </span>
                    </p>
                    <p><span className="font-medium">Dernière mise à jour:</span> {new Date(selectedContainer.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          ) : !showModal ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {containers.map((container) => (
                      <tr 
                        key={container.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedContainer?.id === container.id ? 'bg-blue-50' : ''}`}
                        onClick={() => handleContainerClick(container)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {container.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {container.localisation?.adresse || 'Non spécifiée'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFillStateColor(container.etatRemplissage)}`}>
                            {getFillStateLabel(container.etatRemplissage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (window.confirm('Supprimer ce conteneur ?')) {
                                deleteMutation.mutate(container.id)
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null
        ) : (
          <div className="text-center py-12">
            <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun conteneur disponible</p>
          </div>
        )}
      </div>

      {/* Add Container Modal */}
      {showModal && (
        <AddContainerModal
          containers={containers} // Passer les conteneurs existants
          selectedPosition={selectedPosition}
          onMapClick={setSelectedPosition}
          onClose={() => {
            setShowModal(false)
            setSelectedPosition(null)
            setSelectedContainer(null)
          }}
          onCreate={(data) => {
            createMutation.mutate(data)
            setMapView(true) // Basculer vers la vue carte après la création
          }}
          isLoading={createMutation.isLoading}
        />
      )}
    </div>
  )
}

const AddContainerModal = ({ containers, selectedPosition, onMapClick, onClose, onCreate, isLoading }) => {
  const [formData, setFormData] = useState({
    etatRemplissage: 'vide',  // En minuscules pour correspondre à l'API
    couleurStatut: 'vert',
    adresse: '',
  })
  const [modalSelectedPosition, setModalSelectedPosition] = useState(null)

  // Utiliser une position locale pour le modal pour éviter les conflits
  const handleModalMapClick = (position) => {
    setModalSelectedPosition(position)
    if (onMapClick) {
      onMapClick(position)
    }
  }

  // Réinitialiser la position du modal quand il s'ouvre
  useEffect(() => {
    setModalSelectedPosition(selectedPosition)
  }, [selectedPosition])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const positionToUse = modalSelectedPosition || selectedPosition
    if (!positionToUse) {
      toast.error('Veuillez sélectionner un emplacement sur la carte')
      return
    }

    // S'assurer que l'état de remplissage est en minuscules
    const etatRemplissage = formData.etatRemplissage.toLowerCase()
    
    // Format localisation comme JSON string pour le backend
    const localisationData = {
      latitude: positionToUse.lat.toString(),
      longitude: positionToUse.lng.toString(),
      adresse: formData.adresse || `Lat: ${positionToUse.lat.toFixed(6)}, Lng: ${positionToUse.lng.toFixed(6)}`,
    }

    const containerData = {
      localisation: JSON.stringify(localisationData),
      etatRemplissage: etatRemplissage, // Utiliser la valeur en minuscules
      couleurStatut: formData.couleurStatut,
      dechets: [],
      citoyens: [],
    }

    onCreate(containerData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-heading font-bold text-anthracite">
              Ajouter un conteneur
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Cliquez sur la carte pour sélectionner l'emplacement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-gray rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Map */}
          <div className="flex-1 min-h-[400px]">
            <ContainerMap
              containers={containers}
              onMapClick={handleModalMapClick}
              selectedPosition={modalSelectedPosition || selectedPosition}
              selectedEtat={formData.etatRemplissage}
              bounds={TUNIS_BOUNDS}
              centerOverride={TUNIS_CENTER}
            />
          </div>

          {/* Form */}
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {(modalSelectedPosition || selectedPosition) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Position sélectionnée</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Lat: {(modalSelectedPosition || selectedPosition).lat.toFixed(6)}, Lng: {(modalSelectedPosition || selectedPosition).lng.toFixed(6)}
                  </p>
                </div>
              )}

              {!modalSelectedPosition && !selectedPosition && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Veuillez cliquer sur la carte pour sélectionner un emplacement
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-anthracite mb-2">
                  Adresse (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="input-field"
                  placeholder="Ex: Rue Habib Bourguiba, Tunis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-anthracite mb-2">
                  État de remplissage
                </label>
                <select
                  value={formData.etatRemplissage}
                  onChange={(e) => setFormData({ ...formData, etatRemplissage: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="vide">Vide (Vert)</option>
                  <option value="moyen">Moyen (Orange)</option>
                  <option value="saturee">Saturé (Rouge)</option>
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        formData.etatRemplissage === 'vide' ? '#4CAF50' :
                        formData.etatRemplissage === 'moyen' ? '#FF9800' :
                        '#F44336' // saturee
                    }}
                  />
                  <span className="text-xs text-gray-600">
                    La couleur sur la carte correspond à cet état
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-anthracite mb-2">
                  Statut couleur
                </label>
                <select
                  value={formData.couleurStatut}
                  onChange={(e) => setFormData({ ...formData, couleurStatut: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="vert">Vert</option>
                  <option value="orange">Orange</option>
                  <option value="rouge">Rouge</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={!modalSelectedPosition && !selectedPosition || isLoading}
                >
                  {isLoading ? 'Création...' : 'Créer le conteneur'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline flex-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminContainers

