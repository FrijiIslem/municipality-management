import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI } from '../services/api'
import useAuthStore from '../store/authStore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.login(email, password)

      if (response && response.id) {
        // Le backend retourne maintenant les vraies données utilisateur
        const userData = {
          id: response.id,
          email: response.email,
          nom: response.nom,
          prenom: response.prenom,
          numeroTel: response.numeroTel,
          role: response.role || 'AGENT',
        }
        
        login(userData, null)
        toast.success(`Connexion réussie, bienvenue ${userData.prenom || userData.email}!`)
        
        // Navigate based on role
        if (userData.role === 'ADMIN') {
          navigate('/admin')
        } else if (userData.role === 'CITOYEN') {
          navigate('/citoyen')
        } else {
          navigate('/app')
        }
      } else {
        toast.error('Email ou mot de passe incorrect')
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Email ou mot de passe incorrect'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green via-mint-green to-urban-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-eco-green to-mint-green rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-heading font-bold text-3xl">U</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
              Urbanova
            </h1>
            <p className="text-gray-600">Connexion à votre espace agent</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-anthracite mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="agent@urbanova.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-anthracite mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

