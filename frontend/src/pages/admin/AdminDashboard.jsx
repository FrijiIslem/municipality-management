import { useState, useMemo } from 'react'
import { useQuery } from 'react-query'
import api, { tourAPI, containerAPI, incidentAPI, agentAPI, citoyenAPI, vehicleAPI, notificationAPI } from '../../services/api'
import { Route, Trash2, AlertTriangle, Users, Truck, UserCheck, Bell, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format, subDays, startOfDay, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import IncidentModal from '../../components/Incident/IncidentModal'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const AdminDashboard = () => {
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const { data: tours = [] } = useQuery('tours', tourAPI.getAll)
  const { data: containers = [] } = useQuery('containers', containerAPI.getAll)
  const { data: incidents = [] } = useQuery('incidents', incidentAPI.getAll)
  const { data: agents = [] } = useQuery('agents', agentAPI.getAll)
  const { data: citoyens = [] } = useQuery('citoyens', citoyenAPI.getAll)
  const { data: vehicles = [] } = useQuery('vehicles', vehicleAPI.getAll)
  const { data: notifications = [] } = useQuery('notifications', notificationAPI.getAll)
  // Recyclage stats (backend endpoints)
  const { data: recyclageQuantites = {} } = useQuery('recyclage-quantites', () => api.get('/recyclage/quantite-par-type'))
  const { data: recyclageTaux = {} } = useQuery('recyclage-taux', () => api.get('/recyclage/taux-par-type'))
  const { data: recyclageTauxMoyen = {} } = useQuery('recyclage-taux-moyen', () => api.get('/recyclage/taux-moyen-par-type'))

  const activeTours = tours.filter(t => t.etat === 'EN_COURS' || t.etat === 'ENCOURS')
  const pendingTours = tours.filter(t => t.etat === 'PLANIFIEE')
  const pendingIncidents = incidents.filter(i => i.statut === 'EN_ATTENTE')
  const fullContainers = containers.filter(c => c.etatRemplissage === 'saturee' || c.etatRemplissage === 'SATUREE')
  
  // Notifications récentes pour l'admin (planification automatique)
  const recentPlanningNotifications = notifications
    .filter(n => n.destination === 'admin' && (n.type === 'REMINDER' || n.message?.includes('planifiée')))
    .slice(0, 3)
    .sort((a, b) => new Date(b.dateEnvoi || b.dateCreation || 0) - new Date(a.dateEnvoi || a.dateCreation || 0))

  // Données pour les graphiques
  const chartData = useMemo(() => {
    // 1. Évolution des tournées sur les 7 derniers jours
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        date: format(date, 'dd/MM'),
        fullDate: startOfDay(date),
        tours: 0
      }
    })

    tours.forEach(tour => {
      const tourDate = tour.dateCreation || tour.datePlanification
      if (tourDate) {
        const date = startOfDay(new Date(tourDate))
        const dayData = last7Days.find(d => isSameDay(d.fullDate, date))
        if (dayData) {
          dayData.tours++
        }
      }
    })

    // 2. Répartition des états de conteneurs
    const containerStates = {
      vide: containers.filter(c => {
        const etat = c.etatRemplissage?.toLowerCase()
        return etat === 'vide'
      }).length,
      moyen: containers.filter(c => {
        const etat = c.etatRemplissage?.toLowerCase()
        return etat === 'moyen'
      }).length,
      saturee: containers.filter(c => {
        const etat = c.etatRemplissage?.toLowerCase()
        return etat === 'saturee' || etat === 'plein' || etat === 'saturée'
      }).length,
    }

    // 3. Répartition des états de tournées
    const tourStates = {
      PLANIFIEE: tours.filter(t => t.etat === 'PLANIFIEE').length,
      VALIDEE: tours.filter(t => t.etat === 'VALIDEE' || t.etat === 'ACCEPTEE').length,
      EN_COURS: tours.filter(t => t.etat === 'EN_COURS' || t.etat === 'ENCOURS').length,
      TERMINEE: tours.filter(t => t.etat === 'TERMINEE').length,
    }

    // 4. Incidents par statut
    const incidentStats = {
      EN_ATTENTE: incidents.filter(i => i.statut === 'EN_ATTENTE').length,
      EN_COURS: incidents.filter(i => i.statut === 'EN_COURS').length,
      FIXEE: incidents.filter(i => i.statut === 'FIXEE').length,
    }

    // 5. Tournées par jour de la semaine (dernières 4 semaines)
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const toursByWeekDay = weekDays.map(day => ({ day, count: 0 }))

    tours.forEach(tour => {
      const tourDate = tour.dateCreation || tour.datePlanification
      if (tourDate) {
        const date = new Date(tourDate)
        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1 // Convertir dimanche (0) en 6
        if (toursByWeekDay[dayIndex]) {
          toursByWeekDay[dayIndex].count++
        }
      }
    })

    // Recyclage: préparer les datasets
    const TYPE_LABELS = { verre: 'Verre', plastique: 'Plastique', organique: 'Organique', mixte: 'Mixte', metals: 'Métaux' }
    const TYPE_COLORS = { verre: '#FFC107', plastique: '#2196F3', organique: '#4CAF50', mixte: '#9E9E9E', metals: '#00BCD4' }
    const scaleRate = (v) => {
      const num = Number(v || 0)
      return num > 1 ? num : Math.round(num * 100)
    }
    const quantitiesPie = Object.entries(TYPE_LABELS).map(([key, name]) => ({
      name,
      value: Number((recyclageQuantites || {})[key] || 0),
      color: TYPE_COLORS[key],
    }))
    const ratesBar = Object.entries(TYPE_LABELS).map(([key, name]) => ({
      name,
      taux: scaleRate((recyclageTaux || {})[key]),
      moyen: scaleRate((recyclageTauxMoyen || {})[key]),
    }))

    return {
      toursEvolution: last7Days.map(d => ({ date: d.date, tournées: d.tours })),
      containerStates: [
        { name: 'Vide', value: containerStates.vide, color: '#4CAF50' },
        { name: 'Moyen', value: containerStates.moyen, color: '#FF9800' },
        { name: 'Saturé', value: containerStates.saturee, color: '#F44336' },
      ],
      tourStates: [
        { name: 'Planifiée', value: tourStates.PLANIFIEE, color: '#FFC107' },
        { name: 'Validée', value: tourStates.VALIDEE, color: '#2196F3' },
        { name: 'En cours', value: tourStates.EN_COURS, color: '#9C27B0' },
        { name: 'Terminée', value: tourStates.TERMINEE, color: '#4CAF50' },
      ],
      incidentStats: [
        { name: 'En attente', value: incidentStats.EN_ATTENTE, color: '#FF9800' },
        { name: 'En cours', value: incidentStats.EN_COURS, color: '#2196F3' },
        { name: 'Résolu', value: incidentStats.FIXEE, color: '#4CAF50' },
      ],
      toursByWeekDay,
      recyclingQuantities: quantitiesPie,
      recyclingRates: ratesBar,
    }
  }, [tours, containers, incidents, recyclageQuantites, recyclageTaux, recyclageTauxMoyen])

  const COLORS = {
    eco: '#4CAF50',
    urban: '#2196F3',
    warning: '#FF9800',
    danger: '#F44336',
    purple: '#9C27B0',
    yellow: '#FFC107',
  }

  const stats = [
    {
      label: 'Agents',
      value: agents.length,
      icon: UserCheck,
      color: 'blue-500',
      link: '/admin/users',
    },
    {
      label: 'Citoyens',
      value: citoyens.length,
      icon: Users,
      color: 'green-500',
      link: '/admin/users',
    },
    {
      label: 'Tournées actives',
      value: activeTours.length,
      icon: Route,
      color: 'purple-500',
      link: '/admin/tours',
    },
    {
      label: 'Tournées à valider',
      value: pendingTours.length,
      icon: Bell,
      color: 'yellow-500',
      link: '/admin/tours',
    },
    {
      label: 'Conteneurs pleins',
      value: fullContainers.length,
      icon: Trash2,
      color: 'red-500',
      link: '/admin/containers',
    },
    {
      label: 'Incidents en attente',
      value: pendingIncidents.length,
      icon: AlertTriangle,
      color: 'orange-500',
      link: '/admin/incidents',
    },
    {
      label: 'Véhicules',
      value: vehicles.length,
      icon: Truck,
      color: 'indigo-500',
      link: '/admin/vehicles',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Tableau de bord Administrateur
          </h1>
          <p className="text-gray-600">Vue d'ensemble du système</p>
        </div>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="card card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-anthracite">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des tournées (7 derniers jours) */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-anthracite mb-4">
            Évolution des tournées (7 derniers jours)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.toursEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tournées" 
                stroke={COLORS.urban} 
                strokeWidth={3}
                dot={{ fill: COLORS.urban, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des états de conteneurs */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-anthracite mb-4">
            Répartition des conteneurs par état
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.containerStates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill={COLORS.eco} radius={[8, 8, 0, 0]}>
                {chartData.containerStates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des états de tournées */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-anthracite mb-4">
            Répartition des tournées par état
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.tourStates}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.tourStates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents par statut */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-anthracite mb-4">
            Répartition des incidents par statut
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.incidentStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                type="number"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {chartData.incidentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tournées par jour de la semaine */}
      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-anthracite mb-4">
          Répartition des tournées par jour de la semaine
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.toursByWeekDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" fill={COLORS.purple} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recyclage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quantités recyclées par type */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-anthracite mb-4">
            Quantités recyclées par type
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.recyclingQuantities}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.recyclingQuantities.map((entry, index) => (
                  <Cell key={`rq-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Taux de recyclage par type (vs moyenne) */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-anthracite mb-4">
            Taux de recyclage par type (vs moyenne)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.recyclingRates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="taux" name="Taux (%)" fill={COLORS.eco} radius={[8, 8, 0, 0]} />
              <Bar dataKey="moyen" name="Moyenne (%)" fill={COLORS.warning} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Planning Notifications */}
      {recentPlanningNotifications.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-anthracite">
              Notifications de planification
            </h2>
            <Link
              to="/admin/notifications"
              className="text-red-500 hover:underline text-sm font-medium"
            >
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentPlanningNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg hover:border-yellow-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-anthracite mb-1">
                      Planification automatique
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {notification.message || notification.contenu}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.dateEnvoi || notification.dateCreation
                        ? format(
                            new Date(notification.dateEnvoi || notification.dateCreation),
                            'dd MMM yyyy à HH:mm',
                            { locale: fr }
                          )
                        : 'Date inconnue'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Incidents */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-anthracite">
            Incidents récents
          </h2>
          <Link
            to="/admin/incidents"
            className="text-red-500 hover:underline text-sm font-medium"
          >
            Voir tout
          </Link>
        </div>
        
        {incidents.length > 0 ? (
          <div className="space-y-3">
            {incidents.slice(0, 5).map((incident) => (
              <div
                key={incident.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-light-gray transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-anthracite">
                      {incident.categorie || 'Incident'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {incident.description || 'Aucune description'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {incident.date ? new Date(incident.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </p>
                  </div>
                  <span className={`badge ${
                    incident.statut === 'FIXEE' ? 'badge-success' :
                    incident.statut === 'EN_ATTENTE' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {incident.statut || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Aucun incident
          </p>
        )}
      </div>

      {showIncidentModal && (
        <IncidentModal onClose={() => setShowIncidentModal(false)} />
      )}
    </div>
  )
}

export default AdminDashboard

