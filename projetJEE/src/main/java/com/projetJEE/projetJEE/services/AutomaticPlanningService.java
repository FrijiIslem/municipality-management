package com.projetJEE.projetJEE.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//En haut du fichier, assurez-vous d'avoir ces imports
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projetJEE.projetJEE.dto.NotificationDto;
import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.entities.enums.EtatRemplissage;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;
import com.projetJEE.projetJEE.exceptions.PlanningException;
import com.projetJEE.projetJEE.mapper.AgentMapper;
import com.projetJEE.projetJEE.repository.ConteneurRepository;
import com.projetJEE.projetJEE.repository.TourneeRepository;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import com.projetJEE.projetJEE.repository.VehiculeRepository;


@Service
public class AutomaticPlanningService {

    private static final Logger logger = LoggerFactory.getLogger(AutomaticPlanningService.class);

    @Autowired
    private ConteneurRepository conteneurRepository;

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private TourneeRepository tourneeRepository;

    @Autowired
    private RouteOptimizationService routeOptimizationService;

    @Autowired
    private com.projetJEE.projetJEE.services.NotificationService notificationService;

    @Autowired
    private TourneeService tourneeService;

    @Autowired
    private com.projetJEE.projetJEE.mapper.ConteneurMapper conteneurMapper;

    @Autowired
    private com.projetJEE.projetJEE.mapper.VehiculeMapper vehiculeMapper;

    private com.projetJEE.projetJEE.mapper.AgentMapper agentMapper;


    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Planifie automatiquement les tournées pour le jour
     * Sélectionne un véhicule, 2 agents collecteurs, 1 agent chauffeur
     * Calcule le chemin optimal et crée une notification pour l'admin
     */
    @Transactional
    public TourneeDto planifyDailyTournees() {
        logger.info("Début de la planification automatique des tournées à {}", LocalDateTime.now());

        try {
            // 1. Récupérer les conteneurs qui nécessitent une collecte (saturés ou moyens)
            List<Conteneur> conteneursToCollect = getConteneursToCollect();
            
            if (conteneursToCollect.isEmpty()) {
                String message = "Aucun conteneur nécessite de collecte aujourd'hui (aucun conteneur saturé ou moyen)";
                logger.info(message);
                sendNotificationToAdmin("Planification annulée", message);
                throw new PlanningException(message, "NO_CONTAINERS");
            }

            logger.info("Nombre de conteneurs à collecter: {}", conteneursToCollect.size());

            // 2. Sélectionner un véhicule disponible
            Vehicule vehicule = selectAvailableVehicule();
            if (vehicule == null) {
                String message = "Aucun véhicule disponible pour la planification";
                logger.warn(message);
                sendNotificationToAdmin("Erreur de planification", message);
                throw new PlanningException(message, "NO_VEHICLE");
            }

            // 3. Sélectionner 2 agents collecteurs disponibles
            List<Agent> collecteurs = selectAvailableCollectors(2);
            if (collecteurs.size() < 2) {
                String message = String.format("Pas assez d'agents collecteurs disponibles (trouvé: %d, requis: 2)", collecteurs.size());
                logger.warn(message);
                sendNotificationToAdmin("Erreur de planification", message);
                throw new PlanningException(message, "NOT_ENOUGH_COLLECTORS");
            }

            // 4. Sélectionner 1 agent chauffeur disponible
            Agent chauffeur = selectAvailableChauffeur();
            if (chauffeur == null) {
                String message = "Aucun agent chauffeur disponible pour la planification";
                logger.warn(message);
                sendNotificationToAdmin("Erreur de planification", message);
                throw new PlanningException(message, "NO_DRIVER");
            }

            // 5. Calculer le chemin optimal
            List<Conteneur> optimizedRoute = routeOptimizationService.calculateOptimalRoute(conteneursToCollect);
            
            if (optimizedRoute.isEmpty()) {
                String message = "Impossible de calculer un chemin optimal (localisations invalides)";
                logger.warn(message);
                throw new PlanningException(message, "INVALID_ROUTE");
            }
         // À ce stade, seul le véhicule et l’itinéraire optimisé sont connus.
         // Le chauffeur et l’agence ne sont pas encore déterminés, donc on les passe à null.

            // 6. Créer la tournée (sans assigner les agents pour éviter les conflits)
            TourneeDto tourneeDto = createTourneeDto(vehicule, null, null, optimizedRoute);
            
            // 7. Sauvegarder la tournée
            TourneeDto savedTournee = tourneeService.createTournee(tourneeDto);
            
            // 8. Affecter les ressources (cela gère correctement la disponibilité)
            logger.info("Affectation du véhicule: {}", vehicule.getId());
            tourneeService.affectervehicule(savedTournee.getId(), vehicule.getId());
            
            logger.info("Affectation du chauffeur: {}", chauffeur.getId());
            tourneeService.affecterAgent(savedTournee.getId(), chauffeur.getId());
            
            logger.info("Affectation des {} collecteurs", collecteurs.size());
            for (Agent collecteur : collecteurs) {
                logger.info("Affectation du collecteur: {} (disponibilite avant: {})", 
                    collecteur.getId(), collecteur.getDisponibilite());
                tourneeService.affecterAgent(savedTournee.getId(), collecteur.getId());
                
                // Vérifier que l'agent a bien été marqué comme indisponible
                Agent updatedCollector = utilisateurRepository.findById(collecteur.getId())
                    .filter(u -> u instanceof Agent)
                    .map(u -> (Agent) u)
                    .orElse(null);
                if (updatedCollector != null) {
                    logger.info("Collecteur {} après affectation - disponibilite: {}", 
                        updatedCollector.getId(), updatedCollector.getDisponibilite());
                    if (Boolean.TRUE.equals(updatedCollector.getDisponibilite())) {
                        logger.warn("⚠️ ATTENTION: Le collecteur {} est toujours disponible après affectation !", 
                            updatedCollector.getId());
                    }
                }
            }

            // 9. Marquer le véhicule comme indisponible
            vehicule.setDisponibilite(false);
            vehiculeRepository.save(vehicule);

            // 10. Récupérer la tournée mise à jour avec tous les agents assignés
            TourneeDto finalTournee = tourneeService.getTourneeById(savedTournee.getId());

            // 11. Envoyer une notification à l'admin avec les détails
            sendTourneeNotificationToAdmin(finalTournee, vehicule, collecteurs, chauffeur, optimizedRoute);

            logger.info("Planification automatique terminée avec succès. Tournée créée: {}", finalTournee.getId());
            
            return finalTournee;

        } catch (PlanningException e) {
            // Re-lancer les PlanningException pour qu'elles soient gérées par le contrôleur
            throw e;
        } catch (Exception e) {
            logger.error("Erreur lors de la planification automatique", e);
            sendNotificationToAdmin("Erreur de planification", 
                "Une erreur est survenue lors de la planification automatique: " + e.getMessage());
            throw new PlanningException("Erreur lors de la planification: " + e.getMessage(), "UNKNOWN_ERROR");
        }
    }


    
    // Récupère les conteneurs qui nécessitent une collecte
    

    private List<Conteneur> getConteneursToCollect() {
        List<Conteneur> allConteneurs = conteneurRepository.findAll();
        
        return allConteneurs.stream()
            .filter(c -> {
                EtatRemplissage etat = c.getEtatRemplissage();
                return etat == EtatRemplissage.saturee || etat == EtatRemplissage.moyen;
            })
            .collect(Collectors.toList());
    }

  // Sélectionne un véhicule disponible
  
    private Vehicule selectAvailableVehicule() {
        List<Vehicule> availableVehicules = vehiculeRepository.findAll().stream()
            .filter(Vehicule::isDisponibilite)
            .collect(Collectors.toList());

        if (availableVehicules.isEmpty()) {
            return null;
        }

        // Sélectionner le véhicule avec la plus grande capacité
        return availableVehicules.stream()
            .max(Comparator.comparing(Vehicule::getCapaciteMax))
            .orElse(availableVehicules.get(0));
    }

     //Sélectionne N agents collecteurs disponibles
   

    private List<Agent> selectAvailableCollectors(int count) {
        List<Agent> availableCollectors = utilisateurRepository.findAll().stream()
            .filter(u -> u instanceof Agent)
            .map(u -> (Agent) u)
            .filter(a -> a.getTache() == Agent.TypeTache.COLLECTE)
            .filter(a -> Boolean.TRUE.equals(a.getDisponibilite()))
            .collect(Collectors.toList());

        if (availableCollectors.size() < count) {
            return availableCollectors;
        }

        // Retourner les N premiers disponibles
        return availableCollectors.subList(0, Math.min(count, availableCollectors.size()));
    }

     // Sélectionne un agent chauffeur disponible
    
    private Agent selectAvailableChauffeur() {
        return utilisateurRepository.findAll().stream()
            .filter(u -> u instanceof Agent)
            .map(u -> (Agent) u)
            .filter(a -> a.getTache() == Agent.TypeTache.CHAUFFEUR)
            .filter(a -> Boolean.TRUE.equals(a.getDisponibilite()))
            .findFirst()
            .orElse(null);
    }
  // Crée un DTO de tournée avec les informations sélectionnées
//Les agents peuvent être null si on veut les assigner après via affecterAgent
   
    private TourneeDto createTourneeDto(Vehicule vehicule, List<Agent> collecteurs, 
                                       Agent chauffeur, List<Conteneur> conteneurs) {
        // Convertir les conteneurs en DTOs
        List<com.projetJEE.projetJEE.dto.ConteneurDTO> conteneurDTOs = conteneurMapper.toDTOList(conteneurs);

        // Créer l'itinéraire JSON
        String itineraire = createItineraireJson(conteneurs);

        // Date de début: aujourd'hui à 8h
        LocalDateTime dateDebut = LocalDateTime.now()
            .withHour(8)
            .withMinute(0)
            .withSecond(0)
            .withNano(0);

        // Date de fin estimée: dateDebut + 6 heures
        LocalDateTime dateFin = dateDebut.plusHours(6);

        TourneeDto.TourneeDtoBuilder builder = TourneeDto.builder()
            .conteneurs(conteneurDTOs)
            .vehicule(vehiculeMapper.toDTO(vehicule))
            .dateDebut(dateDebut)
            .dateFin(dateFin)
            .itineraire(itineraire)
            .etat(EtatTournee.PLANIFIEE);
        
        // Assigner les agents seulement s'ils sont fournis (pour compatibilité)
        if (chauffeur != null) {
            builder.agentChauffeur(AgentMapper.toDTO(chauffeur));
        }
        if (collecteurs != null && !collecteurs.isEmpty()) {
            builder.agentRamasseurs(collecteurs.stream()
                .map(AgentMapper::toDTO)
                .collect(Collectors.toList()));
        }
        
        return builder.build();
    }

    
     //Crée l'itinéraire JSON à partir de la liste de conteneurs
    private String createItineraireJson(List<Conteneur> conteneurs) {
        try {
            List<Map<String, Object>> route = new ArrayList<>();
            
            for (Conteneur conteneur : conteneurs) {
            	//Une HashMap est une structure de données Java qui permet de stocker des informations sous forme de clé → valeur.
                Map<String, Object> point = new HashMap<>();
                point.put("conteneurId", conteneur.getId());
                
                // Parser la localisation
                try {
                    Map<String, Object> locMap = parseLocalisation(conteneur.getLocalisation());
                    if (locMap != null) {
                        point.put("latitude", locMap.get("latitude"));
                        point.put("longitude", locMap.get("longitude"));
                        point.put("adresse", locMap.get("adresse"));
                    }
                } catch (Exception e) {
                    // Ignorer si la localisation ne peut pas être parsée
                }
                
                route.add(point);
            }
            
            return objectMapper.writeValueAsString(route);
        } catch (Exception e) {
            logger.error("Erreur lors de la création de l'itinéraire JSON", e);
            return "[]";
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseLocalisation(String localisation) {
        try {
            if (localisation != null && localisation.startsWith("{")) {
                return objectMapper.readValue(localisation, Map.class);
            }
        } catch (Exception e) {
            // Ignorer
        }
        return null;
    }


    
     //Envoie une notification à l'admin avec les détails de la tournée

    private void sendTourneeNotificationToAdmin(TourneeDto tournee, Vehicule vehicule, 
                                              List<Agent> collecteurs, Agent chauffeur,
                                              List<Conteneur> conteneurs) {
        StringBuilder message = new StringBuilder();
        message.append("📋 Nouvelle tournée planifiée automatiquement\n\n");
        message.append("🆔 ID Tournée: ").append(tournee.getId()).append("\n");
        message.append("🚗 Véhicule: ").append(vehicule.getMatricule())
               .append(" (Capacité: ").append(vehicule.getCapaciteMax()).append(" kg)\n");
        message.append("👨‍✈️ Chauffeur: ").append(chauffeur.getNom()).append("\n");
        message.append("👥 Collecteurs: ");
        for (int i = 0; i < collecteurs.size(); i++) {
            if (i > 0) message.append(", ");
            message.append(collecteurs.get(i).getNom());
        }
        message.append("\n");
        message.append("📦 Nombre de conteneurs: ").append(conteneurs.size()).append("\n");
        message.append("📅 Date de début: ").append(tournee.getDateDebut()).append("\n");
        message.append("📅 Date de fin estimée: ").append(tournee.getDateFin()).append("\n");
        message.append("\n⚠️ Veuillez valider cette tournée dans le dashboard admin.");

        sendNotificationToAdmin("Tournée planifiée automatiquement", message.toString());
    }

    /**
     * Envoie une notification à l'admin
     */
    private void sendNotificationToAdmin(String title, String message) {
        try {
            NotificationDto notificationDto = NotificationDto.builder()
                .dateEnvoi(LocalDateTime.now())
                .destination("admin")
                .message(title + "\n\n" + message)
                .type(TypeNotification.REMINDER)
                .build();

            notificationService.createNotification(notificationDto);
            logger.info("Notification envoyée à l'admin: {}", title);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de la notification", e);
        }
    }
}

