import { useQuery, useMutation, useQueryClient } from 'react-query'
import { notificationAPI, tourAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import { toast } from 'react-hot-toast'
import { Bell, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const Notifications = () => {
  const queryClient = useQueryClient()
  const { role, user } = useAuthStore()
  const destination = role === 'CHAUFFEUR'
    ? 'chauffeur'
    : (role === 'RAMASSEUR' || role === 'AGENT_RAMSSEUR')
      ? 'ramasseur'
      : 'agent'

  const { data: notifications = [], isLoading } = useQuery(
    ['notifications', destination, user?.id || 'anon'],
    () => notificationAPI.getAllFor(destination),
    {
      select: (data) => {
        const list = Array.isArray(data) ? data : []
        if (!user?.id) return list
        return list.filter(n => (
          n?.userId === user.id ||
          n?.utilisateurId === user.id ||
          n?.agentId === user.id ||
          n?.destinataireId === user.id ||
          n?.citoyenId === user.id
        ))
      }
    }
  )

  // Fetch tours to identify those assigned to current agent (chauffeur/ramasseur)
  const { data: tours = [] } = useQuery('tours', tourAPI.getAll)

  // Additional scoping: for RAMASSEUR/CHAUFFEUR, only notifications tied to their tours
  const myTourIds = (() => {
    if (!Array.isArray(tours) || !user?.id) return []
    if (destination === 'chauffeur') {
      return tours
        .filter(t => t?.agentChauffeur?.id === user.id)
        .map(t => t.id)
    }
    if (destination === 'ramasseur') {
      return tours
        .filter(t => Array.isArray(t?.agentRamasseurs) && t.agentRamasseurs.some(a => a?.id === user.id))
        .map(t => t.id)
    }
    return []
  })()

  const scopedNotifications = (() => {
    if (!Array.isArray(notifications)) return []
    if (myTourIds.length === 0) return notifications
    const ids = new Set(myTourIds)
    return notifications.filter(n => {
      const msg = (n?.message || n?.contenu || '').toString()
      const tourId = n?.tourId || n?.tourneeId || null
      if (tourId && ids.has(tourId)) return true
      // Fallback: check if message mentions any of my tour ids (full or with '#')
      for (const id of ids) {
        if (msg.includes(id) || msg.includes(`#${id}`)) return true
      }
      return false
    })
  })()

  const markAsReadMutation = useMutation(
    (id) => notificationAPI.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications', destination])
        queryClient.invalidateQueries(['unreadNotifications', destination])
      },
    }
  )

  const markAllAsReadMutation = useMutation(
    () => notificationAPI.markAllAsRead(),
    {
      onSuccess: () => {
        toast.success('Toutes les notifications ont été marquées comme lues')
        queryClient.invalidateQueries(['notifications', destination])
        queryClient.invalidateQueries(['unreadNotifications', destination])
      },
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
      </div>
    )
  }

  const unreadNotifications = scopedNotifications.filter(n => !n.lu)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            {unreadNotifications.length} notification(s) non lue(s)
          </p>
        </div>
        
        {unreadNotifications.length > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isLoading}
            className="btn-outline flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="card">
        {scopedNotifications.length > 0 ? (
          <div className="space-y-3">
            {scopedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-all ${
                  notification.lu
                    ? 'border-gray-200 bg-white'
                    : 'border-eco-green bg-eco-green bg-opacity-5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.lu
                          ? 'bg-light-gray'
                          : 'bg-eco-green bg-opacity-10'
                      }`}
                    >
                      {notification.lu ? (
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Bell className="w-5 h-5 text-eco-green" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-anthracite mb-1">
                        {notification.titre || 'Notification'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message || notification.contenu}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {notification.dateCreation
                          ? format(
                              new Date(notification.dateCreation),
                              'dd MMM yyyy à HH:mm',
                              { locale: fr }
                            )
                          : 'Date inconnue'}
                      </div>
                    </div>
                  </div>
                  
                  {!notification.lu && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      className="ml-4 text-eco-green hover:text-eco-green hover:underline text-sm font-medium"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications

