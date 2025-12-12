import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { incidentAPI } from '../../services/api'
import { AlertTriangle, Plus, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import useAuthStore from '../../store/authStore'
import IncidentModal from '../../components/Incident/IncidentModal'

const CitoyenIncidents = () => {
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: allIncidents = [] } = useQuery('incidents', incidentAPI.getAll)
  const myIncidents = allIncidents.filter(i => i.utilisateurId === user?.id)

  const statutConfig = {
    EN_ATTENTE: { label: 'En attente', icon: Clock, color: 'badge-warning' },
    SEEN: { label: 'Vu', icon: CheckCircle, color: 'badge-info' },
    FIXEE: { label: 'Résolu', icon: CheckCircle, color: 'badge-success' },
  }

  const categorieOptions = [
    { value: 'RETARD', label: 'Retard de collecte', icon: '⏰' },
    { value: 'PANNE_VEHICULE', label: 'Panne de véhicule', icon: '🚛' },
    { value: 'CONTENEUR', label: 'Problème de conteneur', icon: '🗑️' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Mes incidents
          </h1>
          <p className="text-gray-600">Signalez et suivez vos incidents</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Signaler un incident
        </button>
      </div>

      <div className="card">
        {myIncidents.length > 0 ? (
          <div className="space-y-4">
            {myIncidents.map((incident) => {
              const statut = statutConfig[incident.statut] || statutConfig.EN_ATTENTE
              const StatutIcon = statut.icon
              const categorie = categorieOptions.find(c => c.value === incident.categorie) || categorieOptions[0]
              
              return (
                <div
                  key={incident.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-card transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                        {categorie.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-anthracite">
                            {categorie.label}
                          </h3>
                          <span className={`badge ${statut.color} flex items-center gap-1`}>
                            <StatutIcon className="w-3 h-3" />
                            {statut.label}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {incident.description || 'Aucune description'}
                        </p>
                        <div className="text-sm text-gray-500">
                          📅 {incident.date
                            ? format(new Date(incident.date), 'dd MMM yyyy à HH:mm', { locale: fr })
                            : 'Date inconnue'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Vous n'avez signalé aucun incident</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Signaler un incident
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <IncidentModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}


export default CitoyenIncidents

