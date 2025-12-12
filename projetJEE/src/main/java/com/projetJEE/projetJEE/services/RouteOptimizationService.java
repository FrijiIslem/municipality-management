package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.entities.Conteneur;
import org.springframework.stereotype.Service;

import java.util.*;


// Service pour optimiser le chemin entre les conteneurs
 // Utilise un algorithme de plus proche voisin amélioré pour le TSP
 
@Service
public class RouteOptimizationService {

    
    // Calcule le chemin optimal pour visiter tous les conteneurs
     // @param conteneurs Liste des conteneurs à visiter
     // @return Liste ordonnée des conteneurs représentant le chemin optimal
  
    public List<Conteneur> calculateOptimalRoute(List<Conteneur> conteneurs) {
        if (conteneurs == null || conteneurs.isEmpty()) {
            return new ArrayList<>();
        }
        if (conteneurs.size() == 1) {
            return new ArrayList<>(conteneurs);
        }
        // Extraire les positions valides
        List<ContainerPosition> positions = extractValidPositions(conteneurs);
        if (positions.isEmpty()) {
            return new ArrayList<>();
        }
        // Utiliser l'algorithme du plus proche voisin amélioré
        List<ContainerPosition> optimizedRoute = nearestNeighborOptimized(positions);
        
        // Convertir en liste de conteneurs dans l'ordre optimal
        return convertToConteneurs(optimizedRoute, conteneurs);
    }

    
     // Extrait les positions valides des conteneurs
    
    private List<ContainerPosition> extractValidPositions(List<Conteneur> conteneurs) {
        List<ContainerPosition> positions = new ArrayList<>();
        
        for (Conteneur conteneur : conteneurs) {
            try {
                String localisation = conteneur.getLocalisation();
                if (localisation == null || localisation.trim().isEmpty()) {
                    continue;
                }

                Map<String, Object> locMap = parseLocalisation(localisation);
                if (locMap == null) continue;

                Double lat = parseDouble(locMap.get("latitude"));
                Double lng = parseDouble(locMap.get("longitude"));
                
                if (lat != null && lng != null && isValidCoordinate(lat, lng)) {
                    positions.add(new ContainerPosition(conteneur.getId(), lat, lng, conteneur));
                }
            } catch (Exception e) {
                // Ignorer les conteneurs avec localisation invalide
                continue;
            }
        }
        
        return positions;
    }

    
     //Parse la localisation (peut être JSON string ou objet)
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseLocalisation(String localisation) {
        try {
            if (localisation.startsWith("{")) {
                // JSON string
                return new com.fasterxml.jackson.databind.ObjectMapper()
                    .readValue(localisation, Map.class);
            } else {
                // Format simple, essayer de parser
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    private Double parseDouble(Object value) {
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private boolean isValidCoordinate(double lat, double lng) {
        // Coordonnées valides pour la Tunisie (approximatif)
        return lat >= 30.0 && lat <= 38.0 && lng >= 7.0 && lng <= 12.0;
    }

    
     //Algorithme du plus proche voisin amélioré avec optimisation 2-opt problème du voyageur de commerce – TSP
    private List<ContainerPosition> nearestNeighborOptimized(List<ContainerPosition> positions) {
        if (positions.size() <= 2) {
            return new ArrayList<>(positions);
        }

        // Étape 1: Plus proche voisin
        List<ContainerPosition> route = nearestNeighbor(positions);
        
        // Étape 2: Optimisation 2-opt (améliore le chemin)
        route = twoOptOptimization(route);
        
        return route;
    }

// Algorithme du plus proche voisin
  private List<ContainerPosition> nearestNeighbor(List<ContainerPosition> positions) {
        if (positions.isEmpty()) {
            return new ArrayList<>();
        }

        List<ContainerPosition> route = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        
        // Commencer par le premier point
        ContainerPosition current = positions.get(0);
        route.add(current);
        visited.add(current.id);

        // Trouver le plus proche voisin à chaque étape
        while (visited.size() < positions.size()) {
            ContainerPosition nearest = null;
            double minDistance = Double.MAX_VALUE;

            for (ContainerPosition pos : positions) {
                if (!visited.contains(pos.id)) {
                    double distance = calculateDistance(current, pos);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearest = pos;
                    }
                }
            }

            if (nearest != null) {
                route.add(nearest);
                visited.add(nearest.id);
                current = nearest;
            } else {
                break;
            }
        }

        return route;
    }

    
    // Optimisation 2-opt pour améliorer le chemin
    private List<ContainerPosition> twoOptOptimization(List<ContainerPosition> route) {
        if (route.size() <= 3) {
            return route;
        }

        boolean improved = true;
        List<ContainerPosition> bestRoute = new ArrayList<>(route);
        double bestDistance = calculateTotalDistance(bestRoute);

        int maxIterations = 100; // Limiter les itérations pour l'optimisation
        int iterations = 0;

        while (improved && iterations < maxIterations) {
            improved = false;
            iterations++;

            for (int i = 1; i < bestRoute.size() - 2; i++) {
                for (int j = i + 1; j < bestRoute.size(); j++) {
                    if (j - i == 1) continue;

                    // Créer une nouvelle route en inversant le segment
                    List<ContainerPosition> newRoute = twoOptSwap(bestRoute, i, j);
                    double newDistance = calculateTotalDistance(newRoute);

                    if (newDistance < bestDistance) {
                        bestRoute = newRoute;
                        bestDistance = newDistance;
                        improved = true;
                    }
                }
            }
        }

        return bestRoute;
    }

    
     // Effectue un swap 2-opt
    
    private List<ContainerPosition> twoOptSwap(List<ContainerPosition> route, int i, int j) {
        List<ContainerPosition> newRoute = new ArrayList<>();
        
        // Prendre route[0] à route[i-1] dans l'ordre
        newRoute.addAll(route.subList(0, i));
        
        // Prendre route[i] à route[j] dans l'ordre inverse
        List<ContainerPosition> reversed = new ArrayList<>(route.subList(i, j + 1));
        Collections.reverse(reversed);
        newRoute.addAll(reversed);
        
        // Prendre route[j+1] à la fin dans l'ordre
        if (j + 1 < route.size()) {
            newRoute.addAll(route.subList(j + 1, route.size()));
        }
        
        return newRoute;
    }

    
    // Calcule la distance totale d'une route
    private double calculateTotalDistance(List<ContainerPosition> route) {
        if (route.size() <= 1) {
            return 0.0;
        }

        double totalDistance = 0.0;
        for (int i = 0; i < route.size() - 1; i++) {
            totalDistance += calculateDistance(route.get(i), route.get(i + 1));
        }
        
        return totalDistance;
    }

    
     //Calcule la distance de Haversine entre deux points (en km)
    private double calculateDistance(ContainerPosition pos1, ContainerPosition pos2) {
        final int R = 6371; // Rayon de la Terre en km

        double lat1 = Math.toRadians(pos1.lat);
        double lat2 = Math.toRadians(pos2.lat);
        double deltaLat = Math.toRadians(pos2.lat - pos1.lat);
        double deltaLng = Math.toRadians(pos2.lng - pos1.lng);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(lat1) * Math.cos(lat2) *
                   Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    
     // Convertit la liste de positions optimisées en liste de conteneurs
    private List<Conteneur> convertToConteneurs(List<ContainerPosition> positions, List<Conteneur> originalConteneurs) {
        Map<String, Conteneur> conteneurMap = new HashMap<>();
        for (Conteneur c : originalConteneurs) {
            conteneurMap.put(c.getId(), c);
        }

        List<Conteneur> result = new ArrayList<>();
        for (ContainerPosition pos : positions) {
            Conteneur conteneur = conteneurMap.get(pos.id);
            if (conteneur != null) {
                result.add(conteneur);
            }
        }

        return result;
    }

    
     //Classe interne pour représenter une position de conteneur
    private static class ContainerPosition {
        String id;
        double lat;
        double lng;
        Conteneur conteneur;

        ContainerPosition(String id, double lat, double lng, Conteneur conteneur) {
            this.id = id;
            this.lat = lat;
            this.lng = lng;
            this.conteneur = conteneur;
        }
    }
}

