import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { containerAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { Trash2, CheckCircle } from 'lucide-react'

const getFillStateColor = (etat) => {
  if (!etat) return 'bg-green-100 text-green-800';
  const key = etat.toLowerCase();
  const colors = {
    vide: 'bg-green-100 text-green-800',
    VIDE: 'bg-green-100 text-green-800',
    faible: 'bg-yellow-100 text-yellow-800',
    FAIBLE: 'bg-yellow-100 text-yellow-800',
    moyen: 'bg-orange-100 text-orange-800',
    MOYEN: 'bg-orange-100 text-orange-800',
    saturee: 'bg-red-100 text-red-800',
    SATUREE: 'bg-red-100 text-red-800',
    PLEIN: 'bg-red-100 text-red-800',
  }
  return colors[key] || colors[etat] || colors.vide
}

const getFillStateLabel = (etat) => {
  if (!etat) return 'Vide';
  const key = etat.toLowerCase();
  const labels = {
    vide: 'Vide',
    VIDE: 'Vide',
    faible: 'Faible',
    FAIBLE: 'Faible',
    moyen: 'Moyen',
    MOYEN: 'Moyen',
    saturee: 'Saturé',
    SATUREE: 'Saturé',
    PLEIN: 'Plein',
  }
  return labels[key] || labels[etat] || 'Inconnu'
}

const getFillStateIcon = (etat) => {
  if (!etat) return '🗑️';
  const key = etat.toLowerCase();
  const icons = {
    vide: '🗑️',
    VIDE: '🗑️',
    faible: '⚠️',
    FAIBLE: '⚠️',
    moyen: '🟠',
    MOYEN: '🟠',
    saturee: '🔴',
    SATUREE: '🔴',
    PLEIN: '🔴',
  }
  return icons[key] || icons[etat] || '🗑️'
}

const ContainerList = ({ containers = [], tourId, isActive = false, tourState = null }) => {
  const queryClient = useQueryClient()
  // État local pour gérer les conteneurs vidés (retirés de la liste)
  const [emptiedContainers, setEmptiedContainers] = useState(new Set())

  // Filtrer les conteneurs vides et ceux déjà vidés
  const visibleContainers = containers.filter(container => {
    if (!container) return false
    // Retirer les conteneurs déjà vidés
    if (emptiedContainers.has(container.id)) return false
    // Retirer les conteneurs déjà vides
    const etat = container?.etatRemplissage?.toLowerCase()
    return etat !== 'vide' && etat !== 'VIDE'
  })

  // Vérifier que la tournée est en cours (EN_COURS ou ENCOURS)
  const canEmptyContainers = isActive && (tourState === 'EN_COURS' || tourState === 'ENCOURS')

  const markEmptyMutation = useMutation(
    (containerId) => containerAPI.markEmpty(containerId),
    {
      onSuccess: (updatedContainer, containerId) => {
        toast.success('Conteneur marqué comme vide')
        // Ajouter le conteneur à la liste des conteneurs vidés pour le retirer immédiatement
        setEmptiedContainers(prev => new Set([...prev, containerId]))
        
        // Mettre à jour immédiatement les données de la tournée pour synchroniser la carte
        queryClient.setQueryData(['tour', tourId], (oldTour) => {
          if (!oldTour || !oldTour.conteneurs) return oldTour
          // Retirer le conteneur vidé de la liste ou le marquer comme vide
          const updatedContainers = oldTour.conteneurs
            .map(c => c.id === containerId ? updatedContainer : c)
            .filter(c => {
              // Retirer les conteneurs vides
              const etat = c?.etatRemplissage?.toLowerCase()
              return etat !== 'vide' && etat !== 'VIDE'
            })
          return {
            ...oldTour,
            conteneurs: updatedContainers
          }
        })
        
        // Invalider toutes les requêtes liées pour mettre à jour les autres vues
        queryClient.invalidateQueries(['tour', tourId])
        queryClient.invalidateQueries(['tour-route', tourId])
        queryClient.invalidateQueries('containers')
        queryClient.invalidateQueries('tours')
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
          Conteneurs ({visibleContainers.length})
        </h2>
        <p className="text-sm text-gray-600">
          {canEmptyContainers 
            ? 'Liste des conteneurs à vider' 
            : 'Liste des conteneurs de la tournée'}
        </p>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {visibleContainers.length > 0 ? (
          visibleContainers.map((container) => {
            if (!container) return null

            return (
              <div
                key={container.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-eco-green transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl">
                      {getFillStateIcon(container?.etatRemplissage)}
                    </div>
                    <div>
                      <p className="font-medium text-anthracite">
                        Conteneur #{container.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {container?.localisation?.adresse || 
                         (typeof container?.localisation === 'string' 
                           ? JSON.parse(container.localisation)?.adresse || 'Adresse non disponible'
                           : 'Adresse non disponible')}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`badge ${getFillStateColor(container?.etatRemplissage)} flex items-center gap-1`}
                  >
                    {getFillStateIcon(container?.etatRemplissage)}
                    {getFillStateLabel(container?.etatRemplissage)}
                  </span>
                </div>

                {canEmptyContainers && container?.etatRemplissage && 
                 container.etatRemplissage.toLowerCase() !== 'vide' && 
                 container.etatRemplissage !== 'VIDE' && (
                  <button
                    onClick={() =>
                      container?.id && markEmptyMutation.mutate(container.id)
                    }
                    disabled={markEmptyMutation.isLoading}
                    className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 
                    bg-eco-green bg-opacity-10 text-eco-green rounded-lg 
                    ${
                      markEmptyMutation.isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-opacity-20'
                    } transition-colors text-sm font-medium`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marquer comme vide
                  </button>
                )}
                {!canEmptyContainers && container?.etatRemplissage && 
                 container.etatRemplissage.toLowerCase() !== 'vide' && 
                 container.etatRemplissage !== 'VIDE' && (
                  <div className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm text-center">
                    Démarrez la tournée pour vider les conteneurs
                  </div>
                )}
              </div>
            )
          })
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
