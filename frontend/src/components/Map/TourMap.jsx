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
  center = [36.8065, 10.1815], // [lat, lng] format pour Leaflet
  zoom = 13
}) => {
  // Convertir les conteneurs au format attendu par Leaflet
  const containerMarkers = containers
    .filter(container => {
      const lat = parseFloat(container?.localisation?.latitude);
      const lng = parseFloat(container?.localisation?.longitude);
      return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng);
    })
    .map(container => ({
      ...container,
      position: [
        parseFloat(container.localisation.latitude),
        parseFloat(container.localisation.longitude)
      ]
    }));

  // Convertir l'itinéraire au format attendu par Leaflet
  const routePath = route.length > 0 
    ? route.map(point => ({
        lat: parseFloat(point.lat || point.latitude || point[0]),
        lng: parseFloat(point.lng || point.longitude || point[1])
      }))
      .filter(point => !isNaN(point.lat) && !isNaN(point.lng))
      .map(point => [point.lat, point.lng])
    : [];

  // Fonction pour obtenir la couleur en fonction de l'état de remplissage
  const getContainerColor = (etatRemplissage) => {
    return containerColors[etatRemplissage] || containerColors.VIDE;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
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
