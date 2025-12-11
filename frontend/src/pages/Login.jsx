import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import PublicHeader from '../components/Layout/PublicHeader'

const Login = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.login(formData.email, formData.password)
      if (response) {
        const userData = {
          id: response.id,
          email: response.email,
          nom: response.nom,
          prenom: response.prenom,
          numeroTel: response.numeroTel,
          role: response.role || 'AGENT',
        }
        loginStore(userData, null)

        const role = userData.role
        if (role === 'ADMIN') {
          navigate('/admin')
        } else if (role === 'AGENT') {
          navigate('/app')
        } else if (role === 'CITOYEN') {
          navigate('/citoyen')
        } else {
          navigate('/app')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      toast.error(error.response?.data?.message || 'Connexion échouée. Veuillez vérifier vos identifiants.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <PublicHeader />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(126,214,88,0.25),_transparent_55%)]" />
        <div className="absolute -top-12 right-16 h-72 w-72 rounded-full bg-eco-green/25 blur-3xl" />
        <div className="absolute top-24 left-12 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-xl shadow-2xl">
              <div className="mb-10 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                  Connexion
                </span>
                <h1 className="mt-6 text-3xl font-semibold text-white">
                  Heureux de vous revoir sur Urbanova
                </h1>
                <p className="mt-3 text-sm text-slate-200/80">
                  Reprenez votre exploration des quartiers et coordonnez les actions en toute fluidité.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-200">Adresse email</label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 shadow-inner focus:border-eco-green focus:outline-none focus:ring-2 focus:ring-eco-green/60"
                        placeholder="prenom.nom@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-200">Mot de passe</label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 shadow-inner focus:border-eco-green focus:outline-none focus:ring-2 focus:ring-eco-green/60"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-eco-green px-5 py-3 text-sm font-semibold text-anthracite shadow-lg shadow-eco-green/30 transition hover:-translate-y-0.5 hover:bg-eco-green/90 focus:outline-none focus:ring-2 focus:ring-eco-green/60"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
                <p className="text-center text-xs text-slate-200/80">
                  Pas encore de compte ?{' '}
                  <Link to="/register" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
                    Créez votre espace Urbanova
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

