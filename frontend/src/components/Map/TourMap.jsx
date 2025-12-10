import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuration de l'icône par défaut
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const containerColors = {
  VIDE: '#4CAF50',      // Green - Empty
  FAIBLE: '#FFEB3B',    // Yellow - Low
  MOYEN: '#FF9800',     // Orange - Medium
  PLEIN: '#F44336',     // Red - Full
};

const TourMap = ({ 
  containers = [], 
  route = [], 
  itineraire = null, // JSON string de l'itinéraire optimisé
  center = [34.7406, 10.7603], // [lat, lng] format pour Leaflet
  zoom = 13,
  bounds = null,
  centerOverride = null
}) => {
  const SFAX_CENTER = [34.7406, 10.7603];
  const TUNIS_CENTER = [36.8065, 10.1815];
  const SFAX_BOUNDS = [[34.62, 10.65], [34.86, 10.88]];
  const TUNIS_BOUNDS = [[36.6925111, 10.0037899], [36.9430196, 10.3548094]];
  
  // Normaliser le centre pour s'assurer qu'il est valide
  const normalizeCenter = (c) => {
    if (!c) return TUNIS_CENTER
    if (Array.isArray(c) && c.length === 2) {
      const [lat, lng] = c
      if (typeof lat === 'number' && typeof lng === 'number' && 
          !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
        return [lat, lng]
      }
    }
    // Si c'est un objet {lat, lng}
    if (typeof c === 'object' && c.lat !== undefined && c.lng !== undefined) {
      const lat = parseFloat(c.lat)
      const lng = parseFloat(c.lng)
      if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
        return [lat, lng]
      }
    }
    return TUNIS_CENTER
  }
  
  const BOUNDS = bounds || TUNIS_BOUNDS;
  const CENTER = normalizeCenter(centerOverride || center);
  
  // Parser l'itinéraire JSON si fourni
  let parsedItineraire = [];
  if (itineraire) {
    try {
      parsedItineraire = typeof itineraire === 'string' ? JSON.parse(itineraire) : itineraire;
    } catch (e) {
      console.warn('Erreur lors du parsing de l\'itinéraire:', e);
    }
  }

  // Convertir les conteneurs au format attendu par Leaflet
  const parseContainerLocation = (container) => {
    let lat, lng;
    
    // Si localisation est un objet
    if (container?.localisation && typeof container.localisation === 'object') {
      lat = parseFloat(container.localisation.latitude || container.localisation.lat);
      lng = parseFloat(container.localisation.longitude || container.localisation.lng);
    }
    // Si localisation est une string JSON
    else if (container?.localisation && typeof container.localisation === 'string') {
      try {
        const loc = JSON.parse(container.localisation);
        lat = parseFloat(loc.latitude || loc.lat);
        lng = parseFloat(loc.longitude || loc.lng);
      } catch (e) {
        return null;
      }
    }
    
    if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
      return null;
    }
    
    return { lat, lng };
  };

  const containerMarkers = containers
    .map(container => {
      const pos = parseContainerLocation(container);
      if (!pos) return null;
      
      return {
        ...container,
        position: [pos.lat, pos.lng]
      };
    })
    .filter(Boolean);

  // Construire le chemin optimisé depuis l'itinéraire ou les conteneurs
  let routePath = [];
  
  if (parsedItineraire.length > 0) {
    // Utiliser l'itinéraire optimisé depuis le JSON
    routePath = parsedItineraire
      .map(point => {
        const lat = parseFloat(point.latitude || point.lat);
        const lng = parseFloat(point.longitude || point.lng);
        if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
          return null;
        }
        return [lat, lng];
      })
      .filter(Boolean);
  } else if (route.length > 0) {
    // Utiliser le route fourni
    routePath = route.map(point => ({
      lat: parseFloat(point.lat || point.latitude || point[0]),
      lng: parseFloat(point.lng || point.longitude || point[1])
    }))
    .filter(point => !isNaN(point.lat) && !isNaN(point.lng))
    .map(point => [point.lat, point.lng]);
  } else if (containerMarkers.length > 0) {
    // Utiliser l'ordre des conteneurs comme chemin
    routePath = containerMarkers.map(c => c.position);
  }

  // Fonction pour obtenir la couleur en fonction de l'état de remplissage
  const getContainerColor = (etatRemplissage) => {
    return containerColors[etatRemplissage] || containerColors.VIDE;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={CENTER}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1.0}
        whenCreated={(map) => {
          map.setMaxBounds(BOUNDS);
          const minZ = map.getBoundsZoom(L.latLngBounds(BOUNDS), true);
          map.setMinZoom(minZ);
        }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marqueurs des conteneurs */}
        {containerMarkers.map((container, index) => (
          <Marker 
            key={container.id || index}
            position={container.position}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  background-color: ${getContainerColor(container.etatRemplissage)}; 
                  width: 20px; 
                  height: 20px; 
                  border-radius: 50%; 
                  border: 2px solid white;
                  box-shadow: 0 0 5px rgba(0,0,0,0.3);
                  transform: translate(-50%, -50%);
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Conteneur {container.id}</div>
                <div>État: {container.etatRemplissage || 'Non spécifié'}</div>
                {container.localisation?.adresse && (
                  <div className="text-gray-600">{container.localisation.adresse}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Ligne d'itinéraire */}
        {routePath.length > 1 && (
          <Polyline 
            positions={routePath}
            pathOptions={{ 
              color: '#3b82f6', 
              weight: 4,
              opacity: 0.8,
              dashArray: '5, 5'
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TourMap;
