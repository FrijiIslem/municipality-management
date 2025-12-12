import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { incidentAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

const IncidentModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    categorie: 'CONTENEUR',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const createMutation = useMutation(
    (data) => incidentAPI.create({
      ...data,
      utilisateurId: user?.id,
      statut: 'EN_ATTENTE',
    }),
    {
      onSuccess: () => {
        toast.success('Incident signalé avec succès')
        queryClient.invalidateQueries('incidents')
        onClose()
      },
      onError: () => toast.error('Erreur lors du signalement')
    }
  )

  const categorieOptions = [
    { value: 'RETARD', label: 'Retard de collecte' },
    { value: 'PANNE_VEHICULE', label: 'Panne de véhicule' },
    { value: 'CONTENEUR', label: 'Problème de conteneur' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      ...formData,
      date: new Date(formData.date),
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-heading font-bold text-anthracite mb-4">
          Signaler un incident
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Catégorie
            </label>
            <select
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              className="input-field"
              required
            >
              {categorieOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={4}
              placeholder="Décrivez le problème en détail..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? 'Envoi...' : 'Signaler'}
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

export default IncidentModal
