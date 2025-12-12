import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { containerAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { MapPin, Check, AlertCircle, X } from 'lucide-react'
import ContainerMap from '../Map/ContainerMap'
import useAuthStore from '../../store/authStore'

const TUNIS_CENTER = [36.8002068, 10.1857757]
const TUNIS_BOUNDS = [[36.6925111, 10.0037899], [36.9430196, 10.3548094]]

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in km
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

// Geocoding cache to avoid multiple requests for the same address
const geocodingCache = new Map()

// Geocode address using Nominatim (OpenStreetMap) - free and no API key needed
const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    console.warn('geocodeAddress: Invalid address:', address)
    return null
  }
  
  // Check cache first
  if (geocodingCache.has(address)) {
    const cached = geocodingCache.get(address)
    console.log('geocodeAddress: Using cached result for:', address)
    return cached
  }

  try {
    // Use Nominatim API (OpenStreetMap) - free geocoding service
    const encodedAddress = encodeURIComponent(address + ', Tunis, Tunisia')
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=tn`
    
    console.log('geocodeAddress: Requesting geocoding for:', address)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Urbanova-Waste-Management/1.0' // Required by Nominatim
      }
    })
    
    if (!response.ok) {
      console.warn('geocodeAddress: HTTP error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    
    if (data && Array.isArray(data) && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      
      if (!isFinite(lat) || !isFinite(lng)) {
        console.warn('geocodeAddress: Invalid coordinates from API:', data[0])
        return null
      }
      
      const result = {
        lat,
        lng,
        adresse: address
      }
      
      // Cache the result
      geocodingCache.set(address, result)
      console.log('geocodeAddress: Successfully geocoded:', address, '->', result)
      
      // Add a small delay to respect Nominatim's rate limit (1 request per second)
      // Reduced delay for better UX - Nominatim allows bursts
      await new Promise(resolve => setTimeout(resolve, 200))
      
      return result
    } else {
      console.warn('geocodeAddress: No results from API for:', address)
      return null
    }
  } catch (error) {
    console.error('geocodeAddress: Error geocoding address:', address, error)
    return null
  }
}

const ContainerSelector = ({ onSelect, onCancel, userAddress, userContainerId }) => {
  const { user, setUser } = useAuthStore()
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [nearbyContainers, setNearbyContainers] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [geocodingInProgress, setGeocodingInProgress] = useState(false)
  const queryClient = useQueryClient()

  const { data: containers = [], isLoading } = useQuery('containers', containerAPI.getAll)

  const linkMutation = useMutation(
    ({ containerId, citoyenDTO }) => containerAPI.linkCitoyen(containerId, citoyenDTO),
    {
      onSuccess: (data) => {
        toast.success('Conteneur sélectionné avec succès !')
        // Update user with container info
        if (user) {
          setUser({ ...user, conteneurId: selectedContainer?.id })
        }
        queryClient.invalidateQueries('containers')
        if (onSelect) onSelect(selectedContainer)
      },
      onError: (error) => {
        toast.error(error.message || 'Erreur lors de la sélection du conteneur')
      },
    }
  )

  // Parse location from container data (supports coordinates or address string)
  const parseLocation = async (loc) => {
    if (!loc) {
      console.warn('parseLocation: No location provided')
      return null
    }
    
    let value = loc
    
    // If it's a string, try to parse it as JSON first
    if (typeof value === 'string') {
      // Check if it's a JSON string
      const trimmed = value.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          value = JSON.parse(value)
        } catch (e) {
          console.warn('parseLocation: Failed to parse JSON string:', value)
          // Continue to try geocoding
        }
      }
      
      // If it's still a string (not JSON), it's likely an address - geocode it
      if (typeof value === 'string') {
        console.log('parseLocation: Geocoding address string:', value)
        const geocoded = await geocodeAddress(value)
        if (geocoded) {
          console.log('parseLocation: Geocoding successful:', geocoded)
          return geocoded
        } else {
          console.warn('parseLocation: Geocoding failed for:', value)
          return null
        }
      }
    }
    
    // Now value should be an object
    if (typeof value !== 'object' || value === null) {
      console.warn('parseLocation: Invalid location format:', loc)
      return null
    }
    
    // Try different property names for latitude and longitude
    const latRaw = value.latitude ?? value.lat ?? value.latitud
    const lngRaw = value.longitude ?? value.lng ?? value.longitud ?? value.lon
    
    // If we have coordinates, use them
    if (latRaw !== undefined && lngRaw !== undefined) {
      const lat = parseFloat(latRaw)
      const lng = parseFloat(lngRaw)
      
      if (isFinite(lat) && isFinite(lng)) {
        // Validate coordinates are in reasonable range
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { 
            lat, 
            lng, 
            adresse: value.adresse ?? value.address ?? value.adr ?? null 
          }
        } else {
          console.warn('parseLocation: Coordinates out of range:', { lat, lng })
        }
      } else {
        console.warn('parseLocation: Invalid coordinates:', { latRaw, lngRaw })
      }
    }
    
    // If we have an address but no coordinates, try to geocode
    const address = value.adresse ?? value.address ?? value.adr ?? (typeof loc === 'string' ? loc : null)
    if (address && typeof address === 'string') {
      console.log('parseLocation: Geocoding address from object:', address)
      const geocoded = await geocodeAddress(address)
      if (geocoded) {
        return geocoded
      }
    }
    
    console.warn('parseLocation: Could not parse location:', loc)
    return null
  }

  // Get user location from address using geocoding
  useEffect(() => {
    const geocodeUserAddress = async () => {
      if (userAddress && !userLocation) {
        console.log('Geocoding user address:', userAddress)
        const geocoded = await geocodeAddress(userAddress)
        if (geocoded) {
          setUserLocation([geocoded.lat, geocoded.lng])
        } else {
          // Fallback to default location
          setUserLocation(TUNIS_CENTER)
        }
      } else if (!userAddress) {
        // If no address, still set a default location to show containers
        setUserLocation(TUNIS_CENTER)
      }
    }
    
    geocodeUserAddress()
  }, [userAddress])

  // Find nearby containers - ALWAYS show containers
  useEffect(() => {
    const processContainers = async () => {
      console.log('ContainerSelector: Processing containers', { 
        totalContainers: containers.length, 
        hasUserLocation: !!userLocation,
        userAddress 
      })
      
      if (containers.length === 0) {
        console.log('ContainerSelector: No containers available')
        setNearbyContainers([])
        return
      }

      setGeocodingInProgress(true)
      
      try {
        // Process containers with async geocoding
        // Process in batches to avoid overwhelming the geocoding service
        const batchSize = 5
        const processedContainers = []
        
        for (let i = 0; i < containers.length; i += batchSize) {
          const batch = containers.slice(i, i + batchSize)
          const batchResults = await Promise.all(
            batch.map(async (container) => {
              const loc = await parseLocation(container.localisation)
              if (!loc) {
                console.warn('Container without valid location:', container.id, container.localisation)
                return null
              }

            // Ensure localisation is in the correct format for ContainerMap
            // Always create a new object with coordinates, never keep the original string
            const originalLoc = container.localisation
            const address = loc.adresse || 
                          (typeof originalLoc === 'object' && originalLoc !== null 
                            ? (originalLoc.adresse || originalLoc.address || originalLoc.adr)
                            : (typeof originalLoc === 'string' ? originalLoc : null))
            
            // Create localisation object that ContainerMap can parse
            // ContainerMap expects: { latitude, longitude, lat, lng, adresse } or a parseable string
            // Keep coordinates as numbers, not strings
            const localisationObj = {
              latitude: loc.lat,
              longitude: loc.lng,
              lat: loc.lat,
              lng: loc.lng,
              adresse: address || ''
            }
            
            const containerData = {
              ...container,
              localisation: localisationObj,
              position: { lat: loc.lat, lng: loc.lng },
              distance: null,
            }
            
            // Debug log for first container
            if (containers.indexOf(container) === 0) {
              console.log('First container processed:', {
                id: containerData.id,
                localisationType: typeof containerData.localisation,
                localisation: containerData.localisation,
                hasLat: !!containerData.localisation.latitude,
                hasLng: !!containerData.localisation.longitude
              })
            }

            // Calculate distance if user location is available
            if (userLocation) {
              containerData.distance = calculateDistance(
                userLocation[0],
                userLocation[1],
                loc.lat,
                loc.lng
              )
            }

              return containerData
            })
          )
          
          processedContainers.push(...batchResults)
          
          // Small delay between batches to respect rate limits
          if (i + batchSize < containers.length) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }

        // Filter out null values and ensure all have valid localisation objects
        const validContainers = processedContainers.filter(container => {
          if (!container) return false
          
          // Ensure localisation is an object with coordinates
          const loc = container.localisation
          if (!loc || typeof loc !== 'object') {
            console.warn('Filtering container without object localisation:', container.id, loc)
            return false
          }
          
          const hasCoords = (loc.latitude !== undefined || loc.lat !== undefined) &&
                           (loc.longitude !== undefined || loc.lng !== undefined)
          
          if (!hasCoords) {
            console.warn('Filtering container without coordinates:', container.id, loc)
            return false
          }
          
          return true
        })
        
        console.log('ContainerSelector: Processed containers', {
          total: containers.length,
          valid: validContainers.length,
          invalid: containers.length - validContainers.length
        })
        
        // Debug: Check format of first container
        if (validContainers.length > 0) {
          console.log('Sample valid container format:', {
            id: validContainers[0].id,
            localisationType: typeof validContainers[0].localisation,
            localisation: validContainers[0].localisation,
            hasLat: !!(validContainers[0].localisation?.latitude || validContainers[0].localisation?.lat),
            hasLng: !!(validContainers[0].localisation?.longitude || validContainers[0].localisation?.lng)
          })
        } else {
          console.warn('ContainerSelector: No valid containers after processing!')
        }

        // Sort by distance if available, otherwise show all
        if (userLocation && userAddress) {
          validContainers.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0
            if (a.distance === null) return 1
            if (b.distance === null) return -1
            return a.distance - b.distance
          })
          // Show up to 20 nearest containers if user has address
          const limited = validContainers.slice(0, 20)
          console.log('ContainerSelector: Showing nearest containers', limited.length)
          
          // Double-check format before setting
          const verified = limited.map(c => {
            if (typeof c.localisation === 'string') {
              console.error('ERROR: Container still has string localisation!', c.id, c.localisation)
              return null
            }
            return c
          }).filter(Boolean)
          
          setNearbyContainers(verified)
        } else {
          // Show all containers if no address
          console.log('ContainerSelector: Showing all containers', validContainers.length)
          
          // Double-check format before setting
          const verified = validContainers.map(c => {
            if (typeof c.localisation === 'string') {
              console.error('ERROR: Container still has string localisation!', c.id, c.localisation)
              return null
            }
            return c
          }).filter(Boolean)
          
          setNearbyContainers(verified)
        }
      } catch (error) {
        console.error('Error processing containers:', error)
        setNearbyContainers([])
      } finally {
        setGeocodingInProgress(false)
      }
    }

    processContainers()
  }, [containers, userLocation, userAddress])

  const handleContainerClick = useCallback((container) => {
    setSelectedContainer(container)
  }, [])

  const handleConfirm = () => {
    if (!selectedContainer || !user) {
      toast.error('Veuillez sélectionner un conteneur')
      return
    }

    const citoyenDTO = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      numeroTel: user.numeroTel,
      adresse: user.adresse || userAddress,
    }

    linkMutation.mutate({
      containerId: selectedContainer.id,
      citoyenDTO,
    })
  }

  if (isLoading || geocodingInProgress) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
        <p className="text-gray-600 text-sm">
          {geocodingInProgress ? 'Géocodage des adresses en cours...' : 'Chargement des conteneurs...'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-heading font-semibold text-anthracite mb-1">
              Sélectionner un conteneur
            </h3>
            <p className="text-sm text-gray-600">
              {userAddress
                ? 'Sélectionnez un conteneur proche de votre adresse sur la carte'
                : 'Sélectionnez un conteneur sur la carte'}
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!userAddress && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Information</p>
              <p>
                Tous les conteneurs sont affichés. Ajoutez votre adresse dans votre profil pour voir
                les conteneurs les plus proches de chez vous avec leur distance.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '400px' }}>
          {nearbyContainers.length > 0 ? (
            <ContainerMap
              containers={(() => {
                // Filter and log containers before passing to ContainerMap
                const filtered = nearbyContainers.filter(c => {
                  if (!c || !c.localisation) {
                    console.warn('Filtering container: missing localisation', c?.id)
                    return false
                  }
                  
                  // Reject if localisation is still a string
                  if (typeof c.localisation === 'string') {
                    console.error('ERROR: Container has string localisation!', c.id, c.localisation)
                    return false
                  }
                  
                  // Ensure localisation is an object with coordinates
                  if (typeof c.localisation !== 'object' || c.localisation === null) {
                    console.warn('Filtering container: localisation is not an object', c.id, typeof c.localisation)
                    return false
                  }
                  
                  const hasCoords = (c.localisation.latitude !== undefined || c.localisation.lat !== undefined) &&
                                   (c.localisation.longitude !== undefined || c.localisation.lng !== undefined)
                  
                  if (!hasCoords) {
                    console.warn('Filtering container: missing coordinates', c.id, c.localisation)
                    return false
                  }
                  
                  return true
                })
                
                console.log('ContainerSelector: Passing to ContainerMap:', {
                  total: nearbyContainers.length,
                  filtered: filtered.length,
                  firstContainer: filtered[0] ? {
                    id: filtered[0].id,
                    localisationType: typeof filtered[0].localisation,
                    localisation: filtered[0].localisation
                  } : null
                })
                
                return filtered
              })()}
              onContainerClick={handleContainerClick}
              selectedContainer={selectedContainer}
              selectedPosition={
                selectedContainer?.position
                  ? { lat: selectedContainer.position.lat, lng: selectedContainer.position.lng }
                  : userLocation
                  ? { lat: userLocation[0], lng: userLocation[1] }
                  : null
              }
              bounds={TUNIS_BOUNDS}
              centerOverride={userLocation ? [userLocation[0], userLocation[1]] : TUNIS_CENTER}
            />
          ) : !geocodingInProgress ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Aucun conteneur disponible avec des coordonnées valides</p>
            </div>
          ) : null}
        </div>

        {selectedContainer && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-eco-green" />
                <h4 className="font-semibold text-anthracite">Conteneur sélectionné</h4>
              </div>
              {selectedContainer.distance !== null && (
                <span className="text-sm text-gray-600">
                  {selectedContainer.distance.toFixed(2)} km
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">ID: </span>
                <span className="font-medium">{selectedContainer.id?.substring(0, 8)}</span>
              </div>
              {selectedContainer.localisation?.adresse && (
                <div>
                  <span className="text-gray-600">Adresse: </span>
                  <span className="font-medium">
                    {typeof selectedContainer.localisation === 'string'
                      ? JSON.parse(selectedContainer.localisation)?.adresse
                      : selectedContainer.localisation?.adresse || 'Non spécifiée'}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-600">État: </span>
                <span className="font-medium capitalize">
                  {selectedContainer.etatRemplissage || 'Non spécifié'}
                </span>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={linkMutation.isLoading}
              className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {linkMutation.isLoading ? 'Enregistrement...' : 'Confirmer la sélection'}
            </button>
          </div>
        )}

        {nearbyContainers.length === 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
            <p>Aucun conteneur disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContainerSelector

