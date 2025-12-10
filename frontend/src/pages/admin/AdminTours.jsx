import { useQuery } from 'react-query'
import { tourAPI } from '../../services/api'
import { Link } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, Route, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const statusConfig = {
  PLANIFIEE: { label: 'Planifiée', icon: Clock, color: 'badge-info' },
  ACCEPTEE: { label: 'Acceptée', icon: CheckCircle, color: 'badge-warning' },
  EN_COURS: { label: 'En cours', icon: Route, color: 'badge-success' },
  TERMINEE: { label: 'Terminée', icon: CheckCircle, color: 'badge-success' },
  ANNULEE: { label: 'Annulée', icon: XCircle, color: 'badge-danger' },
}

const AdminTours = () => {
  const { data: tours = [], isLoading } = useQuery('tours', tourAPI.getAll)

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
            Gestion des tournées
          </h1>
          <p className="text-gray-600">Gérer toutes les tournées de collecte</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Créer une tournée
        </button>
      </div>

      <div className="card">
        {tours.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Zone</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Conteneurs</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Chauffeur</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => {
                  const status = statusConfig[tour.etat] || statusConfig.PLANIFIEE
                  const StatusIcon = status.icon
                  
                  return (
                    <tr
                      key={tour.id}
                      className="border-b border-gray-100 hover:bg-light-gray transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-anthracite">
                        #{tour.id}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {tour.dateDebut
                          ? format(new Date(tour.dateDebut), 'dd MMM yyyy HH:mm', { locale: fr })
                          : '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        Zone {tour.zone || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {tour.conteneurs?.length || 0}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {tour.agentChauffeur?.nom || '-'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${status.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          to={`/admin/tours/${tour.id}`}
                          className="text-red-500 hover:underline font-medium text-sm"
                        >
                          Voir détails
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune tournée disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTours

