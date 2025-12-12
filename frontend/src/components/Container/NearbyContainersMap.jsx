import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { containerAPI } from '../../services/api'
import ContainerMap from '../Map/ContainerMap'
import { MapPin, AlertCircle } from 'lucide-react'

const TUNIS_CENTER = [36.8002068, 10.1857757]
const TUNIS_BOUNDS = [[36.6925111, 10.0037899], [36.9430196, 10.3548094]]

// Geocoding cache
const geocodingCache = new Map()

// Geocode address using Nominatim
const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') return null
  
  if (geocodingCache.has(address)) {
    return geocodingCache.get(address)
  }

  try {
    const encodedAddress = encodeURIComponent(address + ', Tunis, Tunisia')
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=tn`,
      {
        headers: {
          'User-Agent': 'Urbanova-Waste-Management/1.0'
        }
      }
    )
    
    if (!response.ok) return null

    const data = await response.json()
    
    if (data && Array.isArray(data) && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      
      if (!isFinite(lat) || !isFinite(lng)) return null
      
      const result = { lat, lng, adresse: address }
      geocodingCache.set(address, result)
      await new Promise(resolve => setTimeout(resolve, 200))
      return result
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const NearbyContainersMap = ({ userAddress }) => {
  const [nearbyContainers, setNearbyContainers] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [isGeocoding, setIsGeocoding] = useState(false)

  const { data: containers = [], isLoading } = useQuery('containers', containerAPI.getAll)

  // Geocode user address
  useEffect(() => {
    const geocodeUserAddress = async () => {
      if (userAddress) {
        setIsGeocoding(true)
        const geocoded = await geocodeAddress(userAddress)
        if (geocoded) {
          setUserLocation([geocoded.lat, geocoded.lng])
        } else {
          setUserLocation(TUNIS_CENTER)
        }
        setIsGeocoding(false)
      } else {
        setUserLocation(TUNIS_CENTER)
      }
    }
    
    geocodeUserAddress()
  }, [userAddress])

  // Parse location from container
  const parseLocation = async (loc) => {
    if (!loc) return null
    
    let value = loc
    
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          value = JSON.parse(value)
        } catch (e) {
          // Continue to geocoding
        }
      }
      
      if (typeof value === 'string') {
        const geocoded = await geocodeAddress(value)
        if (geocoded) return geocoded
        return null
      }
    }
    
    if (typeof value !== 'object' || value === null) return null
    
    const latRaw = value.latitude ?? value.lat ?? value.latitud
    const lngRaw = value.longitude ?? value.lng ?? value.longitud ?? value.lon
    
    if (latRaw !== undefined && lngRaw !== undefined) {
      const lat = parseFloat(latRaw)
      const lng = parseFloat(lngRaw)
      
      if (isFinite(lat) && isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { 
          lat, 
          lng, 
          adresse: value.adresse ?? value.address ?? value.adr ?? null 
        }
      }
    }
    
    const address = value.adresse ?? value.address ?? value.adr ?? (typeof loc === 'string' ? loc : null)
    if (address && typeof address === 'string') {
      const geocoded = await geocodeAddress(address)
      if (geocoded) return geocoded
    }
    
    return null
  }

  // Process containers
  useEffect(() => {
    const processContainers = async () => {
      if (containers.length === 0 || !userLocation) {
        setNearbyContainers([])
        return
      }

      setIsGeocoding(true)
      
      try {
        const batchSize = 5
        const processedContainers = []
        
        for (let i = 0; i < containers.length; i += batchSize) {
          const batch = containers.slice(i, i + batchSize)
          const batchResults = await Promise.all(
            batch.map(async (container) => {
              const loc = await parseLocation(container.localisation)
              if (!loc) return null

              const containerData = {
                ...container,
                localisation: {
                  latitude: loc.lat,
                  longitude: loc.lng,
                  lat: loc.lat,
                  lng: loc.lng,
                  adresse: loc.adresse || (typeof container.localisation === 'string' ? container.localisation : null)
                },
                position: { lat: loc.lat, lng: loc.lng },
                distance: calculateDistance(
                  userLocation[0],
                  userLocation[1],
                  loc.lat,
                  loc.lng
                )
              }

              return containerData
            })
          )
          
          processedContainers.push(...batchResults.filter(Boolean))
          
          if (i + batchSize < containers.length) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }

        // Sort by distance and show nearest 20
        processedContainers.sort((a, b) => a.distance - b.distance)
        const nearest = processedContainers.slice(0, 20)
        
        setNearbyContainers(nearest)
      } catch (error) {
        console.error('Error processing containers:', error)
        setNearbyContainers([])
      } finally {
        setIsGeocoding(false)
      }
    }

    if (containers.length > 0 && userLocation) {
      processContainers()
    } else if (containers.length > 0) {
      // Show all containers if no user location - process async
      const processAllContainers = async () => {
        setIsGeocoding(true)
        try {
          const batchSize = 5
          const processedContainers = []
          
          for (let i = 0; i < containers.length; i += batchSize) {
            const batch = containers.slice(i, i + batchSize)
            const batchResults = await Promise.all(
              batch.map(async (container) => {
                const loc = await parseLocation(container.localisation)
                if (!loc) return null
                return {
                  ...container,
                  localisation: {
                    latitude: loc.lat,
                    longitude: loc.lng,
                    lat: loc.lat,
                    lng: loc.lng,
                    adresse: loc.adresse || (typeof container.localisation === 'string' ? container.localisation : null)
                  },
                  position: { lat: loc.lat, lng: loc.lng },
                  distance: null
                }
              })
            )
            
            processedContainers.push(...batchResults.filter(Boolean))
            
            if (i + batchSize < containers.length) {
              await new Promise(resolve => setTimeout(resolve, 300))
            }
          }
          
          setNearbyContainers(processedContainers)
        } catch (error) {
          console.error('Error processing all containers:', error)
          setNearbyContainers([])
        } finally {
          setIsGeocoding(false)
        }
      }
      
      processAllContainers()
    }
  }, [containers, userLocation])

  if (isLoading || isGeocoding) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
        <p className="text-gray-600 text-sm">
          {isGeocoding ? 'Chargement des conteneurs proches...' : 'Chargement...'}
        </p>
      </div>
    )
  }

  const validContainers = nearbyContainers.filter(c => {
    if (!c || !c.localisation || typeof c.localisation === 'string') return false
    return (c.localisation.latitude !== undefined || c.localisation.lat !== undefined) &&
           (c.localisation.longitude !== undefined || c.localisation.lng !== undefined)
  })

  return (
    <div className="card bg-gradient-to-br from-green-50/50 to-white border-2 border-green-200 shadow-lg">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-anthracite">
              Conteneurs proches
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {userAddress
                ? `Affichage des ${validContainers.length} conteneurs les plus proches de votre adresse`
                : 'Tous les conteneurs disponibles'}
            </p>
          </div>
        </div>
      </div>

      {!userAddress && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Information</p>
            <p>
              Ajoutez votre adresse dans votre profil pour voir les conteneurs les plus proches
              de chez vous avec leur distance.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-inner overflow-hidden border-2 border-gray-200" style={{ height: '500px' }}>
        {validContainers.length > 0 ? (
          <ContainerMap
            containers={validContainers}
            selectedPosition={userLocation ? { lat: userLocation[0], lng: userLocation[1] } : null}
            bounds={TUNIS_BOUNDS}
            centerOverride={userLocation ? [userLocation[0], userLocation[1]] : TUNIS_CENTER}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Aucun conteneur disponible</p>
          </div>
        )}
      </div>

      {userAddress && validContainers.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
          <p className="text-sm text-green-800 font-medium">
            <span className="text-base font-bold">{validContainers.length}</span> conteneur{validContainers.length > 1 ? 's' : ''} trouvé{validContainers.length > 1 ? 's' : ''} près de votre adresse
            {validContainers[0]?.distance && (
              <span className="ml-2 text-green-700">
                (le plus proche à {validContainers[0].distance.toFixed(2)} km)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default NearbyContainersMap

