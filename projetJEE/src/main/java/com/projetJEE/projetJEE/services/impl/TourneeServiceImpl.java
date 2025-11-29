package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;
import com.projetJEE.projetJEE.mapper.TourneeMapper;
import com.projetJEE.projetJEE.repository.TourneeRepository;
import com.projetJEE.projetJEE.repository.AgentRepository;
import com.projetJEE.projetJEE.repository.VehiculeRepository;
import com.projetJEE.projetJEE.services.TourneeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TourneeServiceImpl implements TourneeService {

    @Autowired
    private TourneeRepository tourneeRepository;
    
    @Autowired
    private AgentRepository agentRepository;
    
    @Autowired
    private VehiculeRepository vehiculeRepository;
    
    @Autowired
    private TourneeMapper tourneeMapper;

    @Override
    public List<TourneeDto> getAllTournees() {
        return tourneeMapper.toDTOList(tourneeRepository.findAll());
    }

    @Override
    public TourneeDto getTourneeById(String id) {
        Optional<Tournee> tournee = tourneeRepository.findById(id);
        return tournee.map(tourneeMapper::toDTO).orElse(null);
    }

    @Override
    public TourneeDto createTournee(TourneeDto tourneeDto) {
        Tournee tournee = tourneeMapper.toEntity(tourneeDto);
        Tournee savedTournee = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(savedTournee);
    }

    @Override
    public TourneeDto planifierTournee(TourneeDto tourneeDto) {
        tourneeDto.setEtat(EtatTournee.PLANIFIEE);
        tourneeDto.setDateDebut(LocalDateTime.now());
        return createTournee(tourneeDto);
    }

    @Override
    public TourneeDto updateTournee(String id, TourneeDto tourneeDto) {
        Optional<Tournee> existingTournee = tourneeRepository.findById(id);
        if (existingTournee.isPresent()) {
            Tournee tournee = existingTournee.get();
            tournee.setId(tourneeDto.getId());
            tournee.setConteneurs(tourneeMapper.toEntity(tourneeDto).getConteneurs());
            tournee.setAgentChauffeur(tourneeMapper.toEntity(tourneeDto).getAgentChauffeur());
            tournee.setAgentRamasseurs(tourneeMapper.toEntity(tourneeDto).getAgentRamasseurs());
            tournee.setDateDebut(tourneeDto.getDateDebut());
            tournee.setDateFin(tourneeDto.getDateFin());
            tournee.setItineraire(tourneeDto.getItineraire());
            tournee.setEtat(tourneeDto.getEtat());
            tournee.setVehicule(tourneeMapper.toEntity(tourneeDto).getVehicule());
            
            Tournee updatedTournee = tourneeRepository.save(tournee);
            return tourneeMapper.toDTO(updatedTournee);
        }
        return null;
    }

    @Override
    public TourneeDto validerTournee(String id) {
        Optional<Tournee> tournee = tourneeRepository.findById(id);
        if (tournee.isPresent()) {
            Tournee t = tournee.get();
            t.setEtat(EtatTournee.ENCOURS);
            Tournee saved = tourneeRepository.save(t);
            return tourneeMapper.toDTO(saved);
        }
        return null;
    }

    @Override
    public TourneeDto libererTournee(String id) {
        Optional<Tournee> tournee = tourneeRepository.findById(id);
        if (tournee.isPresent()) {
            Tournee t = tournee.get();
            t.setEtat(EtatTournee.TERMINEE);
            t.setDateFin(LocalDateTime.now());
            
            // Libérer les ressources (remettre les agents et véhicule en disponible)
            if (t.getAgentChauffeur() != null) {
                t.getAgentChauffeur().setDisponibilite(true);
                agentRepository.save(t.getAgentChauffeur());
            }
            
            if (t.getAgentRamasseurs() != null) {
                t.getAgentRamasseurs().forEach(agent -> {
                    agent.setDisponibilite(true);
                    agentRepository.save(agent);
                });
            }
            
            if (t.getVehicule() != null) {
                t.getVehicule().setDisponibilite(true);
                vehiculeRepository.save(t.getVehicule());
            }
            
            Tournee saved = tourneeRepository.save(t);
            return tourneeMapper.toDTO(saved);
        }
        return null;
    }

    @Override
    public TourneeDto affecterAgent(String tourneeId, String agentId) {
        Optional<Tournee> tourneeOpt = tourneeRepository.findById(tourneeId);
        if (tourneeOpt.isEmpty()) {
            // Or throw a specific exception like TourneeNotFoundException
            return null;
        }

        Optional<Agent> agentOpt = agentRepository.findById(agentId);
        if (agentOpt.isEmpty()) {
            // Or throw AgentNotFoundException
            return null;
        }

        Tournee tournee = tourneeOpt.get();
        Agent agent = agentOpt.get();

        if (!agent.getDisponibilite()) {
            // Or throw AgentNotAvailableException
            return null;
        }

        if ("chauffeur".equalsIgnoreCase(agent.getTache())) {
            // Release previous chauffeur if exists
            if (tournee.getAgentChauffeur() != null) {
                Agent previousChauffeur = tournee.getAgentChauffeur();
                previousChauffeur.setDisponibilite(true);
                agentRepository.save(previousChauffeur);
            }
            tournee.setAgentChauffeur(agent);
            agent.setDisponibilite(false);
        } else if ("collecte".equalsIgnoreCase(agent.getTache())) {
            List<Agent> collectors = tournee.getAgentRamasseurs() != null ? new ArrayList<>(tournee.getAgentRamasseurs()) : new ArrayList<>();
            if (collectors.size() < 2) {
                collectors.add(agent);
                tournee.setAgentRamasseurs(collectors);
                agent.setDisponibilite(false);
            } else {
                // Or throw MaxCollectorsReachedException
                return null;
            }
        } else {
            // Or throw InvalidAgentRoleException
            return null;
        }

        agentRepository.save(agent);
        Tournee updatedTournee = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(updatedTournee);
    }

    @Override
    public TourneeDto affectervehicule(String id, String vehiculeId) {
        Optional<Tournee> tourneeOpt = tourneeRepository.findById(id);
        Optional<Vehicule> vehiculeOpt = vehiculeRepository.findById(vehiculeId);
        
        if (tourneeOpt.isPresent() && vehiculeOpt.isPresent()) {
            Tournee tournee = tourneeOpt.get();
            Vehicule vehicule = vehiculeOpt.get();
            
            // Vérifier si le véhicule est disponible
            if (vehicule.isDisponibilite()) {
                tournee.setVehicule(vehicule);
                vehicule.setDisponibilite(false); // Marquer le véhicule comme non disponible
                vehiculeRepository.save(vehicule);
                Tournee saved = tourneeRepository.save(tournee);
                return tourneeMapper.toDTO(saved);
            }
        }
        return null;
    }

    @Override
    public void deleteTournee(String id) {
        tourneeRepository.deleteById(id);
    }

    @Override
    public Duration getDureeTournee(String id) {
        Optional<Tournee> tournee = tourneeRepository.findById(id);
        if (tournee.isPresent()) {
            Tournee t = tournee.get();
            if (t.getDateDebut() != null && t.getDateFin() != null) {
                return Duration.between(t.getDateDebut(), t.getDateFin());
            }
        }
        return Duration.ZERO;
    }

    @Override
    public List<TourneeDto> getTourneesByEtat(EtatTournee etat) {
        return tourneeRepository.findByEtat(etat).stream()
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
    public List<TourneeDto> getTourneesByAgent(String agentId) {
        return tourneeRepository.findByAgentChauffeurId(agentId).stream()
                .map(tourneeMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    // Legacy methods for backward compatibility
   @Override
public void affecterTournee(String tourneeId, String chauffeurId, String vehiculeId) {
    Optional<Tournee> tourneeOpt = tourneeRepository.findById(tourneeId);
    
    if (tourneeOpt.isEmpty()) {
        return; // Or throw an exception if preferred
    }

    Tournee tournee = tourneeOpt.get();
    
    try {
        // 1. Assign chauffeur
        if (chauffeurId != null) {
            agentRepository.findById(chauffeurId).ifPresent(chauffeur -> {
                if ("chauffeur".equalsIgnoreCase(chauffeur.getTache()) && chauffeur.getDisponibilite()) {
                    // If there's an existing chauffeur, mark them as available first
                    if (tournee.getAgentChauffeur() != null) {
                        tournee.getAgentChauffeur().setDisponibilite(true);
                        agentRepository.save(tournee.getAgentChauffeur());
                    }
                    
                    tournee.setAgentChauffeur(chauffeur);
                    chauffeur.setDisponibilite(false);
                    agentRepository.save(chauffeur);
                }
            });
        }

        // 2. Assign vehicle
        if (vehiculeId != null) {
            vehiculeRepository.findById(vehiculeId).ifPresent(vehicule -> {
                if (vehicule.isDisponibilite()) {
                    // If there's an existing vehicle, mark it as available first
                    if (tournee.getVehicule() != null) {
                        tournee.getVehicule().setDisponibilite(true);
                        vehiculeRepository.save(tournee.getVehicule());
                    }
                    
                    tournee.setVehicule(vehicule);
                    vehicule.setDisponibilite(false);
                    vehiculeRepository.save(vehicule);
                }
            });
        }

        // 3. Assign two collection agents
        List<Agent> availableCollectAgents = agentRepository.findByTacheAndDisponibiliteTrue("collecte");
        
        // Release any previously assigned collectors
        if (tournee.getAgentRamasseurs() != null) {
            tournee.getAgentRamasseurs().forEach(agent -> {
                agent.setDisponibilite(true);
                agentRepository.save(agent);
            });
        }

        // Assign up to 2 available collectors
        if (!availableCollectAgents.isEmpty()) {
            int agentsToAssign = Math.min(2, availableCollectAgents.size());
            List<Agent> assignedAgents = availableCollectAgents.subList(0, agentsToAssign);
            
            assignedAgents.forEach(agent -> {
                agent.setDisponibilite(false);
                agentRepository.save(agent);
            });
            
            tournee.setAgentRamasseurs(assignedAgents);
        } else {
            tournee.setAgentRamasseurs(Collections.emptyList()); // Clear if no agents available
        }

        // 4. Save the updated tournee
        tourneeRepository.save(tournee);
        
    } catch (Exception e) {
        // Handle or log the exception as needed
        throw new RuntimeException("Error assigning tour: " + e.getMessage(), e);
    }
}

    @Override
    public void supprimerTournee(String tourneeId) {
        deleteTournee(tourneeId);
    }

    @Override
    public TourneeDto modifierTournee(TourneeDto dto) {
        return updateTournee(dto.getId(), dto);
    }

    @Override
    public double moyenneDureeTournees() {
        return getDureeMoyenneTournees();
    }

	
    
    
}