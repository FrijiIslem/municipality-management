import { useQuery, useMutation, useQueryClient } from 'react-query'
import { tourAPI } from '../../services/api'
import { Link } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, Route, Plus, Eye, Zap, Loader } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'react-hot-toast'

const statusConfig = {
  PLANIFIEE: { label: 'Planifiée', icon: Clock, color: 'badge-info' },
  ACCEPTEE: { label: 'Acceptée', icon: CheckCircle, color: 'badge-warning' },
  EN_COURS: { label: 'En cours', icon: Route, color: 'badge-success' },
  TERMINEE: { label: 'Terminée', icon: CheckCircle, color: 'badge-success' },
  ANNULEE: { label: 'Annulée', icon: XCircle, color: 'badge-danger' },
}

const AdminTours = () => {
  const queryClient = useQueryClient()
  const { data: tours = [], isLoading } = useQuery('tours', tourAPI.getAll)

  const planifyMutation = useMutation(
    () => tourAPI.planifyAutomatic(),
    {
      onSuccess: (data) => {
        toast.success('Planification automatique réussie ! Une nouvelle tournée a été créée.')
        queryClient.invalidateQueries('tours')
        queryClient.invalidateQueries('notifications')
      },
      onError: (error) => {
        if (error?.isConnectionError) {
          toast.error(
            'Le backend n\'est pas accessible. Veuillez démarrer le serveur Spring Boot.\n\nCommande: cd projetJEE && mvnw spring-boot:run',
            { duration: 8000 }
          )
        } else {
          // Extraire le message d'erreur du backend
          const errorMessage = error?.response?.data?.message 
            || error?.response?.data?.error 
            || error?.message 
            || 'Erreur lors de la planification automatique'
          
          toast.error(
            `Erreur: ${errorMessage}\n\nVérifiez qu'il y a :\n- Des conteneurs à collecter (saturés ou moyens)\n- Un véhicule disponible\n- 2 agents collecteurs disponibles\n- 1 agent chauffeur disponible`,
            { duration: 10000 }
          )
        }
      }
    }
  )

  const validateMutation = useMutation(
    (id) => tourAPI.validate(id),
    {
      onSuccess: () => {
        toast.success('Tournée validée avec succès')
        queryClient.invalidateQueries('tours')
      },
      onError: (error) => {
        toast.error(error?.message || 'Erreur lors de la validation')
      }
    }
  )

  const handlePlanifyAutomatic = () => {
    if (window.confirm('Voulez-vous déclencher la planification automatique maintenant ?\n\nCela va :\n- Sélectionner un véhicule disponible\n- Sélectionner 2 agents collecteurs\n- Sélectionner 1 agent chauffeur\n- Calculer le chemin optimal\n- Créer une tournée')) {
      planifyMutation.mutate()
    }
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
            Gestion des tournées
          </h1>
          <p className="text-gray-600">Gérer toutes les tournées de collecte</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePlanifyAutomatic}
            disabled={planifyMutation.isLoading}
            className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {planifyMutation.isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Planification...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Planification automatique
              </>
            )}
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Créer une tournée
          </button>
        </div>
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
                  const isPlanified = tour.etat === 'PLANIFIEE'
                  
                  return (
                    <tr
                      key={tour.id}
                      className="border-b border-gray-100 hover:bg-light-gray transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-anthracite">
                        #{tour.id?.substring(0, 8) || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {tour.dateDebut
                          ? format(new Date(tour.dateDebut), 'dd MMM yyyy HH:mm', { locale: fr })
                          : '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {tour.vehicule?.matricule ? `Véhicule ${tour.vehicule.matricule}` : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {tour.conteneurs?.length || 0} conteneurs
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {tour.agentChauffeur?.nom || tour.agentChauffeur?.prenom || '-'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${status.color} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isPlanified && (
                            <button
                              onClick={() => validateMutation.mutate(tour.id)}
                              disabled={validateMutation.isLoading}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                              title="Valider la tournée"
                            >
                              Valider
                            </button>
                          )}
                          <Link
                            to={`/admin/tours/${tour.id}`}
                            aria-label="Voir détails"
                            className="text-red-500 hover:text-red-600 inline-flex"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                        </div>
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

