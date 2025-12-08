import { useMutation, useQueryClient } from 'react-query'
import { containerAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { Trash2, CheckCircle } from 'lucide-react'

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

const ContainerList = ({ containers = [], tourId, isActive = false }) => {
  const queryClient = useQueryClient()

  const markEmptyMutation = useMutation(
    (containerId) => containerAPI.markEmpty(containerId),
    {
      onSuccess: () => {
        toast.success('Conteneur marqué comme vide')
        queryClient.invalidateQueries(['tour', tourId])
        queryClient.invalidateQueries('containers')
      },
      onError: () => {
        toast.error('Erreur lors de la mise à jour')
      },
    }
  )

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-heading font-semibold text-anthracite mb-1">
          Conteneurs ({containers.length})
        </h2>
        <p className="text-sm text-gray-600">
          Liste des conteneurs de la tournée
        </p>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {containers.length > 0 ? (
          containers.map((container) => (
            <div
              key={container.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-eco-green transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-light-gray rounded-lg flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-anthracite" />
                  </div>
                  <div>
                    <p className="font-medium text-anthracite">
                      Conteneur #{container.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {container.localisation?.adresse || 'Adresse non disponible'}
                    </p>
                  </div>
                </div>
                <span className={`badge ${getFillStateColor(container.etatRemplissage)}`}>
                  {getFillStateLabel(container.etatRemplissage)}
                </span>
              </div>

              {isActive && container.etatRemplissage !== 'VIDE' && (
                <button
                  onClick={() => markEmptyMutation.mutate(container.id)}
                  disabled={markEmptyMutation.isLoading}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-eco-green bg-opacity-10 text-eco-green rounded-lg hover:bg-opacity-20 transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Marquer comme vide
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Aucun conteneur</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContainerList

