package com.projetJEE.projetJEE.mapper;  // ✅ Package corrigé

import com.projetJEE.projetJEE.dto.*;     // ✅ Package corrigé
import com.projetJEE.projetJEE.entities.*;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

import com.projetJEE.projetJEE.repository.*; // ✅ Pour extractXXX()
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component 
public class TourneeMapper {

    @Autowired private ConteneurRepository conteneurRepository;
    @Autowired private AgentRepository agentRepository;
    @Autowired private VehiculeRepository vehiculeRepository;

    // Entity → DTO (IDs simples)
    public TourneeDto toDTO(Tournee t) {
        if (t == null) return null;
        TourneeDto dto = new TourneeDto();
        dto.setId(t.getId());
        dto.setConteneurIds(extractConteneurIds(t.getConteneur()));
        dto.setAgentId(t.getAgent() != null ? t.getAgent().getId() : null);
        dto.setDateDebut(t.getDateDebut());
        dto.setEtat(t.getEtat());
        dto.setItineraire(t.getItineraire());
        dto.setVehiculeId(t.getVehicule() != null ? t.getVehicule().getId() : null);
        return dto;
    }

    // DTO → Entity (récupère objets par IDs)
    public Tournee toEntity(TourneeDto dto) {
        if (dto == null) return null;
        List<Conteneur> conteneurs = extractConteneurs(dto.getConteneurIds());
        Agent agent = extractAgent(dto.getAgentId());
        Vehicule vehicule = extractVehicule(dto.getVehiculeId());
        
        return Tournee.builder()
                .id(dto.getId())
                .conteneur(conteneurs)
                .agent(agent)
                .dateDebut(dto.getDateDebut())
                .etat(dto.getEtat())
                .itineraire(dto.getItineraire())
                .vehicule(vehicule)
                .build();
    }

    // ✅ MÉTHODES MANQUANTES IMPLÉMENTÉES
    private List<String> extractConteneurIds(List<Conteneur> conteneurs) {
        if (conteneurs == null) return null;
        return conteneurs.stream().map(Conteneur::getId).collect(Collectors.toList());
    }

    private List<Conteneur> extractConteneurs(List<String> ids) {
        if (ids == null || ids.isEmpty()) return null;
        return conteneurRepository.findAllById(ids);
    }

    private Agent extractAgent(String id) {
        if (id == null) return null;
        return agentRepository.findById(id).orElse(null);
    }

    private Vehicule extractVehicule(String id) {
        if (id == null) return null;
        return vehiculeRepository.findById(id).orElse(null);
    }

    public List<TourneeDto> toDTOList(List<Tournee> list) {
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
