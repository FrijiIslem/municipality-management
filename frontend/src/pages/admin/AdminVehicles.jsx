import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { vehicleAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { Truck, Plus, Edit, Trash2 } from 'lucide-react'

const AdminVehicles = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const queryClient = useQueryClient()

  const { data: vehicles = [], isLoading } = useQuery('vehicles', vehicleAPI.getAll)

  const deleteMutation = useMutation(
    (id) => vehicleAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Véhicule supprimé avec succès')
        queryClient.invalidateQueries('vehicles')
      },
      onError: () => toast.error('Erreur lors de la suppression')
    }
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Gestion des véhicules
          </h1>
          <p className="text-gray-600">Gérer la flotte de véhicules</p>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null)
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un véhicule
        </button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-anthracite">
                        Véhicule #{vehicle.matricule || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Capacité: {vehicle.capaciteMax ? `${vehicle.capaciteMax} kg` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Matricule</span>
                    <span className="badge badge-info">
                      {vehicle.matricule || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disponibilité</span>
                    <span className={`badge ${vehicle.disponibilite ? 'badge-success' : 'badge-danger'}`}>
                      {vehicle.disponibilite ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle)
                      setShowModal(true)
                    }}
                    className="flex-1 btn-outline flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
                        deleteMutation.mutate(vehicle.id)
                      }
                    }}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun véhicule</p>
          </div>
        )}
      </div>

      {showModal && (
        <VehicleModal
          vehicle={editingVehicle}
          onClose={() => {
            setShowModal(false)
            setEditingVehicle(null)
          }}
        />
      )}
    </div>
  )
}

const VehicleModal = ({ vehicle, onClose }) => {
  const [formData, setFormData] = useState({
    matricule: vehicle?.matricule || '',
    capaciteMax: vehicle?.capaciteMax || '',
    disponibilite: vehicle?.disponibilite ?? true,
  })
  const queryClient = useQueryClient()

  const createMutation = useMutation(
    (data) => {
      console.log('=== DEBUG: Données envoyées au backend ===', JSON.stringify(data, null, 2))
      return vehicleAPI.create(data)
    },
    {
      onSuccess: (response) => {
        console.log('=== DEBUG: Réponse du backend ===', response)
        toast.success('Véhicule créé avec succès')
        queryClient.invalidateQueries('vehicles')
        onClose()
      },
      onError: (error) => {
        console.error('=== ERREUR lors de la création ===', error)
        const errorMessage = error?.response?.data?.message 
          || error?.response?.data?.error 
          || error?.message 
          || 'Erreur lors de la création du véhicule'
        toast.error(`Erreur: ${errorMessage}`)
      }
    }
  )

  const updateMutation = useMutation(
    (data) => vehicleAPI.update(vehicle.id, data),
    {
      onSuccess: () => {
        toast.success('Véhicule modifié avec succès')
        queryClient.invalidateQueries('vehicles')
        onClose()
      },
      onError: () => toast.error('Erreur lors de la modification')
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (vehicle) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-heading font-bold text-anthracite mb-4">
          {vehicle ? 'Modifier' : 'Ajouter'} un véhicule
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Matricule *
            </label>
            <input
              type="number"
              value={formData.matricule}
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value ? parseInt(e.target.value) : '' })}
              className="input-field"
              placeholder="Ex: 123456"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Capacité maximale (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.capaciteMax}
              onChange={(e) => setFormData({ ...formData, capaciteMax: e.target.value ? parseFloat(e.target.value) : '' })}
              className="input-field"
              placeholder="Ex: 5000"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disponibilite"
              checked={formData.disponibilite}
              onChange={(e) => setFormData({ ...formData, disponibilite: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="disponibilite" className="text-sm font-medium text-anthracite">
              Disponible
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {vehicle ? 'Modifier' : 'Créer'}
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
  )
}

export default AdminVehicles

