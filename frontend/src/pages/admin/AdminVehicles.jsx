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
                        {vehicle.marque || 'Véhicule'} {vehicle.modele || ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        {vehicle.immatriculation || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="badge badge-info">
                      {vehicle.type || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disponibilité</span>
                    <span className={`badge ${vehicle.disponible ? 'badge-success' : 'badge-danger'}`}>
                      {vehicle.disponible ? 'Disponible' : 'Indisponible'}
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
    marque: vehicle?.marque || '',
    modele: vehicle?.modele || '',
    immatriculation: vehicle?.immatriculation || '',
    type: vehicle?.type || '',
    disponible: vehicle?.disponible ?? true,
  })
  const queryClient = useQueryClient()

  const createMutation = useMutation(
    (data) => vehicleAPI.create(data),
    {
      onSuccess: () => {
        toast.success('Véhicule créé avec succès')
        queryClient.invalidateQueries('vehicles')
        onClose()
      },
      onError: () => toast.error('Erreur lors de la création')
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
              Marque
            </label>
            <input
              type="text"
              value={formData.marque}
              onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Modèle
            </label>
            <input
              type="text"
              value={formData.modele}
              onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Immatriculation
            </label>
            <input
              type="text"
              value={formData.immatriculation}
              onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Type
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
              placeholder="Ex: Camion, Benne, etc."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disponible"
              checked={formData.disponible}
              onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="disponible" className="text-sm font-medium text-anthracite">
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

