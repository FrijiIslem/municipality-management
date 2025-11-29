package com.projetJEE.projetJEE.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;

@Data 
@NoArgsConstructor 
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TourneeDto {
    private String id;
    private List<ConteneurDTO> conteneurs;
    private AgentDTO agentChauffeur;
    private List<AgentDTO> agentRamasseurs;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String itineraire;
    private EtatTournee etat;
    private VehiculeDTO vehicule;
}
