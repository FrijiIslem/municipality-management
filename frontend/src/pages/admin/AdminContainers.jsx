import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { containerAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { Trash2, Plus, X, MapPin } from 'lucide-react'
import ContainerMap from '../../components/Map/ContainerMap'

const getFillStateColor = (etat) => {
  const colors = {
    VIDE: 'bg-green-100 text-green-800',
    FAIBLE: 'bg-yellow-100 text-yellow-800',
    MOYEN: 'bg-orange-100 text-orange-800',
    PLEIN: 'bg-red-100 text-red-800',
  }
  return colors[etat] || colors.VIDE
}

const getFillStateLabel = (etat) => {
  const labels = {
    VIDE: 'Vide',
    FAIBLE: 'Faible',
    MOYEN: 'Moyen',
    PLEIN: 'Plein',
  }
  return labels[etat] || 'Inconnu'
}

const AdminContainers = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const queryClient = useQueryClient()

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

  const handleMapClick = (position) => {
    setSelectedPosition(position)
  }

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
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un conteneur
        </button>
      </div>

      <div className="card">
        {containers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {containers.map((container) => (
              <div
                key={container.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-light-gray rounded-lg flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-anthracite" />
                    </div>
                    <div>
                      <p className="font-semibold text-anthracite">
                        Conteneur #{container.id?.substring(0, 8) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {container.localisation?.adresse || 'Adresse non disponible'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">État de remplissage</span>
                    <span className={`badge ${getFillStateColor(container.etatRemplissage)}`}>
                      {getFillStateLabel(container.etatRemplissage)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut couleur</span>
                    <span className="badge badge-info">
                      {container.couleurStatut || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          selectedPosition={selectedPosition}
          onMapClick={handleMapClick}
          onClose={() => {
            setShowModal(false)
            setSelectedPosition(null)
          }}
          onCreate={createMutation.mutate}
          isLoading={createMutation.isLoading}
        />
      )}
    </div>
  )
}

const AddContainerModal = ({ selectedPosition, onMapClick, onClose, onCreate, isLoading }) => {
  const [formData, setFormData] = useState({
    etatRemplissage: 'VIDE',
    couleurStatut: 'vert',
    adresse: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedPosition) {
      toast.error('Veuillez sélectionner un emplacement sur la carte')
      return
    }

    // Format localisation comme JSON string pour le backend
    // Le backend stocke comme String, mais on envoie un JSON pour que le frontend puisse le parser
    const localisationData = {
      latitude: selectedPosition.lat.toString(),
      longitude: selectedPosition.lng.toString(),
      adresse: formData.adresse || `Lat: ${selectedPosition.lat.toFixed(6)}, Lng: ${selectedPosition.lng.toFixed(6)}`,
    }

    const containerData = {
      localisation: JSON.stringify(localisationData), // Envoyer comme JSON string
      etatRemplissage: formData.etatRemplissage,
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
              containers={[]}
              onMapClick={onMapClick}
              selectedPosition={selectedPosition}
              selectedEtat={formData.etatRemplissage}
            />
          </div>

          {/* Form */}
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {selectedPosition && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Position sélectionnée</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Lat: {selectedPosition.lat.toFixed(6)}, Lng: {selectedPosition.lng.toFixed(6)}
                  </p>
                </div>
              )}

              {!selectedPosition && (
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
                  <option value="VIDE">Vide (Vert)</option>
                  <option value="FAIBLE">Faible (Jaune)</option>
                  <option value="MOYEN">Moyen (Orange)</option>
                  <option value="PLEIN">Plein (Rouge)</option>
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        formData.etatRemplissage === 'VIDE' ? '#4CAF50' :
                        formData.etatRemplissage === 'FAIBLE' ? '#FFEB3B' :
                        formData.etatRemplissage === 'MOYEN' ? '#FF9800' :
                        '#F44336'
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
                  disabled={!selectedPosition || isLoading}
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

