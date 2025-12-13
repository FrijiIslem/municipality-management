package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;
import com.projetJEE.projetJEE.mapper.TourneeMapper;
import com.projetJEE.projetJEE.repository.TourneeRepository;
import com.projetJEE.projetJEE.repository.VehiculeRepository;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import com.projetJEE.projetJEE.services.TourneeService;
import com.projetJEE.projetJEE.services.NotificationService;
import com.projetJEE.projetJEE.dto.NotificationDto;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import com.projetJEE.projetJEE.exceptions.ResourceNotFoundException;

@Service
public class TourneeServiceImpl implements TourneeService {

    @Autowired
    private TourneeRepository tourneeRepository;
    
    @Autowired
    private VehiculeRepository vehiculeRepository;
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private TourneeMapper tourneeMapper;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<TourneeDto> getAllTournees() {
        return tourneeMapper.toDTOList(tourneeRepository.findAll());
    }

    @Override
    public TourneeDto getTourneeById(String id) {
        Tournee tournee = tourneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));
        return tourneeMapper.toDTO(tournee);
    }

    @Override
    @Transactional
    public TourneeDto createTournee(TourneeDto tourneeDto) {
        Tournee tournee = tourneeMapper.toEntity(tourneeDto);
        Tournee savedTournee = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(savedTournee);
    }

    @Override
    @Transactional
    public TourneeDto planifierTournee(TourneeDto tourneeDto) {
        tourneeDto.setEtat(EtatTournee.PLANIFIEE);
        tourneeDto.setDateDebut(LocalDateTime.now());
        return createTournee(tourneeDto);
    }

    @Override
    @Transactional
    public TourneeDto updateTournee(String id, TourneeDto tourneeDto) {
        return tourneeRepository.findById(id).map(tournee -> {
            Tournee source = tourneeMapper.toEntity(tourneeDto);
            tournee.setConteneurs(source.getConteneurs());
            tournee.setAgentChauffeurId(source.getAgentChauffeurId());
            tournee.setAgentRamasseursIds(source.getAgentRamasseursIds());
            tournee.setDateDebut(tourneeDto.getDateDebut());
            tournee.setDateFin(tourneeDto.getDateFin());
            tournee.setItineraire(tourneeDto.getItineraire());
            tournee.setEtat(tourneeDto.getEtat());
            tournee.setVehicule(source.getVehicule());

            Tournee updatedTournee = tourneeRepository.save(tournee);
            return tourneeMapper.toDTO(updatedTournee);
        }).orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));
    }

    @Override
    @Transactional
    public TourneeDto validerTournee(String id) {
        Tournee tournee = tourneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));
        
        // Changer l'état à VALIDEE
        tournee.setEtat(EtatTournee.VALIDEE);
        Tournee saved = tourneeRepository.save(tournee);
        
        // Envoyer des notifications aux agents assignés
        sendValidationNotificationsToAgents(saved);
        
        return tourneeMapper.toDTO(saved);
    }

    /**
     * Envoie des notifications aux agents lorsqu'une tournée est validée
     */
    private void sendValidationNotificationsToAgents(Tournee tournee) {
        try {
            String message = String.format(
                "La tournée #%s a été validée. Vous pouvez maintenant la démarrer.",
                tournee.getId()
            );
            
            // Notifier le chauffeur
            if (tournee.getAgentChauffeurId() != null) {
                NotificationDto notification = NotificationDto.builder()
                    .dateEnvoi(LocalDateTime.now())
                    .destination(tournee.getAgentChauffeurId())
                    .message(message)
                    .type(TypeNotification.REMINDER)
                    .build();
                notificationService.createNotification(notification);
            }
            
            // Notifier les ramasseurs
            if (tournee.getAgentRamasseursIds() != null && !tournee.getAgentRamasseursIds().isEmpty()) {
                for (String ramasseurId : tournee.getAgentRamasseursIds()) {
                    NotificationDto notification = NotificationDto.builder()
                        .dateEnvoi(LocalDateTime.now())
                        .destination(ramasseurId)
                        .message(message)
                        .type(TypeNotification.REMINDER)
                        .build();
                    notificationService.createNotification(notification);
                }
            }
        } catch (Exception e) {
            // Logger l'erreur mais ne pas faire échouer la validation
            System.err.println("Erreur lors de l'envoi des notifications: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public TourneeDto libererTournee(String id) {
        Tournee tournee = tourneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));

        tournee.setEtat(EtatTournee.TERMINEE);
        tournee.setDateFin(LocalDateTime.now());

        // Libérer les ressources (remettre les agents et véhicule en disponible)
        if (tournee.getAgentChauffeurId() != null) {
            utilisateurRepository.findById(tournee.getAgentChauffeurId())
                    .filter(u -> u instanceof Agent)
                    .map(u -> (Agent) u)
                    .ifPresent(agent -> {
                        agent.setDisponibilite(true);
                        utilisateurRepository.save(agent);
                    });
        }

        if (tournee.getAgentRamasseursIds() != null && !tournee.getAgentRamasseursIds().isEmpty()) {
            tournee.getAgentRamasseursIds().forEach(agentId -> {
                utilisateurRepository.findById(agentId)
                        .filter(u -> u instanceof Agent)
                        .map(u -> (Agent) u)
                        .ifPresent(agent -> {
                            agent.setDisponibilite(true);
                            utilisateurRepository.save(agent);
                        });
            });
        }

        if (tournee.getVehicule() != null) {
            tournee.getVehicule().setDisponibilite(true);
            vehiculeRepository.save(tournee.getVehicule());
        }

        Tournee saved = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public TourneeDto affecterAgent(String tourneeId, String agentId) {
        Tournee tournee = tourneeRepository.findById(tourneeId)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + tourneeId));

        Agent agent = utilisateurRepository.findById(agentId)
                .filter(u -> u instanceof Agent)
                .map(u -> (Agent) u)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + agentId));

        if (!Boolean.TRUE.equals(agent.getDisponibilite())) {
            throw new IllegalStateException("Agent with id " + agent.getId() + " is not available.");
        }

        if (agent.getTache() == Agent.TypeTache.CHAUFFEUR) {
            // Libérer l'ancien chauffeur s'il existe
            if (tournee.getAgentChauffeurId() != null) {
                utilisateurRepository.findById(tournee.getAgentChauffeurId())
                        .filter(u -> u instanceof Agent)
                        .map(u -> (Agent) u)
                        .ifPresent(oldChauffeur -> {
                            oldChauffeur.setDisponibilite(true);
                            utilisateurRepository.save(oldChauffeur);
                        });
            }
            tournee.setAgentChauffeurId(agent.getId());
            agent.setDisponibilite(false);
        } else if (agent.getTache() == Agent.TypeTache.COLLECTE) {
            List<String> collectorsIds = tournee.getAgentRamasseursIds() != null ? new ArrayList<>(tournee.getAgentRamasseursIds()) : new ArrayList<>();
            if (collectorsIds.size() < 2) {
                collectorsIds.add(agent.getId());
                tournee.setAgentRamasseursIds(collectorsIds);
                agent.setDisponibilite(false);
                System.out.println("=== DEBUG: Agent collecteur " + agent.getId() + " marqué comme indisponible ===");
            } else {
                throw new IllegalStateException("Maximum number of collectors (2) reached for tournee: " + tourneeId);
            }
        } else {
            throw new IllegalArgumentException("Agent with id " + agent.getId() + " has an invalid role: " + agent.getTache());
        }

        // Sauvegarder l'agent avec sa nouvelle disponibilité
        Agent savedAgent = utilisateurRepository.save(agent);
        System.out.println("=== DEBUG: Agent " + savedAgent.getId() + " sauvegardé avec disponibilite=" + savedAgent.getDisponibilite() + " ===");
        
        Tournee updatedTournee = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(updatedTournee);
    }

    @Override
    @Transactional
    public TourneeDto affectervehicule(String id, String vehiculeId) {
        Tournee tournee = tourneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));

        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicule not found with id: " + vehiculeId));

        if (!vehicule.isDisponibilite()) {
            // Consider throwing a specific VehiculeNotAvailableException
            throw new IllegalStateException("Vehicule with id " + vehiculeId + " is not available.");
        }

        tournee.setVehicule(vehicule);
        vehicule.setDisponibilite(false);
        vehiculeRepository.save(vehicule);

        Tournee saved = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteTournee(String id) {
        tourneeRepository.deleteById(id);
    }

    @Override
    public List<TourneeDto> getTourneesByAgent(String agentId) {
        // Récupérer toutes les tournées de l'agent (en tant que chauffeur ou ramasseur)
        List<Tournee> tourneesChauffeur = tourneeRepository.findByAgentChauffeurId(agentId);
        List<Tournee> tourneesRamasseur = tourneeRepository.findByAgentRamasseursIdsContaining(agentId);
        
        // Fusionner les listes et supprimer les doublons
        Set<Tournee> tourneesUniques = new HashSet<>();
        tourneesUniques.addAll(tourneesChauffeur);
        tourneesUniques.addAll(tourneesRamasseur);
        
        // Convertir en DTO
        return tourneesUniques.stream()
                .map(tourneeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Double getDureeMoyenneTournees() {
        List<Tournee> tournees = tourneeRepository.findAll();
        return tournees.stream()
                .filter(t -> t.getDateDebut() != null && t.getDateFin() != null)
                .mapToLong(t -> Duration.between(t.getDateDebut(), t.getDateFin()).toMinutes())
                .average()
                .orElse(0.0);
    }



    @Override
    @Transactional
    public TourneeDto demarrerTournee(String id) {
        Tournee tournee = tourneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));
        
        // Vérifier que la tournée est validée
        if (tournee.getEtat() != EtatTournee.VALIDEE) {
            throw new IllegalStateException("La tournée doit être validée avant d'être démarrée. État actuel: " + tournee.getEtat());
        }
        
        // Changer l'état à ENCOURS et enregistrer la date de début
        tournee.setEtat(EtatTournee.ENCOURS);
        tournee.setDateDebut(LocalDateTime.now());
        
        Tournee saved = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public TourneeDto terminerTournee(String id) {
        Tournee tournee = tourneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));
        
        // Vérifier que la tournée est en cours
        if (tournee.getEtat() != EtatTournee.ENCOURS) {
            throw new IllegalStateException("Seules les tournées en cours peuvent être terminées. État actuel: " + tournee.getEtat());
        }
        
        // Changer l'état à TERMINEE et enregistrer la date de fin
        tournee.setEtat(EtatTournee.TERMINEE);
        tournee.setDateFin(LocalDateTime.now());

        // Libérer les ressources (remettre les agents et véhicule en disponible)
        if (tournee.getAgentChauffeurId() != null) {
            utilisateurRepository.findById(tournee.getAgentChauffeurId())
                    .filter(u -> u instanceof Agent)
                    .map(u -> (Agent) u)
                    .ifPresent(chauffeur -> {
                        chauffeur.setDisponibilite(true);
                        utilisateurRepository.save(chauffeur);
                    });
        }

        if (tournee.getAgentRamasseursIds() != null && !tournee.getAgentRamasseursIds().isEmpty()) {
            for (String ramasseurId : tournee.getAgentRamasseursIds()) {
                utilisateurRepository.findById(ramasseurId)
                        .filter(u -> u instanceof Agent)
                        .map(u -> (Agent) u)
                        .ifPresent(ramasseur -> {
                            ramasseur.setDisponibilite(true);
                            utilisateurRepository.save(ramasseur);
                        });
            }
        }

        if (tournee.getVehicule() != null) {
            tournee.getVehicule().setDisponibilite(true);
            vehiculeRepository.save(tournee.getVehicule());
        }

        Tournee saved = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(saved);
    }
}