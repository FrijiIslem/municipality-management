import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { citoyenAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { User, Edit, Save, X } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const CitoyenProfile = () => {
  const { user, setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    numeroTel: user?.numeroTel || '',
    adresse: user?.adresse || '',
    password: '',
    ancienPassword: '',
  })
  const queryClient = useQueryClient()

  const updateMutation = useMutation(
    ({ ancienPassword, data }) => citoyenAPI.update(ancienPassword, data),
    {
      onSuccess: (updatedUser) => {
        toast.success('Profil mis à jour avec succès')
        setUser(updatedUser)
        setIsEditing(false)
        queryClient.invalidateQueries('citoyens')
      },
      onError: () => toast.error('Erreur lors de la mise à jour')
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.ancienPassword && formData.password) {
      toast.error('Veuillez entrer votre ancien mot de passe pour changer le mot de passe')
      return
    }
    updateMutation.mutate({
      ancienPassword: formData.ancienPassword,
      data: {
        id: user?.id,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        numeroTel: formData.numeroTel,
        adresse: formData.adresse,
        password: formData.password || undefined,
      },
    })
  }

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      numeroTel: user?.numeroTel || '',
      adresse: user?.adresse || '',
      password: '',
      ancienPassword: '',
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Mon profil
          </h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
        )}
      </div>

      <div className="card max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-eco-green rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-anthracite">
              {user?.prenom || ''} {user?.nom || ''}
            </h2>
            <p className="text-gray-600">{user?.email || ''}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-anthracite mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="input-field"
                disabled={!isEditing}
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
                disabled={!isEditing}
                required
              />
            </div>
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
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-anthracite mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="input-field"
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-anthracite mb-3">
                  Changer le mot de passe
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-anthracite mb-2">
                      Ancien mot de passe
                    </label>
                    <input
                      type="password"
                      value={formData.ancienPassword}
                      onChange={(e) => setFormData({ ...formData, ancienPassword: e.target.value })}
                      className="input-field"
                      placeholder="Laissez vide si vous ne changez pas le mot de passe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-anthracite mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field"
                      placeholder="Laissez vide si vous ne changez pas le mot de passe"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={updateMutation.isLoading}
                >
                  <Save className="w-4 h-4" />
                  {updateMutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline flex-1 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default CitoyenProfile

