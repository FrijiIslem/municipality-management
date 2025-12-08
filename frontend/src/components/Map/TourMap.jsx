import { useMemo } from 'react'
import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'

const libraries = ['places', 'geometry']

const containerColors = {
  VIDE: '#4CAF50',      // Green - Empty
  FAIBLE: '#FFEB3B',    // Yellow - Low
  MOYEN: '#FF9800',     // Orange - Medium
  PLEIN: '#F44336',     // Red - Full
}

const TourMap = ({ 
  containers = [], 
  route = [], 
  center = { lat: 36.8065, lng: 10.1815 }, // Default: Tunis
  zoom = 13 
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }),
    []
  )

  const getContainerColor = (etatRemplissage) => {
    return containerColors[etatRemplissage] || containerColors.VIDE
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-light-gray rounded-lg">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-anthracite">Erreur de chargement de la carte</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-light-gray rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green mx-auto mb-4"></div>
          <p className="text-anthracite">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-card">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        {/* Route polyline */}
        {route.length > 0 && (
          <Polyline
            path={route}
            options={{
              strokeColor: '#2196F3',
              strokeOpacity: 0.8,
              strokeWeight: 4,
              icons: [
                {
                  icon: {
                    path: window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW,
                    scale: 4,
                    strokeColor: '#2196F3',
                  },
                  offset: '100%',
                  repeat: '20px',
                },
              ],
            }}
          />
        )}

        {/* Container markers */}
        {containers.map((container) => (
          <Marker
            key={container.id}
            position={{
              lat: container.localisation?.latitude || center.lat,
              lng: container.localisation?.longitude || center.lng,
            }}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: 10,
              fillColor: getContainerColor(container.etatRemplissage),
              fillOpacity: 0.8,
              strokeColor: '#fff',
              strokeWeight: 2,
            }}
            title={`Conteneur ${container.id} - ${container.etatRemplissage}`}
          />
        ))}
      </GoogleMap>
    </div>
  )
}

export default TourMap

