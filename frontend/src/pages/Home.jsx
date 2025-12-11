import React from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/Layout/PublicHeader';

const Home = () => {
  const stats = [
    {
      value: '−32%',
      label: 'Déchets non collectés',
      description: 'Réduction moyenne par quartier grâce à la planification dynamique.'
    },
    {
      value: '18 min',
      label: 'Temps de réponse',
      description: 'Délai moyen entre le signalement citoyen et la prise en charge.'
    },
    {
      value: '4 500',
      label: 'Citoyens engagés',
      description: 'Communauté active dans la co-gestion des espaces urbains.'
    },
    {
      value: '98%',
      label: 'Tournées optimisées',
      description: 'Taux de réussite des tournées prévues la semaine dernière.'
    }
  ];

  const features = [
    {
      title: 'Cartographie vivante',
      description: "Suivez l'état des points de collecte, identifiez les zones sensibles et anticipez les interventions prioritaires.",
      icon: (
        <svg className="h-7 w-7 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.25a6.75 6.75 0 00-6.75 6.75c0 4.125 4.5 9 6.75 12 2.25-3 6.75-7.875 6.75-12A6.75 6.75 0 0012 2.25z" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="9" r="1.875" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: 'Orchestration IA',
      description: "Notre moteur anticipe les volumes, redistribue les ressources et réduit les trajets superflus.",
      icon: (
        <svg className="h-7 w-7 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 7.5H6A1.5 1.5 0 017.5 9v6A1.5 1.5 0 016 16.5H4.5A1.5 1.5 0 013 15V9A1.5 1.5 0 014.5 7.5zM18 7.5h1.5A1.5 1.5 0 0121 9v6a1.5 1.5 0 01-1.5 1.5H18A1.5 1.5 0 0116.5 15V9A1.5 1.5 0 0118 7.5z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.75 5.25h4.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5h-4.5a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: 'Signalement express',
      description: "Scannez, géolocalisez, envoyez. Les incidents prioritaires sont immédiatement routés vers l'agent adéquat.",
      icon: (
        <svg className="h-7 w-7 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21L3 4.5l9 3.375L21 4.5 12 21z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 8.25v3.375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const steps = [
    {
      title: '1. Signalez',
      description: 'Depuis votre mobile ou le web, capturez la situation en temps réel avec photo, localisation et niveau d’urgence.'
    },
    {
      title: '2. Coordonnez',
      description: 'Le centre de supervision visualise l’incident, affecte l’équipe et partage l’évolution avec les riverains.'
    },
    {
      title: '3. Intervenez',
      description: 'Les agents reçoivent un itinéraire optimisé et mettent à jour le statut à chaque étape de la tournée.'
    },
    {
      title: '4. Analysez',
      description: 'Tableaux de bord, tendances et comparaisons temps réel pour piloter la qualité de service.'
    }
  ];

  const testimonials = [
    {
      quote: "Les habitants se sentent enfin écoutés. On résout les incidents en quelques heures plutôt qu'en plusieurs jours.",
      author: 'Nadia, Responsable propreté urbaine',
      city: 'La Marsa'
    },
    {
      quote: "Urbanova nous permet d’équilibrer les tournées et de réduire les kilomètres parcourus sans sacrifier la qualité.",
      author: 'Youssef, Coordinateur des tournées',
      city: 'Sousse'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900/95 text-slate-100">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(126,214,88,0.4),_transparent_55%)]" />
          <div className="absolute -top-24 right-12 h-72 w-72 rounded-full bg-eco-green/35 blur-3xl" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/14 px-4 py-1 text-sm uppercase tracking-[0.2em]">
                  <span className="h-2 w-2 rounded-full bg-emerald-150 animate-pulse" /> Smart City 2025
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Urbanova : une ville plus propre, connectée et participative.
                </h1>
                <p className="text-lg sm:text-xl text-white/85 max-w-2xl">
                  Co-construisez une gestion des déchets éco-responsable. Urbanova s’appuie sur l’IA, l’open data et les citoyens pour fluidifier les tournées, anticiper les incidents et partager la transparence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full bg-eco-green/90 px-6 py-3 text-base font-semibold text-anthracite shadow-lg shadow-eco-green/40 transition hover:-translate-y-0.5 hover:bg-eco-green"
                  >
                    Rejoindre Urbanova
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:border-white hover:bg-white/15"
                  >
                    Voir la démo en direct
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-emerald-300/28 blur-2xl" />
                  <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-teal-200/28 blur-2xl" />
                  <div className="relative rounded-3xl border border-white/12 bg-white/12 p-8 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Tour urbain pilote</p>
                      <span className="rounded-full bg-emerald-400/30 px-3 py-1 text-xs font-semibold text-white">Mode Live</span>
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold">Supervision intelligente</h3>
                    <p className="mt-3 text-sm text-white/70">
                      Visualisez les points chauds, suivez les itinéraires en temps réel et recevez des recommandations intelligentes pour équilibrer les ressources.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white/16 px-4 py-5 shadow-inner">
                        <p className="text-xs uppercase tracking-wide text-white/60">Collectes du jour</p>
                        <p className="mt-3 text-3xl font-semibold text-eco-green">187</p>
                        <p className="mt-1 text-xs text-white/60">+12% vs. semaine dernière</p>
                      </div>
                      <div className="rounded-2xl bg-white/14 px-4 py-5 shadow-inner">
                        <p className="text-xs uppercase tracking-wide text-white/60">Incidents résolus</p>
                        <p className="mt-3 text-3xl font-semibold text-eco-green">54</p>
                        <p className="mt-1 text-xs text-white/60">88% en moins de 2h</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base font-semibold">5G</span>
                      <p>Connexion sécurisée au réseau urbain &amp; actualisation toutes les 30 secondes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-slate-900/50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-600/45 bg-slate-800/75 p-8 shadow-lg shadow-black/10">
                  <p className="text-3xl font-bold text-eco-green/95">{stat.value}</p>
                  <p className="mt-3 text-lg font-semibold text-slate-50">{stat.label}</p>
                  <p className="mt-2 text-sm text-slate-200">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-850 py-24">
          <div className="absolute -left-16 top-24 h-72 w-72 rounded-full bg-eco-green/16 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-eco-green/10 blur-2xl" />
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Une orchestration qui respire la ville</h2>
              <p className="mt-4 text-base text-slate-200">
                Urbanova synchronise les agents, les citoyens et la donnée pour offrir une expérience fluide et enthousiasmante.
              </p>
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="group relative overflow-hidden rounded-3xl bg-slate-900/80 p-6 shadow-xl border border-slate-700/45 transition hover:-translate-y-1 hover:shadow-emerald-500/12">
                  <div className="absolute inset-0 bg-gradient-to-br from-eco-green/0 via-slate-900/50 to-eco-green/10 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-eco-green/12 text-eco-green">
                    {feature.icon}
                  </div>
                  <h3 className="relative mt-6 text-xl font-semibold text-slate-50">{feature.title}</h3>
                  <p className="relative mt-3 text-sm text-slate-200">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-slate-900/60 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="lg:flex lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-eco-green">Comment ça marche</p>
                <h2 className="mt-4 text-3xl font-bold text-slate-50 sm:text-4xl">Chaque quartier devient un laboratoire citoyen.</h2>
              </div>
              <Link
                to="/register"
                className="mt-10 inline-flex items-center justify-center rounded-full border border-eco-green/50 px-5 py-2 text-sm font-semibold text-eco-green/90 transition hover:border-eco-green lg:mt-0"
              >
                Créer un compte gratuit
              </Link>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.title} className="relative overflow-hidden rounded-3xl border border-slate-700/45 bg-slate-900/75 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-emerald-500/10">
                  <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-eco-green/12" />
                  <h3 className="relative text-lg font-semibold text-slate-50">{step.title}</h3>
                  <p className="relative mt-3 text-sm text-slate-200">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative overflow-hidden bg-slate-900/95 py-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(82,196,140,0.16),_rgba(15,23,42,0.78))]" />
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Ils réinventent la ville</p>
              <h2 className="mt-4 text-3xl font-semibold">Collectivités partenaires &amp; agents engagés</h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.author} className="relative overflow-hidden rounded-3xl border border-white/11 bg-white/11 p-8 backdrop-blur">
                  <div className="absolute -top-6 -left-4 h-24 w-24 rounded-full bg-eco-green/22 blur-2xl" />
                  <p className="relative text-lg font-medium text-white/90">“{testimonial.quote}”</p>
                  <div className="relative mt-6 flex flex-col">
                    <span className="text-sm font-semibold text-white">{testimonial.author}</span>
                    <span className="text-xs uppercase tracking-widest text-emerald-200">{testimonial.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900/95 py-24">
          <div className="max-w-4xl mx-auto rounded-[44px] bg-gradient-to-br from-eco-green/85 via-mint-green/78 to-emerald-300 px-8 py-16 text-slate-900 shadow-2xl">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-900/70">Rejoignez la révolution urbaine</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl text-slate-900">Faites rayonner votre ville avec Urbanova</h2>
              <p className="mt-4 text-base text-slate-800/80">
                Déployez une gouvernance des déchets transparente, collaborative et enthousiasmante. Testez la plateforme gratuitement et découvrez les tableaux de bord prédictifs qui transforment vos décisions.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Démarrer maintenant
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-900/28 px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-900/10"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900/80">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-700/70 pt-8 sm:flex-row">
              <p className="text-xs text-slate-100">© {new Date().getFullYear()} Urbanova. Tous droits réservés.</p>
              <div className="flex items-center gap-6 text-sm">
                <Link to="/" className="text-slate-100 transition hover:text-eco-green">Accueil</Link>
                <Link to="/login" className="text-slate-100 transition hover:text-eco-green">Connexion</Link>
                <Link to="/register" className="text-slate-100 transition hover:text-eco-green">Inscription</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
