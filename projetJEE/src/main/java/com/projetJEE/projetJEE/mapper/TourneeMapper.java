package com.projetJEE.projetJEE.mapper;


import com.projetJEE.projetJEE.dto.*;
import com.projetJEE.projetJEE.entities.*;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TourneeMapper {

    // Même style que votre ConteneurMapper
    public TourneeDto toDTO(Tournee t) {
        TourneeDto dto = new TourneeDto();
        dto.setId(t.getId());
        dto.setConteneurIds(extractConteneurIds(t.getConteneur()));  // IDs seulement
        dto.setAgentId(t.getAgent() != null ? t.getAgent().getId() : null);
        dto.setDateDebut(t.getDateDebut());
        dto.setEtat(t.getEtat());
        dto.setItineraire(t.getItineraire());
        dto.setVehiculeId(t.getVehicule() != null ? t.getVehicule().getId() : null);
        return dto;
    }



	public Tournee toEntity(TourneeDto dto, 
                           List<Conteneur> conteneurs, 
                           Agent agent, 
                           Vehicule vehicule) {
        return Tournee.builder()
                .id(dto.getId())
                .conteneur(conteneurs)  // Liste complète objets
                .agent(agent)
                .dateDebut(dto.getDateDebut())
                .etat(dto.getEtat())
                .itineraire(dto.getItineraire())
                .vehicule(vehicule)
                .build();
    }}
