package com.projetJEE.projetJEE.controllers;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;
import com.projetJEE.projetJEE.exceptions.PlanningException;
import com.projetJEE.projetJEE.services.TourneeService;
import com.projetJEE.projetJEE.services.AutomaticPlanningService;
import com.projetJEE.projetJEE.services.StreetRoutingService;
import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Set;
import java.util.HashSet;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournees")
public class TourneeController {

    private static final Logger logger = LoggerFactory.getLogger(TourneeController.class);

    @Autowired
    private TourneeService tourneeService;

    @Autowired
    private AutomaticPlanningService automaticPlanningService;

    @Autowired
    private StreetRoutingService streetRoutingService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<TourneeDto>> getAllTournees() {
        List<TourneeDto> tournees = tourneeService.getAllTournees();
        logger.info("Fetched tournees: {}", tournees);
        return ResponseEntity.ok(tournees);
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<TourneeDto>> getTourneesByAgent(@PathVariable String agentId) {
        List<TourneeDto> tournees = tourneeService.getTourneesByAgent(agentId);
        logger.info("Fetched {} tournees for agent {}", tournees.size(), agentId);
        return ResponseEntity.ok(tournees);
    }

    @GetMapping("/test-route")
    public ResponseEntity<Map<String, String>> testRoute() {
        logger.info("=== TEST ENDPOINT ROUTE APPELE ===");
        return ResponseEntity.ok(Map.of("status", "ok", "message", "L'endpoint route fonctionne!"));
    }

    /**
     * Obtient la route détaillée d'une tournée en suivant les rues réelles
     * IMPORTANT: Cet endpoint doit être défini AVANT /{id} pour éviter les conflits de mapping
     * @param id ID de la tournée
     * @return Liste de points [lat, lng] représentant la route complète suivant les rues
     */
    @GetMapping("/{id}/route")
    public ResponseEntity<?> getRouteWithStreets(@PathVariable String id) {
        logger.info("=== ENDPOINT ROUTE APPELE === ID: {}", id);
        try {
            TourneeDto tournee = tourneeService.getTourneeById(id);
            
            if (tournee == null || tournee.getConteneurs() == null || tournee.getConteneurs().isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            // Extraire les positions des conteneurs
            List<double[]> containerPositions = extractContainerPositions(tournee.getConteneurs());
            
            if (containerPositions.size() < 2) {
                return ResponseEntity.ok(containerPositions);
            }

            // Obtenir la route complète suivant les rues réelles
            List<double[]> route = streetRoutingService.getCompleteRoute(containerPositions);
            
            // Convertir en format JSON pour le frontend
            List<Map<String, Double>> routePoints = new ArrayList<>();
            for (double[] point : route) {
                Map<String, Double> pointMap = new HashMap<>();
                pointMap.put("lat", point[0]);
                pointMap.put("lng", point[1]);
                routePoints.add(pointMap);
            }
            
            return ResponseEntity.ok(routePoints);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de la route", e);
            return ResponseEntity.status(500).body(
                Map.of("error", "Erreur lors de la récupération de la route", "message", e.getMessage())
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourneeDto> getTourneeById(@PathVariable String id) {
        TourneeDto tournee = tourneeService.getTourneeById(id);
        return ResponseEntity.ok(tournee);
    }

    @PostMapping
    public ResponseEntity<TourneeDto> createTournee(@RequestBody TourneeDto tourneeDto) {
        TourneeDto createdTournee = tourneeService.createTournee(tourneeDto);
        return ResponseEntity.ok(createdTournee);
    }

    /**
     * Endpoint pour déclencher manuellement la planification automatique
     * Utile pour les tests ou pour forcer une planification en dehors de l'horaire programmé
     * IMPORTANT: Cet endpoint doit être placé AVANT les autres mappings pour éviter les conflits
     */
    @PostMapping("/planifier-automatique")
    public ResponseEntity<?> planifierAutomatique() {
        logger.info("Déclenchement manuel de la planification automatique");
        try {
            TourneeDto tournee = automaticPlanningService.planifyDailyTournees();
            logger.info("Planification automatique réussie, tournée créée: {}", tournee.getId());
            return ResponseEntity.ok(tournee);
        } catch (PlanningException e) {
            logger.warn("Erreur de planification: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of(
                    "error", "Impossible de créer une tournée",
                    "message", e.getMessage(),
                    "reason", e.getReason()
                )
            );
        } catch (Exception e) {
            logger.error("Erreur lors de la planification automatique", e);
            return ResponseEntity.status(500).body(
                Map.of(
                    "error", "Erreur serveur",
                    "message", e.getMessage() != null ? e.getMessage() : "Une erreur est survenue lors de la planification"
                )
            );
        }
    }

    @PostMapping("/planifier")
    public ResponseEntity<TourneeDto> planifierTournee(@RequestBody TourneeDto tourneeDto) {
        TourneeDto plannedTournee = tourneeService.planifierTournee(tourneeDto);
        return ResponseEntity.ok(plannedTournee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourneeDto> updateTournee(@PathVariable String id, @RequestBody TourneeDto tourneeDto) {
        TourneeDto updatedTournee = tourneeService.updateTournee(id, tourneeDto);
        return ResponseEntity.ok(updatedTournee);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<TourneeDto> validerTournee(@PathVariable String id) {
        TourneeDto tournee = tourneeService.validerTournee(id);
        logger.info("Tournée {} validée, notifications envoyées aux agents", id);
        return ResponseEntity.ok(tournee);
    }

    /**
     * Démarre une tournée (appelé par l'agent)
     * Met l'état à ENCOURS et enregistre la date de début
     */
    @PutMapping("/{id}/start")
    public ResponseEntity<?> demarrerTournee(@PathVariable String id) {
        try {
            TourneeDto tournee = tourneeService.demarrerTournee(id);
            logger.info("Tournée {} démarrée par l'agent", id);
            return ResponseEntity.ok(tournee);
        } catch (IllegalStateException e) {
            logger.warn("Erreur lors du démarrage de la tournée {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", "Impossible de démarrer la tournée", "message", e.getMessage())
            );
        }
    }

    /**
     * Termine une tournée (appelé par l'agent)
     * Met l'état à TERMINEE, enregistre la date de fin et libère les ressources
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> terminerTournee(@PathVariable String id) {
        try {
            TourneeDto tournee = tourneeService.terminerTournee(id);
            logger.info("Tournée {} terminée par l'agent, ressources libérées", id);
            return ResponseEntity.ok(tournee);
        } catch (IllegalStateException e) {
            logger.warn("Erreur lors de la finalisation de la tournée {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", "Impossible de terminer la tournée", "message", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}/liberer")
    public ResponseEntity<TourneeDto> libererTournee(@PathVariable String id) {
        TourneeDto tournee = tourneeService.libererTournee(id);
        return ResponseEntity.ok(tournee);
    }

    @PutMapping("/{id}/affecter-agent/{agentId}")
    public ResponseEntity<TourneeDto> affecterAgent(@PathVariable String id, @PathVariable String agentId) {
        TourneeDto updatedTournee = tourneeService.affecterAgent(id, agentId);
        return ResponseEntity.ok(updatedTournee);
    }

    @PutMapping("/{id}/affecter-vehicule/{vehiculeId}")
    public ResponseEntity<TourneeDto> affecterVehicule(@PathVariable String id, @PathVariable String vehiculeId) {
        TourneeDto tournee = tourneeService.affectervehicule(id, vehiculeId);
        if (tournee != null) {
            return ResponseEntity.ok(tournee);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournee(@PathVariable String id) {
        tourneeService.deleteTournee(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/duree")
    public ResponseEntity<Long> getDureeTournee(@PathVariable String id) {
        Duration duree = tourneeService.getDureeTournee(id);
        return ResponseEntity.ok(duree.toMinutes());
    }

    @GetMapping("/etat/{etat}")
    public ResponseEntity<List<TourneeDto>> getTourneesByEtat(@PathVariable EtatTournee etat) {
        List<TourneeDto> tournees = tourneeService.getTourneesByEtat(etat);
        return ResponseEntity.ok(tournees);
    }

    @GetMapping("/duree/moyenne")
    public ResponseEntity<Double> getDureeMoyenneTournees() {
        Double dureeMoyenne = tourneeService.getDureeMoyenneTournees();
        return ResponseEntity.ok(dureeMoyenne);
    }

    /**
     * Extrait les positions des conteneurs depuis leur localisation
     * Accepte à la fois Conteneur (entity) et ConteneurDTO
     */
    private List<double[]> extractContainerPositions(List<ConteneurDTO> conteneurs) {
        List<double[]> positions = new ArrayList<>();
        
        for (ConteneurDTO conteneur : conteneurs) {
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
                    positions.add(new double[]{lat, lng});
                }
            } catch (Exception e) {
                logger.warn("Erreur lors de l'extraction de la position du conteneur {}", conteneur.getId(), e);
                continue;
            }
        }
        
        return positions;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseLocalisation(String localisation) {
        try {
            if (localisation.startsWith("{")) {
                return objectMapper.readValue(localisation, Map.class);
            }
            return null;
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
        return lat >= 30.0 && lat <= 38.0 && lng >= 7.0 && lng <= 12.0;
    }
}