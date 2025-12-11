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
  vide: '#4CAF50',      // Green - Empty
  VIDE: '#4CAF50',      // Green - Empty (uppercase)
  faible: '#FFEB3B',    // Yellow - Low
  FAIBLE: '#FFEB3B',    // Yellow - Low (uppercase)
  moyen: '#FF9800',     // Orange - Medium
  MOYEN: '#FF9800',     // Orange - Medium (uppercase)
  saturee: '#F44336',   // Red - Full
  PLEIN: '#F44336',     // Red - Full (uppercase)
  SATUREE: '#F44336',   // Red - Full (uppercase)
};

// Fonction pour obtenir la couleur en fonction de l'état de remplissage
const getContainerColor = (etatRemplissage) => {
  if (!etatRemplissage) return containerColors.vide;
  const key = etatRemplissage.toLowerCase();
  return containerColors[key] || containerColors[etatRemplissage] || containerColors.vide;
};

// Icônes/Logos pour les conteneurs
const getContainerIcon = (etatRemplissage) => {
  const iconMap = {
    vide: '🗑️',
    VIDE: '🗑️',
    faible: '⚠️',
    FAIBLE: '⚠️',
    moyen: '🟠',
    MOYEN: '🟠',
    saturee: '🔴',
    SATUREE: '🔴',
    PLEIN: '🔴',
  };
  if (!etatRemplissage) return '🗑️';
  const key = etatRemplissage.toLowerCase();
  return iconMap[key] || iconMap[etatRemplissage] || '🗑️';
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
        position: [pos.lat, pos.lng],
        // S'assurer que l'état de remplissage est disponible
        etatRemplissage: container.etatRemplissage || 'vide'
      };
    })
    .filter(Boolean);

  // Construire le chemin optimisé depuis l'itinéraire ou les conteneurs
  // Priorité: route API (avec géométrie des rues) > itinéraire JSON > conteneurs
  let routePath = [];
  
  if (route.length > 0) {
    console.log('=== UTILISATION ROUTE API ===');
    console.log('Nombre de points reçus:', route.length);
    console.log('Premier point:', route[0]);
    console.log('Dernier point:', route[route.length - 1]);
    
    // Utiliser la route détaillée depuis l'API (contient la géométrie des rues réelles)
    routePath = route.map(point => {
      // Le point peut être un objet {lat, lng} ou un tableau [lat, lng]
      let lat, lng;
      if (Array.isArray(point)) {
        lat = parseFloat(point[0]);
        lng = parseFloat(point[1]);
      } else if (typeof point === 'object') {
        lat = parseFloat(point.lat || point.latitude);
        lng = parseFloat(point.lng || point.longitude);
      } else {
        return null;
      }
      
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        return null;
      }
      return [lat, lng];
    })
    .filter(Boolean);
    
    console.log('RoutePath final:', routePath.length, 'points');
    console.log('Premier point routePath:', routePath[0]);
    console.log('Dernier point routePath:', routePath[routePath.length - 1]);
  } else if (parsedItineraire.length > 0) {
    console.log('=== UTILISATION ITINERAIRE JSON (fallback) ===');
    // Utiliser l'itinéraire optimisé depuis le JSON (fallback)
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
  } else if (containerMarkers.length > 0) {
    // Utiliser l'ordre des conteneurs comme chemin (dernier recours)
    routePath = containerMarkers.map(c => c.position);
  }

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
        
        {/* Marqueurs des conteneurs avec logos et couleurs */}
        {containerMarkers.map((container, index) => {
          const color = getContainerColor(container.etatRemplissage);
          const icon = getContainerIcon(container.etatRemplissage);
          // Utiliser une clé unique incluant l'état pour forcer la recréation du marqueur
          const markerKey = `${container.id}-${container.etatRemplissage || 'vide'}-${index}`;
          return (
            <Marker 
              key={markerKey}
              position={container.position}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `
                  <div style="
                    background-color: ${color}; 
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%; 
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transform: translate(-50%, -50%);
                  ">${icon}</div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              })}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold text-lg mb-1">
                    {icon} Conteneur {container.id}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">État:</span>{' '}
                    <span style={{ color: color }} className="font-semibold">
                      {container.etatRemplissage === 'vide' || container.etatRemplissage === 'VIDE' 
                        ? 'Vide' 
                        : container.etatRemplissage === 'moyen' || container.etatRemplissage === 'MOYEN'
                        ? 'Moyen'
                        : container.etatRemplissage === 'saturee' || container.etatRemplissage === 'SATUREE'
                        ? 'Saturé'
                        : container.etatRemplissage || 'Non spécifié'}
                    </span>
                  </div>
                  {container.localisation?.adresse && (
                    <div className="text-gray-600 text-xs mt-1">
                      📍 {container.localisation.adresse}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Ligne d'itinéraire suivant les rues réelles */}
        {routePath.length > 1 && (
          <Polyline 
            positions={routePath}
            pathOptions={{ 
              color: '#3b82f6', 
              weight: 5,
              opacity: 0.9,
              smoothFactor: 1.0 // Réduire le lissage pour suivre exactement les rues
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TourMap;
