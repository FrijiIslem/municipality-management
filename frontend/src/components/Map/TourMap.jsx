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
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
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

  // Si pas de clé API, afficher un message informatif
  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-light-gray rounded-lg">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-anthracite font-semibold mb-2">Clé API Google Maps requise</p>
          <p className="text-sm text-gray-600 mb-4">
            Veuillez configurer VITE_GOOGLE_MAPS_API_KEY dans le fichier .env
          </p>
          <a
            href="https://console.cloud.google.com/google/maps-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-eco-green hover:underline text-sm"
          >
            Obtenir une clé API →
          </a>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-light-gray rounded-lg">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-anthracite font-semibold mb-2">Erreur de chargement de la carte</p>
          <p className="text-sm text-gray-600">
            {loadError.message || 'Vérifiez votre clé API Google Maps'}
          </p>
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
        {containers?.filter(container => {
          const lat = parseFloat(container?.localisation?.latitude);
          const lng = parseFloat(container?.localisation?.longitude);
          return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng);
        }).map((container) => {
          const lat = parseFloat(container.localisation.latitude);
          const lng = parseFloat(container.localisation.longitude);
          
          return (
          <Marker
            key={container.id}
            position={{ lat, lng }}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: 10,
              fillColor: getContainerColor(container.etatRemplissage || 'VIDE'),
              fillOpacity: 0.8,
              strokeColor: '#fff',
              strokeWeight: 2,
            }}
            title={`Conteneur ${container.id} - ${container.etatRemplissage}`}
          />
        );
        })}
      </GoogleMap>
    </div>
  )
}

export default TourMap

