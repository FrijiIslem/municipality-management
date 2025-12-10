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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
            tournee.setAgentChauffeur(source.getAgentChauffeur());
            tournee.setAgentRamasseurs(source.getAgentRamasseurs());
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
        tournee.setEtat(EtatTournee.ENCOURS);
        Tournee saved = tourneeRepository.save(tournee);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public TourneeDto libererTournee(String id) {
        Tournee tournee = tourneeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));

        tournee.setEtat(EtatTournee.TERMINEE);
        tournee.setDateFin(LocalDateTime.now());

        // Libérer les ressources (remettre les agents et véhicule en disponible)
        if (tournee.getAgentChauffeur() != null) {
            tournee.getAgentChauffeur().setDisponibilite(true);
        }

        if (tournee.getAgentRamasseurs() != null) {
            tournee.getAgentRamasseurs().forEach(agent -> {
                agent.setDisponibilite(true);
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
            if (tournee.getAgentChauffeur() != null) {
                tournee.getAgentChauffeur().setDisponibilite(true);
                utilisateurRepository.save(tournee.getAgentChauffeur());
            }
            tournee.setAgentChauffeur(agent);
            agent.setDisponibilite(false);
        } else if (agent.getTache() == Agent.TypeTache.COLLECTE) {
            List<Agent> collectors = tournee.getAgentRamasseurs() != null ? new ArrayList<>(tournee.getAgentRamasseurs()) : new ArrayList<>();
            if (collectors.size() < 2) {
                collectors.add(agent);
                tournee.setAgentRamasseurs(collectors);
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
    public Duration getDureeTournee(String id) {
        return tourneeRepository.findById(id).map(tournee -> {
            if (tournee.getDateDebut() != null && tournee.getDateFin() != null) {
                return Duration.between(tournee.getDateDebut(), tournee.getDateFin());
            }
            return Duration.ZERO;
        }).orElseThrow(() -> new ResourceNotFoundException("Tournee not found with id: " + id));
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
}