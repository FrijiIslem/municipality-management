import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { containerAPI, notificationAPI } from '../../services/api'
import { useQuery } from 'react-query'

// Calendrier de collecte par jour de la semaine
const COLLECTION_SCHEDULE = {
  1: { type: 'organique', label: 'Organique', icon: '🌱'},
  2: { type: 'plastique', label: 'Plastique', icon: '♻️'},
  3: { type: 'organique', label: 'Organique', icon: '🌱'},
  4: { type: 'mixte', label: 'Mixte', icon: '🗑️'},
  5: { type: 'métal', label: 'Métaux', icon: '🔩'},
  6: { type: 'organique', label: 'Organique', icon: '🌱'},
  0: { type: 'verre', label: 'Verre', icon: '🍾'},
}

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

// Règles de tri par type de déchet (ordre de priorité)
const SORTING_RULES = [
  { keywords: ['bouteille plastique', 'bouteille en plastique'], container: 'Plastique', tip: 'Rince la bouteille avant de la jeter pour faciliter le recyclage.' },
  { keywords: ['plastique', 'emballage plastique'], container: 'Plastique', tip: 'Vérifie que le plastique est propre et sec.' },
  { keywords: ['verre', 'bouteille en verre', 'bocal'], container: 'Verre', tip: 'Retire les bouchons et couvercles avant de jeter.' },
  { keywords: ['organique', 'nourriture', 'compost', 'épluchure'], container: 'Organique', tip: 'Utilise un sac compostable pour les déchets organiques.' },
  { keywords: ['métal', 'aluminium', 'fer', 'canette', 'boîte de conserve'], container: 'Métal', tip: 'Les emballages métalliques doivent être vides et propres.' },
  { keywords: ['papier', 'carton', 'journal'], container: 'Papier', tip: 'Évite le papier souillé ou gras. Aplatit les cartons.' },
  { keywords: ['pile', 'batterie'], container: 'Point de dépôt spécialisé', tip: 'Dépose dans des points de collecte dédiés, jamais dans les poubelles normales.' },
  { keywords: ['téléphone', 'électronique', 'appareil électronique', 'ordinateur'], container: 'Point de dépôt spécialisé', tip: 'Dépose dans des déchetteries ou points de collecte spécialisés.' },
]

// Points de dépôt (adaptables selon la région de l'utilisateur)
const DEPOSIT_POINTS = {
  default: [
    { name: 'Centre de Tri de Tunis', type: 'Général', address: 'Zone Industrielle, Tunis', hours: '8h-16h', distance: '3 km' },
    { name: 'Point de Collecte Piles', type: 'Piles/Batteries', address: 'Centre Commercial, Tunis', hours: '9h-18h', distance: '2 km' },
    { name: 'Déchetterie Municipale', type: 'Électronique', address: 'Route de la Marsa, Tunis', hours: '7h-17h', distance: '4 km' },
  ],
  sfax: [
    { name: 'Centre de Tri de Sfax', type: 'Général', address: 'Zone Industrielle, Sfax', hours: '8h-16h', distance: '2 km' },
    { name: 'Point de Collecte Piles', type: 'Piles/Batteries', address: 'Centre Commercial, Sfax', hours: '9h-18h', distance: '1.5 km' },
    { name: 'Déchetterie Municipale', type: 'Électronique', address: 'Route de Tunis, Sfax', hours: '7h-17h', distance: '3 km' },
  ],
}

// Suggestions de questions rapides
const QUICK_SUGGESTIONS = [
  'Quand est la collecte de plastique ?',
  'Où jeter une bouteille en verre ?',
  'Où déposer des piles ?',
  'Comment signaler un problème ?',
]

const TrashChatbot = () => {
  const { user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: `Bonjour${user?.prenom ? ` ${user.prenom}` : ''} ! Je suis votre assistant pour la gestion des déchets. Posez-moi vos questions sur les collectes, le tri, les points de dépôt, ou signalez un problème.`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Charger conteneurs et notifications
  const { data: containers = [] } = useQuery('containers', containerAPI.getAll, { enabled: isOpen })
  const { data: notifications = [] } = useQuery('notifications', notificationAPI.getAll, { enabled: isOpen })

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (isOpen) inputRef.current?.focus() }, [isOpen])

  // Détecter le type de déchet dans la question
  const detectWasteType = (query) => {
    const lowerQuery = query.toLowerCase()
    // Parcourir les règles par ordre de priorité
    for (const rule of SORTING_RULES) {
      for (const keyword of rule.keywords) {
        if (lowerQuery.includes(keyword)) {
          return { keyword, ...rule }
        }
      }
    }
    return null
  }

  // Obtenir le jour de collecte pour un type de déchet
  const getCollectionDay = (wasteType) => {
    const lowerType = wasteType.toLowerCase()
    for (const [day, schedule] of Object.entries(COLLECTION_SCHEDULE)) {
      if (schedule.type === lowerType || schedule.label.toLowerCase() === lowerType) {
        return { day: parseInt(day), ...schedule }
      }
    }
    return null
  }

  // Obtenir le prochain jour de collecte pour un type
  const getNextCollectionDay = (wasteType) => {
    const today = new Date()
    const todayDay = today.getDay()
    const collectionInfo = getCollectionDay(wasteType)
    if (!collectionInfo) return null

    let daysUntil = (collectionInfo.day - todayDay + 7) % 7
    if (daysUntil === 0) daysUntil = 7 // Si c'est aujourd'hui, prochaine dans 7 jours

    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + daysUntil)

    return { date: nextDate, dayName: DAYS[collectionInfo.day], ...collectionInfo }
  }

  // Obtenir les points de dépôt selon la région de l'utilisateur
  const getDepositPoints = () => {
    const userAddress = (user?.adresse || '').toLowerCase()
    if (userAddress.includes('sfax')) return DEPOSIT_POINTS.sfax
    return DEPOSIT_POINTS.default
  }

  // Scénario A: Informations sur la collecte
  const handleCollectionInfo = (query) => {
    const lowerQuery = query.toLowerCase()
    const userName = user?.prenom || ''
    const userAddress = user?.adresse ? `dans votre adresse` : 'dans votre quartier'

    // Détecter le type de déchet mentionné
    let wasteType = null
    for (const schedule of Object.values(COLLECTION_SCHEDULE)) {
      if (lowerQuery.includes(schedule.type) || lowerQuery.includes(schedule.label.toLowerCase())) {
        wasteType = schedule.type
        break
      }
    }

    // Si demande pour demain
    if (lowerQuery.includes('demain')) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowDay = tomorrow.getDay()
      const collection = COLLECTION_SCHEDULE[tomorrowDay]
      if (collection) {
        return `Demain (${DAYS[tomorrowDay]}), la collecte prévue est pour les déchets **${collection.label}** ${collection.icon} . N'oublie pas de sortir le bac la veille au soir !`
      }
    }

    // Si demande pour un type spécifique
    if (wasteType) {
      const nextCollection = getNextCollectionDay(wasteType)
      if (nextCollection) {
        const daysUntil = Math.ceil((nextCollection.date - new Date()) / (1000 * 60 * 60 * 24))
        const dayText = daysUntil === 1 ? 'demain' : daysUntil === 7 ? `le ${nextCollection.dayName} prochain` : `dans ${daysUntil} jours (${nextCollection.dayName})`
        return `Bonjour${userName ? ` ${userName}` : ''}, la collecte des **${nextCollection.label}** ${nextCollection.icon} est prévue ${dayText} . N'oublie pas de sortir le bac la veille au soir !`
      }
    }

    // Calendrier complet
    let scheduleText = `Voici le calendrier des collectes ${userAddress} :\n\n`
    for (const [day, schedule] of Object.entries(COLLECTION_SCHEDULE)) {
      scheduleText += `• ${DAYS[parseInt(day)]} : ${schedule.label} ${schedule.icon} \n`
    }
    scheduleText += `\n💡 Astuce : Sortez vos bacs la veille au soir pour être sûr qu'ils soient collectés !`
    return scheduleText
  }

  // Scénario B: Tri des déchets
  const handleSortingInfo = (query) => {
    const info = detectWasteType(query)
    if (info) {
      if (info.container === 'Point de dépôt spécialisé') {
        return `Les ${info.keyword} doivent aller dans un **${info.container}**. ${info.tip}\n\nJe peux te donner l'adresse du point de dépôt le plus proche si tu veux.`
      }
      return `Les ${info.keyword} doivent aller dans le bac **${info.container}**. ${info.tip}`
    }

    // Questions générales sur le tri
    if (query.toLowerCase().includes('comment trier') || query.toLowerCase().includes('comment jeter')) {
      return `Pour bien trier tes déchets :\n\n• **Plastique** : Bouteilles, flacons, emballages (bien rincés)\n• **Verre** : Bouteilles, pots, bocaux (sans bouchons)\n• **Organique** : Restes alimentaires, épluchures (dans un sac compostable)\n• **Métal** : Canettes, boîtes de conserve (vides et propres)\n• **Papier/Carton** : Journaux, cartons (aplatis)\n• **Dangereux/Électronique** : Piles, batteries, appareils électroniques (points de dépôt spécialisés)\n\nAs-tu un type de déchet spécifique en tête ?`
    }

    return `Précisez le type de déchet pour le tri (ex: bouteille plastique, métal, papier, pile).`
  }

  // Scénario C: Points de dépôt
  const handleDepositPoints = (query) => {
    const lowerQuery = query.toLowerCase()
    const userAddress = user?.adresse || 'Tunis'
    
    // Détecter le type de déchet
    let wasteType = null
    if (lowerQuery.includes('pile') || lowerQuery.includes('batterie')) {
      wasteType = 'Piles/Batteries'
    } else if (lowerQuery.includes('téléphone') || lowerQuery.includes('électronique') || lowerQuery.includes('appareil')) {
      wasteType = 'Électronique'
    } else if (lowerQuery.includes('recyclage') || lowerQuery.includes('centre')) {
      wasteType = 'Général'
    }

    const allPoints = getDepositPoints()
    const relevantPoints = wasteType 
      ? allPoints.filter(p => p.type === wasteType || p.type === 'Général')
      : allPoints

    if (!relevantPoints.length) {
      return `Je n'ai pas trouvé de points de dépôt proches de votre adresse. Précisez le type de déchet (piles, électronique, etc.).`
    }

    let response = `Voici les points de dépôt${wasteType ? ` pour ${wasteType.toLowerCase()}` : ''} près de votre adresse :\n\n`
    relevantPoints.forEach((p, i) => {
      response += `${i + 1}. **${p.name}**\n   📍 ${p.address}\n   🕐 ${p.hours}\n   📏 ${p.distance}\n\n`
    })
    return response
  }

  // Scénario D: Signalement
  const handleIncidentReport = (query) => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('signaler') || lowerQuery.includes('problème') || lowerQuery.includes('non collecté') || lowerQuery.includes('déchets sauvages')) {
      return `Je peux t'aider à signaler le problème. Pour cela :\n\n1. Va dans la section "Mes incidents" de ton tableau de bord\n2. Clique sur "Signaler un incident"\n3. Remplis le formulaire avec :\n   - Le type de problème (retard de collecte, conteneur, etc.)\n   - L'adresse exacte\n   - Une description détaillée\n   - Une photo si possible\n\nLe problème sera traité rapidement par l'équipe municipale.`
    }

    return `Pour signaler un problème, va dans la section "Mes incidents" de ton tableau de bord ou dis-moi quel est le problème et je t'aiderai à le signaler.`
  }

  // Scénario E: Notifications
  const handleNotifications = (query) => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('changement') || lowerQuery.includes('modification') || lowerQuery.includes('calendrier')) {
      const recentNotifications = notifications
        .filter(n => (n.type === 'ALERTE' || n.type === 'INFO') && !n.lu)
        .slice(0, 3)
      
      if (recentNotifications.length > 0) {
        let response = 'Voici les dernières alertes et changements :\n\n'
        recentNotifications.forEach(n => {
          response += `• ${n.titre || n.message}\n`
        })
        return response
      }
      
      return `Aucun changement dans le calendrier de collecte cette semaine. Le calendrier habituel s'applique.`
    }

    if (lowerQuery.includes('campagne') || lowerQuery.includes('événement')) {
      return `La prochaine campagne de recyclage du papier commence le 20 décembre. Reste connecté pour plus d'informations !`
    }

    return `Pour les notifications et alertes, consulte la section "Notifications" de ton tableau de bord. Y a-t-il un type d'alerte spécifique qui t'intéresse ?`
  }

  // Scénario F: Questions générales
  const handleGeneralQuestions = (query) => {
    const lower = query.toLowerCase()

    if (lower.includes('pourquoi') && (lower.includes('trier') || lower.includes('important'))) {
      return `Le tri des déchets est important car :\n\n• **Réduction de la pollution** : Moins de déchets dans les décharges\n• **Conservation des ressources** : Recyclage des matériaux pour créer de nouveaux produits\n• **Protection de l'environnement** : Réduction de l'extraction de matières premières\n• **Économie d'énergie** : Le recyclage consomme moins d'énergie que la production de nouveaux matériaux\n• **Création d'emplois** : L'industrie du recyclage crée des emplois locaux\n\nChaque geste compte pour préserver notre planète ! 🌍`
    }

    if (lower.includes('polluant') || lower.includes('pollue')) {
      return `Les déchets les plus polluants sont :\n\n• **Plastiques à usage unique** : Bouteilles, sacs, emballages (mettent 400-1000 ans à se dégrader)\n• **Batteries et piles** : Contiennent des métaux lourds toxiques\n• **Appareils électroniques** : Contiennent des substances dangereuses (plomb, mercure)\n• **Déchets organiques non compostés** : Produisent du méthane dans les décharges\n\nC'est pourquoi il est essentiel de bien trier et recycler !`
    }

    if (lower.includes('réduire') || lower.includes('diminuer') || lower.includes('moins')) {
      return `Pour réduire tes déchets ménagers :\n\n• **Réutiliser** : Utilise des sacs réutilisables, des bouteilles en verre\n• **Composter** : Transforme tes déchets organiques en engrais\n• **Acheter moins d'emballages** : Privilégie les produits en vrac\n• **Réparer** : Donne une seconde vie aux objets au lieu de les jeter\n• **Donner** : Offre ce que tu n'utilises plus à d'autres\n• **Acheter durable** : Choisis des produits de qualité qui durent plus longtemps\n\nChaque petit geste fait une grande différence ! 🌱`
    }

    return `Je peux t'aider avec des questions sur le tri, le recyclage, l'importance du tri, les déchets polluants, ou comment réduire tes déchets. Que veux-tu savoir ?`
  }

  // Fonction principale de traitement
  const processQuery = (query) => {
    const lower = query.toLowerCase()

    // Scénario A: Collecte
    if (['collecte', 'jour', 'quand', 'calendrier', 'horaire', 'planning', 'demain', 'bac', 'sortir'].some(k => lower.includes(k))) {
      return handleCollectionInfo(query)
    }

    // Scénario B: Tri
    if (['poubelle', 'bac', 'jeter', 'mettre', 'trier', 'recycler'].some(k => lower.includes(k))) {
      return handleSortingInfo(query)
    }

    // Scénario C: Points de dépôt
    if (['déposer', 'point', 'centre', 'déchetterie', 'recyclage', 'où'].some(k => lower.includes(k))) {
      return handleDepositPoints(query)
    }

    // Scénario D: Signalement
    if (['signaler', 'problème', 'incident', 'non collecté', 'déchets sauvages', 'abandonné'].some(k => lower.includes(k))) {
      return handleIncidentReport(query)
    }

    // Scénario E: Notifications
    if (['notification', 'alerte', 'changement', 'campagne', 'événement'].some(k => lower.includes(k))) {
      return handleNotifications(query)
    }

    // Scénario F: Questions générales
    if (['pourquoi', 'important', 'polluant', 'réduire', 'écologie', 'environnement'].some(k => lower.includes(k))) {
      return handleGeneralQuestions(query)
    }

    // Salutations
    if (['bonjour', 'salut', 'hello', 'bonsoir'].some(k => lower.includes(k))) {
      return `Bonjour${user?.prenom ? ` ${user.prenom}` : ''} ! Comment puis-je t'aider aujourd'hui ? Je peux te renseigner sur les collectes, le tri, les points de dépôt, ou t'aider à signaler un problème.`
    }

    // Aide
    if (['aide', 'help', 'que puis'].some(k => lower.includes(k))) {
      return `Je peux t'aider avec :\n\n• **Collectes** : "Quand est la collecte de plastique ?"\n• **Tri** : "Dans quelle poubelle je mets une bouteille en plastique ?"\n• **Points de dépôt** : "Où puis-je déposer des piles ?"\n• **Signalements** : "Comment signaler un bac non collecté ?"\n• **Notifications** : "Y a-t-il des changements cette semaine ?"\n• **Questions générales** : "Pourquoi est-il important de trier ?"\n\nPose-moi ta question !`
    }

    // Par défaut
    return `Je n'ai pas bien compris ta question. Peux-tu préciser ? Je peux t'aider avec les collectes, le tri, les points de dépôt, les signalements, ou des questions générales sur le recyclage.`
  }

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    setTimeout(() => {
      const response = processQuery(userMessage)
      setMessages(prev => [...prev, { role: 'bot', content: response }])
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-eco-green text-white rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center justify-center z-[9999]"
        style={{ zIndex: 9999 }}
        aria-label="Ouvrir le chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="bg-eco-green text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">Assistant Déchets</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-600 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'bot' && (
                  <div className="w-8 h-8 bg-eco-green rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    m.role === 'user'
                      ? 'bg-eco-green text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-eco-green rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions rapides (affichées uniquement si pas de messages utilisateur récents) */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Suggestions :</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-eco-green hover:text-white hover:border-eco-green transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-eco-green text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TrashChatbot
