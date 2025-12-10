import { useQuery } from 'react-query'
import { notificationAPI } from '../../services/api'
import { Bell, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const AdminNotifications = () => {
  const { data: notifications = [], isLoading } = useQuery(
    'notifications',
    notificationAPI.getAll
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
          Gestion des notifications
          </h1>
        <p className="text-gray-600">Toutes les notifications du système</p>
      </div>

      <div className="card">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-all ${
                  notification.lu
                    ? 'border-gray-200 bg-white'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.lu
                          ? 'bg-light-gray'
                          : 'bg-red-100'
                      }`}
                    >
                      {notification.lu ? (
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Bell className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-anthracite mb-1">
                        {notification.titre || 'Notification'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message || notification.contenu}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.dateCreation
                            ? format(
                                new Date(notification.dateCreation),
                                'dd MMM yyyy à HH:mm',
                                { locale: fr }
                              )
                            : 'Date inconnue'}
                        </div>
                        {notification.destination && (
                          <span>👤 {notification.destination}</span>
                        )}
                        {notification.type && (
                          <span className="badge badge-info">{notification.type}</span>
                        )}
                      </div>
                    </div>
                  </div>
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

export default AdminNotifications

