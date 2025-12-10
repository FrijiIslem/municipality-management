import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { incidentAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { AlertTriangle, Filter, Search } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const AdminIncidents = () => {
  const [filterStatut, setFilterStatut] = useState('all')
  const [filterCategorie, setFilterCategorie] = useState('all')
  const queryClient = useQueryClient()

  const { data: incidents = [], isLoading } = useQuery('incidents', incidentAPI.getAll)

  const filteredIncidents = incidents.filter(incident => {
    if (filterStatut !== 'all' && incident.statut !== filterStatut) return false
    if (filterCategorie !== 'all' && incident.categorie !== filterCategorie) return false
    return true
  })

  const statutConfig = {
    EN_ATTENTE: { label: 'En attente', color: 'badge-warning' },
    SEEN: { label: 'Vu', color: 'badge-info' },
    FIXEE: { label: 'Résolu', color: 'badge-success' },
  }

  const categorieConfig = {
    RETARD: { label: 'Retard', icon: '⏰' },
    PANNE_VEHICULE: { label: 'Panne véhicule', icon: '🚛' },
    CONTENEUR: { label: 'Conteneur', icon: '🗑️' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Gestion des incidents
          </h1>
          <p className="text-gray-600">Suivi et gestion des incidents signalés</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-anthracite">Filtres:</span>
          </div>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="SEEN">Vu</option>
            <option value="FIXEE">Résolu</option>
          </select>
          <select
            value={filterCategorie}
            onChange={(e) => setFilterCategorie(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">Toutes les catégories</option>
            <option value="RETARD">Retard</option>
            <option value="PANNE_VEHICULE">Panne véhicule</option>
            <option value="CONTENEUR">Conteneur</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : filteredIncidents.length > 0 ? (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => {
              const statut = statutConfig[incident.statut] || statutConfig.EN_ATTENTE
              const categorie = categorieConfig[incident.categorie] || { label: 'Autre', icon: '📋' }
              
              return (
                <div
                  key={incident.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-card transition-all"
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
                          <span className={`badge ${statut.color}`}>
                            {statut.label}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {incident.description || 'Aucune description'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            📅 {incident.date
                              ? format(new Date(incident.date), 'dd MMM yyyy à HH:mm', { locale: fr })
                              : 'Date inconnue'}
                          </span>
                          {incident.utilisateurId && (
                            <span>👤 ID: {incident.utilisateurId.substring(0, 8)}...</span>
                          )}
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
            <p className="text-gray-500">Aucun incident trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminIncidents

