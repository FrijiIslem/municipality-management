import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, Droplets, Thermometer } from 'lucide-react'

// Get weather recommendations based on conditions
const getWeatherRecommendations = (weatherData) => {
  const recommendations = []
  
  if (!weatherData) return recommendations

  // Rain recommendations
  if (weatherData.rain || weatherData.weather?.main === 'Rain' || weatherData.weather?.main === 'Drizzle') {
    recommendations.push({
      type: 'rain',
      icon: CloudRain,
      message: 'Évitez de sortir les poubelles non étanches.',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800'
    })
  }

  // Hot weather recommendations
  if (weatherData.temp && weatherData.temp > 25) {
    recommendations.push({
      type: 'heat',
      icon: Sun,
      message: 'Sortir l\'organique juste avant la collecte pour éviter les odeurs.',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800'
    })
  }

  // Very hot weather (heat wave)
  if (weatherData.temp && weatherData.temp > 30) {
    recommendations.push({
      type: 'heatwave',
      icon: AlertTriangle,
      message: 'Forte chaleur : Sortez les déchets tôt le matin ou tard le soir.',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800'
    })
  }

  // Wind recommendations
  if (weatherData.windSpeed && weatherData.windSpeed > 15) {
    recommendations.push({
      type: 'wind',
      icon: Wind,
      message: 'Vent fort : Assurez-vous que les poubelles sont bien fermées.',
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800'
    })
  }

  // Cold weather
  if (weatherData.temp && weatherData.temp < 5) {
    recommendations.push({
      type: 'cold',
      icon: Thermometer,
      message: 'Température basse : Les déchets peuvent geler, sortez-les au dernier moment.',
      color: 'cyan',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-800'
    })
  }

  return recommendations
}

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        // Using OpenWeatherMap API (free tier)
        // Note: In production, you should use your own API key
        // For now, we'll use a mock/demo approach
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo'
        
        // Tunis coordinates
        const lat = 36.8002
        const lon = 10.1858

        if (API_KEY === 'demo') {
          // Mock weather data for demonstration
          setTimeout(() => {
            const mockWeather = {
              temp: 22,
              feelsLike: 24,
              humidity: 65,
              windSpeed: 12,
              weather: {
                main: 'Clear',
                description: 'ciel dégagé',
                icon: '01d'
              },
              rain: false
            }
            setWeatherData(mockWeather)
            setLoading(false)
          }, 500)
        } else {
          // Real API call
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
          )
          
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération de la météo')
          }

          const data = await response.json()
          setWeatherData({
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind?.speed * 3.6 || 0), // Convert m/s to km/h
            weather: {
              main: data.weather[0].main,
              description: data.weather[0].description,
              icon: data.weather[0].icon
            },
            rain: data.rain || false
          })
          setLoading(false)
        }
      } catch (err) {
        console.error('Weather fetch error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const recommendations = getWeatherRecommendations(weatherData)

  if (loading) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-blue-700 mb-1">
              Prévision météo
            </h3>
            <p className="text-sm text-blue-600 opacity-80">Chargement...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-blue-700 mb-1">
              Prévision météo
            </h3>
            <p className="text-sm text-blue-600 opacity-80">Données non disponibles</p>
          </div>
        </div>
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg text-center text-blue-600 text-sm">
          Impossible de charger les données météo
        </div>
      </div>
    )
  }

  const getWeatherIcon = () => {
    if (weatherData.weather?.main === 'Rain' || weatherData.rain) {
      return <CloudRain className="w-8 h-8 text-blue-600" />
    }
    if (weatherData.weather?.main === 'Clear') {
      return <Sun className="w-8 h-8 text-yellow-500" />
    }
    return <Cloud className="w-8 h-8 text-gray-600" />
  }

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-blue-700 mb-1">
            Prévision météo
          </h3>
          <p className="text-sm text-blue-600 opacity-80">Conditions actuelles</p>
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
          {getWeatherIcon()}
        </div>
      </div>

      {/* Weather Info */}
      <div className="mb-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-4xl font-bold text-blue-700 group-hover:scale-110 transition-transform duration-300">
              {weatherData.temp}°C
            </div>
            <div className="text-sm text-blue-600 capitalize font-medium mt-1">
              {weatherData.weather?.description || 'Conditions météo'}
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-white/50 px-2 py-1 rounded-lg">
              <Droplets className="w-4 h-4" />
              <span className="font-medium">{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-white/50 px-2 py-1 rounded-lg">
              <Wind className="w-4 h-4" />
              <span className="font-medium">{weatherData.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-anthracite mb-2">Recommandations</h4>
          {recommendations.map((rec, index) => {
            const Icon = rec.icon
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${rec.bgColor} ${rec.borderColor} ${rec.textColor}`}
              >
                <div className="flex items-start gap-2">
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{rec.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <Sun className="w-5 h-5" />
            <p className="text-sm font-medium">Conditions favorables pour la collecte</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherWidget

