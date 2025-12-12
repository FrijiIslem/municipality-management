import { useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  // Palette plus vive et moderne (proche Tailwind)
  vide: '#01d04dff',      // Green 500
  saturee: '#ed0909ff',   // Red 500
  moyen: '#fb9f00ff',     // Amber 500
  // Support pour les valeurs en majuscules (au cas où)
  VIDE: '#05f55dff',
  SATUREE: '#f00808ff',
  MOYEN: '#F59E0B',
};

// Composant pour gérer les clics sur la carte
const MapEvents = ({ onClick, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!onClick) return;
    
    const handleClick = (e) => {
      if (bounds) {
        const allowed = L.latLngBounds(bounds);
        if (!allowed.contains(e.latlng)) return;
      }
      onClick({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick, bounds]);

  return null;
};

const ContainerMap = ({
  containers = [],
  onMapClick,
  onContainerClick,
  selectedPosition = null,
  selectedContainer = null,
  selectedEtat = 'vide',
  bounds = null,
  centerOverride = null
}) => {
  const mapRef = useRef();
  const SFAX_CENTER = [34.7406, 10.7603];
  const SFAX_BOUNDS = [[34.62, 10.65], [34.86, 10.88]];
  const BOUNDS = bounds || SFAX_BOUNDS;
  const CENTER = centerOverride || SFAX_CENTER;

  const getContainerColor = (etatRemplissage) => {
    // Gérer les valeurs null/undefined et convertir en minuscules pour la correspondance
    if (!etatRemplissage) return containerColors.vide;
    const etat = etatRemplissage.toString().toLowerCase();
    return containerColors[etat] || containerColors.vide;
  };
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const normalizeHex = (c) => {
    let s = c || '';
    if (s.startsWith('#')) s = s.slice(1);
    if (s.length === 3) s = s.split('').map(ch => ch + ch).join('');
    return s;
  };
  const lightenDarkenColor = (col, amt) => {
    try {
      const c = normalizeHex(col);
      const r = clamp(parseInt(c.slice(0, 2), 16) + amt);
      const g = clamp(parseInt(c.slice(2, 4), 16) + amt);
      const b = clamp(parseInt(c.slice(4, 6), 16) + amt);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch {
      return col;
    }
  };
  const getTrashIconSVG = (color, size = 36) => {
    const id = `${(color || '').replace('#','')}-${size}`;
    const light = lightenDarkenColor(color, 80);
    const dark = lightenDarkenColor(color, -25);
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${light}"/>
            <stop offset="100%" stop-color="${dark}"/>
          </linearGradient>
          <radialGradient id="gloss-${id}" cx="30%" cy="25%" r="60%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
          </radialGradient>
          <filter id="ds-${id}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <g filter="url(#ds-${id})">
          <circle cx="32" cy="32" r="28" fill="url(#grad-${id})" />
        </g>
        <circle cx="32" cy="32" r="28" fill="url(#gloss-${id})" />
        <circle cx="32" cy="32" r="27" fill="none" stroke="#FFFFFF" stroke-width="3" />
        <g fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <rect x="25" y="26" width="14" height="16" rx="3" fill="rgba(255,255,255,0.06)" />
          <path d="M22 26h20"/>
          <path d="M28 22h8"/>
          <path d="M30 30v10"/>
          <path d="M34 30v10"/>
        </g>
      </svg>
    `;
  };
  // Convertir les conteneurs au format attendu par Leaflet (supporte localisation string ou objet)
  const parseLoc = (loc) => {
    if (!loc) return null;
    let value = loc;
    if (typeof value === 'string') {
      try { value = JSON.parse(value); } catch { return null; }
    }
    const latRaw = value.latitude ?? value.lat;
    const lngRaw = value.longitude ?? value.lng;
    const lat = parseFloat(latRaw);
    const lng = parseFloat(lngRaw);
    if (!isFinite(lat) || !isFinite(lng)) return null;
    return { lat, lng, adresse: value.adresse };
  };

  const containerMarkers = containers
    .map((container) => {

      // Debug: Log what we receive
      if (containers.indexOf(container) === 0) {
        console.log('ContainerMap: First container received:', {
          id: container?.id,
          localisationType: typeof container?.localisation,
          localisation: container?.localisation,
          isString: typeof container?.localisation === 'string'
        })
      }
      
      const loc = parseLoc(container?.localisation);
      if (!loc) {
        console.warn(`Conteneur ${container?.id} ignoré: localisation invalide`, {
          localisation: container?.localisation,
          localisationType: typeof container?.localisation,
          isString: typeof container?.localisation === 'string',
          isObject: typeof container?.localisation === 'object' && container?.localisation !== null
        });

        return null;
      }
      return {
        ...container,
        localisation: { ...(typeof container.localisation === 'object' ? container.localisation : {}), ...loc },
        position: [loc.lat, loc.lng]
      };
    })
    .filter(Boolean);

  // Ajuster la vue de la carte pour afficher tous les conteneurs si aucun n'est sélectionné
  useEffect(() => {
    if (!selectedPosition && containerMarkers.length > 0 && mapRef.current) {
      // Attendre un peu pour que la carte soit complètement initialisée
      const timer = setTimeout(() => {
        if (mapRef.current && containerMarkers.length > 0) {
          try {
            const bounds = L.latLngBounds(containerMarkers.map(c => c.position));
            if (bounds.isValid()) {
              mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
          } catch (error) {
            console.warn('Erreur lors de l\'ajustement de la vue de la carte:', error);
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [containerMarkers, selectedPosition]);

  // Effet pour centrer la carte sur la position sélectionnée
  useEffect(() => {
    if (selectedPosition && mapRef.current) {
      const map = mapRef.current;
      map.flyTo(
        [selectedPosition.lat, selectedPosition.lng], 
        15, // Niveau de zoom
        { duration: 1 }
      );
    }
  }, [selectedPosition]);

  const handleMapClickInternal = useCallback((position) => {
    if (onMapClick) {
      onMapClick({
        lat: position.lat,
        lng: position.lng
      });
    }
  }, [onMapClick]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        ref={mapRef}
        center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : CENTER}
        zoom={selectedPosition ? 15 : 13}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1.0}
        whenCreated={(map) => {
          mapRef.current = map;
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
        
        {/* Gestionnaire d'événements de clic */}
        <MapEvents onClick={handleMapClickInternal} bounds={BOUNDS} />
        
        {/* Marqueurs des conteneurs existants - Icônes de poubelle colorées */}
        {containerMarkers.map((container) => {
          const isSelected = container.id === selectedContainer?.id;
          const color = getContainerColor(container.etatRemplissage);
          const iconSize = isSelected ? 40 : 32;
          
          return (
            <Marker 
              key={container.id}
              position={container.position}
              eventHandlers={{
                click: () => onContainerClick && onContainerClick(container),
                mouseover: (e) => {
                  const marker = e.target;
                  marker.setIcon(L.divIcon({
                    className: 'custom-marker-hover',
                    html: `
                      <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
                        transform: translate(-50%, -50%) scale(1.15);
                        transition: all 0.2s ease;
                        cursor: pointer;
                      ">
                        ${getTrashIconSVG(color, 36)}
                      </div>
                    `,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                  }));
                },
                mouseout: (e) => {
                  const marker = e.target;
                  marker.setIcon(L.divIcon({
                    className: 'custom-marker',
                    html: `
                      <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        filter: drop-shadow(0 ${isSelected ? '4px 8px' : '2px 4px'} rgba(0,0,0,${isSelected ? '0.4' : '0.3'}));
                        transform: translate(-50%, -50%);
                        transition: all 0.2s ease;
                        cursor: pointer;
                      ">
                        ${getTrashIconSVG(color, iconSize)}
                      </div>
                    `,
                    iconSize: [iconSize, iconSize],
                    iconAnchor: [iconSize / 2, iconSize / 2]
                  }));
                }
              }}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `
                  <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    filter: drop-shadow(0 ${isSelected ? '4px 8px' : '2px 4px'} rgba(0,0,0,${isSelected ? '0.4' : '0.3'}));
                    transform: translate(-50%, -50%);
                    transition: all 0.2s ease;
                    cursor: pointer;
                  ">
                    ${getTrashIconSVG(color, iconSize)}
                  </div>
                `,
                iconSize: [iconSize, iconSize],
                iconAnchor: [iconSize / 2, iconSize / 2]
              })}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">Conteneur {container.id}</div>
                  <div className="mb-1">
                    <span className="font-medium">État: </span>
                    <span className="capitalize">{container.etatRemplissage || 'Non spécifié'}</span>
                  </div>
                  {container.localisation?.adresse && (
                    <div className="text-gray-600 text-xs mt-1">{container.localisation.adresse}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Marqueur de la position sélectionnée */}
        {selectedPosition && (
          <Marker 
            position={[selectedPosition.lat, selectedPosition.lng]}
            icon={L.divIcon({
              className: 'selected-marker',
              html: `
                <div style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
                  transform: translate(-50%, -50%);
                ">
                  ${getTrashIconSVG(getContainerColor(selectedEtat || 'vide'), 36)}
                </div>
              `,
              iconSize: [36, 36],
              iconAnchor: [18, 18]
            })}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Nouvelle position</div>
                <div>État: {selectedEtat}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default ContainerMap

