import { useQuery } from 'react-query'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { tourAPI } from '../services/api'

/**
 * Composant qui vérifie la connexion au backend et affiche une alerte si nécessaire
 */
const BackendConnectionAlert = () => {
  const [dismissed, setDismissed] = useState(false)
  
  const { isError, error } = useQuery(
    'backend-health-check',
    () => tourAPI.getAll(),
    {
      retry: false,
      refetchInterval: 30000, // Vérifier toutes les 30 secondes
      enabled: !dismissed,
    }
  )

  if (dismissed || !isError || !error?.isConnectionError) {
    return null
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Backend non accessible
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p className="mb-2">
              Le serveur backend Spring Boot n'est pas démarré ou n'est pas accessible sur le port 9090.
            </p>
            <div className="bg-white p-3 rounded border border-red-200">
              <p className="font-semibold mb-1">Pour démarrer le backend :</p>
              <code className="text-xs block bg-gray-100 p-2 rounded">
                cd projetJEE<br />
                .\mvnw.cmd spring-boot:run
              </code>
              <p className="text-xs mt-2 text-gray-600">
                Consultez <code>BACKEND_START.md</code> pour plus de détails.
              </p>
            </div>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setDismissed(true)}
            className="text-red-400 hover:text-red-600"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BackendConnectionAlert

