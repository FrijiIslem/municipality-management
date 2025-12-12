import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Trash schedule by day of week
const TRASH_SCHEDULE = {
  1: { type: 'organique', label: 'Organique', color: 'green', icon: '🌱', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  2: { type: 'plastique', label: 'Plastique', color: 'blue', icon: '♻️', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  3: { type: 'organique', label: 'Organique', color: 'green', icon: '🌱', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  4: { type: 'mixte', label: 'Mixte', color: 'purple', icon: '🗑️', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
  5: { type: 'métals', label: 'Métaux', color: 'gray', icon: '🔩', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  6: { type: 'organique', label: 'Organique', color: 'green', icon: '🌱', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  0: { type: 'verre', label: 'Verre', color: 'cyan', icon: '🍾', bgColor: 'bg-cyan-100', textColor: 'text-cyan-800' },
}

const getDayName = (dayIndex) => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  return days[dayIndex]
}

const getMonthName = (monthIndex) => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  return months[monthIndex]
}

const getWeekDates = (date) => {
  const week = []
  const startOfWeek = new Date(date)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day
  startOfWeek.setDate(diff)

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek)
    currentDate.setDate(startOfWeek.getDate() + i)
    week.push(currentDate)
  }
  return week
}

const CitoyenCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get today's date for highlighting
  const today = new Date()

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const weekDates = getWeekDates(currentDate)
  const startDate = weekDates[0]
  const endDate = weekDates[6]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-anthracite mb-2">
            Calendrier des collectes
          </h1>
          <p className="text-gray-600">
            Planification hebdomadaire des types de déchets à collecter
          </p>
        </div>
      </div>

      <div className="card">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm bg-eco-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Semaine suivante"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Week Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-anthracite">
            Semaine du {startDate.getDate()} {getMonthName(startDate.getMonth())} au {endDate.getDate()} {getMonthName(endDate.getMonth())} {startDate.getFullYear()}
          </h3>
        </div>

        {/* Week view */}
        <div>
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDates.map((date, index) => {
              const dayOfWeek = date.getDay()
              const trashInfo = TRASH_SCHEDULE[dayOfWeek]
              const isToday = date.toDateString() === today.toDateString()
              const dayName = getDayName(dayOfWeek).substring(0, 3)

              return (
                <div
                  key={index}
                  className={`text-center py-2 rounded-lg border-2 ${
                    isToday
                      ? 'border-eco-green bg-eco-green/10'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    {dayName}
                  </div>
                  <div
                    className={`text-lg font-bold mb-1 ${
                      isToday ? 'text-eco-green' : 'text-gray-700'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className={`text-xs ${trashInfo.textColor}`}>
                    {trashInfo.icon} {trashInfo.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Week days details */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dayOfWeek = date.getDay()
              const trashInfo = TRASH_SCHEDULE[dayOfWeek]
              const isToday = date.toDateString() === today.toDateString()
              const monthName = getMonthName(date.getMonth()).substring(0, 3)

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 min-h-[200px] ${
                    isToday
                      ? 'border-eco-green bg-eco-green/5'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">
                      {date.getDate()} {monthName} {date.getFullYear()}
                    </div>
                    <div
                      className={`flex items-center gap-2 p-2 rounded ${trashInfo.bgColor} ${trashInfo.textColor}`}
                    >
                      <span className="text-xl">{trashInfo.icon}</span>
                      <span className="font-semibold">{trashInfo.label}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-4">
                    <p className="font-medium mb-2">Type de collecte :</p>
                    <p className="text-xs leading-relaxed">
                      {trashInfo.type === 'organique' && 'Déchets organiques et biodégradables'}
                      {trashInfo.type === 'plastique' && 'Déchets en plastique recyclable'}
                      {trashInfo.type === 'mixte' && 'Déchets mixtes et divers'}
                      {trashInfo.type === 'métals' && 'Déchets métalliques recyclables'}
                      {trashInfo.type === 'verre' && 'Déchets en verre recyclable'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-anthracite mb-3">Légende</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.values(TRASH_SCHEDULE)
              .filter((item, index, self) => 
                index === self.findIndex(t => t.type === item.type)
              )
              .map((trashInfo) => (
                <div
                  key={trashInfo.type}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${trashInfo.bgColor}`}>
                    <span>{trashInfo.icon}</span>
                  </div>
                  <span className="text-gray-700">{trashInfo.label}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitoyenCalendar
