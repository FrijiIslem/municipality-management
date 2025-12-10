import { useQuery } from 'react-query'
import { containerAPI } from '../../services/api'
import { Trash2, MapPin, AlertCircle } from 'lucide-react'

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

const CitoyenContainers = () => {
  const { data: containers = [], isLoading } = useQuery(
    'containers',
    containerAPI.getAll
  )

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
        <p className="text-gray-600">Trouvez les conteneurs près de chez vous</p>
      </div>

      <div className="card">
        {containers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {containers.map((container) => (
              <div
                key={container.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-eco-green hover:shadow-card transition-all"
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
                      {container.localisation?.adresse && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 h-3" />
                          {container.localisation.adresse}
                        </div>
                      )}
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
                  
                  {container.etatRemplissage === 'PLEIN' && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      <AlertCircle className="w-4 h-4" />
                      <span>Conteneur plein - Collecte nécessaire</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut couleur</span>
                    <span className="badge badge-info">
                      {container.couleurStatut || 'N/A'}
                    </span>
                  </div>

                  {container.localisation && (
                    <div className="text-xs text-gray-500 mt-2">
                      📍 {container.localisation.latitude?.toFixed(4)}, {container.localisation.longitude?.toFixed(4)}
                    </div>
                  )}
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
    </div>
  )
}

export default CitoyenContainers

