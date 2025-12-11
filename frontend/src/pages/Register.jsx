import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Leaf, ShieldCheck, Clock, Smartphone, Mail, MapPin, User, Lock } from 'lucide-react'
import useAuthStore from '../store/authStore'
import PublicHeader from '../components/Layout/PublicHeader'

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const registerUser = useAuthStore((state) => state.register)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    try {
      setError('')
      setIsLoading(true)
      await registerUser({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        password: formData.password,
        role: 'CITOYEN'
      })
      toast.success('Bienvenue ! Votre compte Urbanova est créé.')
      navigate('/citoyen')
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Une erreur est survenue lors de l'inscription"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const fieldWrapper = 'relative flex flex-col space-y-2'
  const inputStyle = 'w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 shadow-inner focus:border-eco-green focus:outline-none focus:ring-2 focus:ring-eco-green/60'
  const labelStyle = 'text-sm font-medium text-slate-100'
  const iconStyle = 'absolute left-4 top-3.5 h-4 w-4 text-emerald-200'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <PublicHeader />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(126,214,88,0.2),_transparent_60%)]" />
        <div className="absolute -top-24 right-16 h-80 w-80 rounded-full bg-eco-green/25 blur-3xl" />
        <div className="absolute top-24 left-10 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-2">
              <div className="relative hidden lg:block bg-gradient-to-br from-emerald-500/30 via-emerald-400/25 to-teal-400/20 p-12">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Leaf className="h-8 w-8" />
                      <span className="text-2xl font-semibold">Urbanova</span>
                    </div>
                    <h2 className="mt-10 text-4xl font-semibold text-white">
                      Activez votre rôle dans la ville positive.
                    </h2>
                    <p className="mt-4 text-sm text-white/80 max-w-sm">
                      En rejoignant Urbanova, vous contribuez à une coordination fluide des collectes et à une gouvernance plus ouverte entre citoyens, agents et décideurs locaux.
                    </p>
                  </div>

                  <div className="space-y-6 text-white/85">
                    <div className="flex gap-4">
                      <div className="rounded-2xl bg-white/15 p-3">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">Protection & transparence</h3>
                        <p className="mt-1 text-sm text-white/75">Chiffrement des données, auditabilité en continu, confiance partagée.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-2xl bg-white/15 p-3">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">Synchronisation temps réel</h3>
                        <p className="mt-1 text-sm text-white/75">Notifications instantanées, circuits de décision raccourcis, efficacité multipliée.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-12 sm:px-12">
                <div className="mb-8 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">
                    Création de compte
                  </span>
                  <h1 className="mt-6 text-3xl font-semibold text-white">
                    Rejoignez Urbanova en quelques minutes
                  </h1>
                  <p className="mt-3 text-sm text-slate-200/80">
                    Complétez votre profil citoyen pour accéder aux tableaux de bord, aux signalements et à la coordination locale.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className={fieldWrapper}>
                      <label htmlFor="prenom" className={labelStyle}>Prénom</label>
                      <div className="relative">
                        <User className={iconStyle} />
                        <input
                          id="prenom"
                          name="prenom"
                          type="text"
                          placeholder="Rania"
                          className={`${inputStyle} pl-10`}
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={fieldWrapper}>
                      <label htmlFor="nom" className={labelStyle}>Nom</label>
                      <div className="relative">
                        <User className={iconStyle} />
                        <input
                          id="nom"
                          name="nom"
                          type="text"
                          placeholder="Ben Youssef"
                          className={`${inputStyle} pl-10`}
                          value={formData.nom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={`${fieldWrapper} sm:col-span-2`}>
                      <label htmlFor="email" className={labelStyle}>Adresse email</label>
                      <div className="relative">
                        <Mail className={iconStyle} />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="prenom.nom@email.com"
                          className={`${inputStyle} pl-10`}
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={fieldWrapper}>
                      <label htmlFor="telephone" className={labelStyle}>Téléphone</label>
                      <div className="relative">
                        <Smartphone className={iconStyle} />
                        <input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          className={`${inputStyle} pl-10`}
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={fieldWrapper}>
                      <label htmlFor="adresse" className={labelStyle}>Adresse</label>
                      <div className="relative">
                        <MapPin className={iconStyle} />
                        <input
                          id="adresse"
                          name="adresse"
                          type="text"
                          placeholder="Résidence Al Qods, bloc B"
                          className={`${inputStyle} pl-10`}
                          value={formData.adresse}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={fieldWrapper}>
                      <label htmlFor="password" className={labelStyle}>Mot de passe</label>
                      <div className="relative">
                        <Lock className={iconStyle} />
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className={`${inputStyle} pl-10`}
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={fieldWrapper}>
                      <label htmlFor="confirmPassword" className={labelStyle}>Confirmer le mot de passe</label>
                      <div className="relative">
                        <Lock className={iconStyle} />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className={`${inputStyle} pl-10`}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex w-full items-center justify-center rounded-full bg-eco-green px-6 py-3 text-sm font-semibold text-anthracite shadow-lg shadow-eco-green/30 transition hover:-translate-y-0.5 hover:bg-eco-green/90 focus:outline-none focus:ring-2 focus:ring-eco-green/50 disabled:opacity-70"
                    >
                      {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                    </button>

                    <p className="text-center text-xs text-slate-200/80">
                      Déjà membre ?{' '}
                      <Link to="/login" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
                        Connectez-vous ici
                      </Link>
                    </p>
                    <p className="text-center text-[11px] text-slate-300/60">
                      En validant, vous acceptez nos conditions d’utilisation et notre politique de confidentialité.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
