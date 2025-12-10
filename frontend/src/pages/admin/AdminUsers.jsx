import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { agentAPI, citoyenAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { UserPlus, Edit, Trash2, UserCheck, Users } from 'lucide-react'

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('agents')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const queryClient = useQueryClient()

  const { data: agents = [], isLoading: agentsLoading } = useQuery('agents', agentAPI.getAll)
  const { data: citoyens = [], isLoading: citoyensLoading } = useQuery('citoyens', citoyenAPI.getAll)

  const deleteAgentMutation = useMutation(
    (id) => agentAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Agent supprimé avec succès')
        queryClient.invalidateQueries('agents')
      },
      onError: () => toast.error('Erreur lors de la suppression')
    }
  )

  const deleteCitoyenMutation = useMutation(
    (id) => citoyenAPI.delete(id),
    {
      onSuccess: () => {
        toast.success('Citoyen supprimé avec succès')
        queryClient.invalidateQueries('citoyens')
      },
      onError: () => toast.error('Erreur lors de la suppression')
    }
  )

  const isLoading = activeTab === 'agents' ? agentsLoading : citoyensLoading
  const users = activeTab === 'agents' ? agents : citoyens

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600">Gérer les agents et citoyens</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null)
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter {activeTab === 'agents' ? 'un agent' : 'un citoyen'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('agents')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'agents'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-600 hover:text-anthracite'
          }`}
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Agents ({agents.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('citoyens')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'citoyens'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-600 hover:text-anthracite'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Citoyens ({citoyens.length})
          </div>
        </button>
      </div>

      {/* Users Table */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Téléphone</th>
                  {activeTab === 'agents' && (
                    <th className="text-left py-3 px-4 font-semibold text-anthracite">Tâche</th>
                  )}
                  <th className="text-left py-3 px-4 font-semibold text-anthracite">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-light-gray transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-anthracite">
                      {user.prenom} {user.nom}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.email}</td>
                    <td className="py-4 px-4 text-gray-600">{user.numeroTel || '-'}</td>
                    {activeTab === 'agents' && (
                      <td className="py-4 px-4 text-gray-600">{user.tache || '-'}</td>
                    )}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setShowModal(true)
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                              if (activeTab === 'agents') {
                                deleteAgentMutation.mutate(user.id)
                              } else {
                                deleteCitoyenMutation.mutate(user.id)
                              }
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun utilisateur</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          type={activeTab}
          onClose={() => {
            setShowModal(false)
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}

const UserModal = ({ user, type, onClose }) => {
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    numeroTel: user?.numeroTel || '',
    password: '',
    tache: user?.tache || '',
    adresse: user?.adresse || '',
  })
  const queryClient = useQueryClient()

  const createAgentMutation = useMutation(
    (data) => agentAPI.create(data),
    {
      onSuccess: () => {
        toast.success('Agent créé avec succès')
        queryClient.invalidateQueries('agents')
        onClose()
      },
      onError: (error) => {
        // Le message d'erreur est déjà extrait par l'intercepteur axios
        const errorMessage = error.message || 'Erreur lors de la création de l\'agent'
        toast.error(errorMessage)
      }
    }
  )

  const createCitoyenMutation = useMutation(
    (data) => citoyenAPI.create(data),
    {
      onSuccess: () => {
        toast.success('Citoyen créé avec succès')
        queryClient.invalidateQueries('citoyens')
        onClose()
      },
      onError: (error) => {
        // Le message d'erreur est déjà extrait par l'intercepteur axios
        const errorMessage = error.message || 'Erreur lors de la création du citoyen'
        toast.error(errorMessage)
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation des champs obligatoires
    if (!formData.nom || formData.nom.trim() === '') {
      toast.error('Le nom est obligatoire')
      return
    }
    if (!formData.prenom || formData.prenom.trim() === '') {
      toast.error('Le prénom est obligatoire')
      return
    }
    if (!formData.email || formData.email.trim() === '') {
      toast.error('L\'email est obligatoire')
      return
    }
    if (!formData.password || formData.password.trim() === '') {
      toast.error('Le mot de passe est obligatoire')
      return
    }
    
    // Nettoyer les données avant envoi
    const cleanedData = {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      email: formData.email.trim(),
      password: formData.password,
    }
    
    // Champs optionnels
    if (formData.numeroTel && formData.numeroTel.trim() !== '') {
      // Convertir en nombre si c'est une string
      cleanedData.numeroTel = isNaN(formData.numeroTel) 
        ? parseInt(formData.numeroTel) 
        : formData.numeroTel
    }
    
    if (type === 'agents') {
      // Tâche est obligatoire pour les agents
      if (!formData.tache || formData.tache === '') {
        toast.error('Veuillez sélectionner une tâche')
        return
      }
      cleanedData.tache = formData.tache
      
      if (formData.plageHoraire && formData.plageHoraire.trim() !== '') {
        cleanedData.plageHoraire = formData.plageHoraire.trim()
      }
      
      // Disponibilité par défaut à true
      cleanedData.disponibilite = formData.disponibilite !== undefined 
        ? formData.disponibilite 
        : true
    } else {
      if (formData.adresse && formData.adresse.trim() !== '') {
        cleanedData.adresse = formData.adresse.trim()
      }
    }
    
    // Log pour déboguer
    console.log('=== DEBUG: Données à envoyer ===', JSON.stringify(cleanedData, null, 2))
    
    if (type === 'agents') {
      createAgentMutation.mutate(cleanedData)
    } else {
      createCitoyenMutation.mutate(cleanedData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-heading font-bold text-anthracite mb-4">
          {user ? 'Modifier' : 'Ajouter'} {type === 'agents' ? 'un agent' : 'un citoyen'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Nom
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.numeroTel}
              onChange={(e) => setFormData({ ...formData, numeroTel: e.target.value })}
              className="input-field"
            />
          </div>
          {type === 'agents' && (
            <div>
              <label className="block text-sm font-medium text-anthracite mb-2">
                Tâche
              </label>
              <select
                value={formData.tache}
                onChange={(e) => setFormData({ ...formData, tache: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Sélectionner une tâche</option>
                <option value="CHAUFFEUR">Chauffeur</option>
                <option value="COLLECTE">Ramasseur (Collecte)</option>
              </select>
            </div>
          )}
          {type === 'citoyens' && (
            <div>
              <label className="block text-sm font-medium text-anthracite mb-2">
                Adresse
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="input-field"
              />
            </div>
          )}
          {!user && (
            <div>
              <label className="block text-sm font-medium text-anthracite mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={createAgentMutation.isLoading || createCitoyenMutation.isLoading}
            >
              {user ? 'Modifier' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminUsers

