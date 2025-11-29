package com.projetJEE.projetJEE.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;


import com.projetJEE.projetJEE.entities.enums.EtatTournee;

@Data @NoArgsConstructor @Builder
@AllArgsConstructor
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
