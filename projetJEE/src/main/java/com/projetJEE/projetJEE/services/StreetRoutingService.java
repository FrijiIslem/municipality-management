package com.projetJEE.projetJEE.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;


// Service pour obtenir les routes réelles suivant les rues
// Utilise OSRM (Open Source Routing Machine) pour calculer les itinéraires

@Service
public class StreetRoutingService {

    private static final Logger logger = LoggerFactory.getLogger(StreetRoutingService.class);
    
    // URL de l'API OSRM publique (gratuite, basée sur OpenStreetMap)
    private static final String OSRM_BASE_URL = "http://router.project-osrm.org/route/v1/driving";
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final DecimalFormat coordinateFormatter;

    public StreetRoutingService(ObjectMapper objectMapper) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = objectMapper;
        // Créer un formateur qui utilise toujours le point (.) comme séparateur décimal
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.US);
        this.coordinateFormatter = new DecimalFormat("#.######", symbols);
    }


    // Obtient la route réelle entre deux points en suivant les rues
     // @param lat1 Latitude du point de départ
     //@param lng1 Longitude du point de départ
     //@param lat2 Latitude du point d'arrivée
     //@param lng2 Longitude du point d'arrivée
     //@return Liste de points [lat, lng] représentant la route réelle
     
    public List<double[]> getRouteBetweenPoints(double lat1, double lng1, double lat2, double lng2) {
        try {
            // Format OSRM: lng,lat (attention: OSRM utilise lng,lat et non lat,lng)
            // IMPORTANT: Utiliser DecimalFormat pour forcer le point (.) comme séparateur décimal
            String coordinates = coordinateFormatter.format(lng1) + "," + coordinateFormatter.format(lat1) + 
                                 ";" + coordinateFormatter.format(lng2) + "," + coordinateFormatter.format(lat2);
            String url = String.format("%s/%s?overview=full&geometries=geojson", OSRM_BASE_URL, coordinates);
            
            logger.info("=== APPEL OSRM ===");
            logger.info("URL: {}", url);
            logger.info("Coordinates format: {}", coordinates);
            logger.info("De: [{}, {}] à [{}, {}]", lat1, lng1, lat2, lng2);
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(java.time.Duration.ofSeconds(10))
                    .GET()
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            logger.info("Réponse OSRM - Status: {}", response.statusCode());
            
            if (response.statusCode() == 200) {
                List<double[]> route = parseOsrmResponse(response.body());
                logger.info("Route obtenue: {} points", route.size());
                if (route.isEmpty()) {
                    logger.warn("Route OSRM vide, utilisation d'une ligne droite");
                    return createStraightLine(lat1, lng1, lat2, lng2);
                }
                if (route.size() <= 2) {
                    logger.warn("Route OSRM ne contient que {} points, mais on l'utilise quand même", route.size());
                }
                return route;
            } else {
                logger.warn("Erreur OSRM: status {} - {}", response.statusCode(), response.body());
                logger.warn("URL utilisée: {}", url);
                // En cas d'erreur, retourner une ligne droite
                return createStraightLine(lat1, lng1, lat2, lng2);
            }
        } catch (java.net.http.HttpTimeoutException e) {
            logger.error("Timeout lors de l'appel à OSRM", e);
            return createStraightLine(lat1, lng1, lat2, lng2);
        } catch (Exception e) {
            logger.error("Erreur lors de l'appel à OSRM", e);
            // En cas d'erreur, retourner une ligne droite
            return createStraightLine(lat1, lng1, lat2, lng2);
        }
    }

    /**
     * Obtient la route complète pour une liste de points (itinéraire complet)
     * @param points Liste de points [lat, lng]
     * @return Liste de points [lat, lng] représentant la route complète suivant les rues
     */
    public List<double[]> getCompleteRoute(List<double[]> points) {
        if (points == null || points.size() < 2) {
            logger.warn("Pas assez de points pour créer une route: {}", points != null ? points.size() : 0);
            return points != null ? new ArrayList<>(points) : new ArrayList<>();
        }

        logger.info("=== CALCUL ROUTE COMPLETE ===");
        logger.info("Nombre de points à connecter: {}", points.size());
        
        List<double[]> completeRoute = new ArrayList<>();
        
        // Pour chaque segment entre deux points consécutifs
        for (int i = 0; i < points.size() - 1; i++) {
            double[] start = points.get(i);
            double[] end = points.get(i + 1);
            
            logger.info("Segment {}/{}: [{}, {}] -> [{}, {}]", 
                i + 1, points.size() - 1, start[0], start[1], end[0], end[1]);
            
            List<double[]> segment = getRouteBetweenPoints(start[0], start[1], end[0], end[1]);
            
            logger.info("Segment obtenu: {} points", segment.size());
            
            // Ajouter le segment (en évitant de dupliquer le dernier point)
            if (i == 0) {
                completeRoute.addAll(segment);
            } else {
                // Ajouter tous les points sauf le premier (pour éviter la duplication)
                if (segment.size() > 1) {
                    completeRoute.addAll(segment.subList(1, segment.size()));
                } else if (segment.size() == 1) {
                    // Si le segment n'a qu'un point, l'ajouter quand même
                    completeRoute.addAll(segment);
                }
            }
        }
        
        logger.info("=== ROUTE COMPLETE TERMINEE ===");
        logger.info("Total de points dans la route finale: {}", completeRoute.size());
        
        return completeRoute;
    }

    /**
     * Parse la réponse JSON d'OSRM pour extraire la géométrie de la route
     */
    private List<double[]> parseOsrmResponse(String jsonResponse) throws IOException {
        List<double[]> routePoints = new ArrayList<>();
        
        try {
            logger.debug("Parsing réponse OSRM ({} caractères)", jsonResponse.length());
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode routes = root.get("routes");
            
            if (routes == null || !routes.isArray() || routes.size() == 0) {
                logger.warn("Aucune route dans la réponse OSRM. Réponse: {}", jsonResponse.substring(0, Math.min(500, jsonResponse.length())));
                return routePoints;
            }
            
            JsonNode route = routes.get(0);
            JsonNode geometry = route.get("geometry");
            
            if (geometry == null) {
                logger.warn("Pas de géométrie dans la route OSRM");
                return routePoints;
            }
            
            JsonNode coordinates = geometry.get("coordinates");
            
            if (coordinates == null || !coordinates.isArray()) {
                logger.warn("Pas de coordonnées dans la géométrie OSRM");
                return routePoints;
            }
            
            logger.debug("Traitement de {} coordonnées", coordinates.size());
            
            for (JsonNode coord : coordinates) {
                if (coord.isArray() && coord.size() >= 2) {
                    // OSRM retourne [lng, lat], on convertit en [lat, lng]
                    double lng = coord.get(0).asDouble();
                    double lat = coord.get(1).asDouble();
                    routePoints.add(new double[]{lat, lng});
                }
            }
            
            logger.info("Route parsée avec succès: {} points extraits", routePoints.size());
            
        } catch (Exception e) {
            logger.error("Erreur lors du parsing de la réponse OSRM", e);
            logger.error("Réponse reçue: {}", jsonResponse.substring(0, Math.min(1000, jsonResponse.length())));
        }
        
        // Si aucune route n'a été trouvée, retourner une liste vide (le caller gérera)
        if (routePoints.isEmpty()) {
            logger.warn("Aucune route trouvée dans la réponse OSRM après parsing");
        }
        
        return routePoints;
    }

    /**
     * Crée une ligne droite simple entre deux points (fallback)
     * Pour une meilleure visualisation, on peut ajouter des points intermédiaires
     */
    private List<double[]> createStraightLine(double lat1, double lng1, double lat2, double lng2) {
        List<double[]> line = new ArrayList<>();
        
        // Calculer la distance
        double distance = calculateHaversineDistance(lat1, lng1, lat2, lng2);
        
        // Si la distance est grande, ajouter des points intermédiaires pour une meilleure visualisation
        if (distance > 0.5) { // Plus de 500m
            int numPoints = Math.min((int)(distance * 10), 20); // Maximum 20 points
            for (int i = 0; i <= numPoints; i++) {
                double ratio = (double) i / numPoints;
                double lat = lat1 + (lat2 - lat1) * ratio;
                double lng = lng1 + (lng2 - lng1) * ratio;
                line.add(new double[]{lat, lng});
            }
        } else {
            // Pour les courtes distances, juste 2 points
            line.add(new double[]{lat1, lng1});
            line.add(new double[]{lat2, lng2});
        }
        
        return line;
    }
    
    /**
     * Calcule la distance de Haversine entre deux points (en km)
     */
    private double calculateHaversineDistance(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371; // Rayon de la Terre en km
        
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
}

