package com.projetJEE.projetJEE.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.projetJEE.projetJEE.entities.Agent;

@Data @NoArgsConstructor @Builder
public class TourneeDto {
    private Integer id;                    // ✅ Integer
    private List<Integer> conteneurIds;    // ✅ Integer List
    private Agent agentChauffeurId;      // ✅ Chauffeur ID
    private List<Agent> agentRamasseurIds;
    private LocalDateTime dateDebut;       // ✅ Pour mapper
    private LocalDateTime fin;
    private Map<String, Object> itineraire;
    private String statut;                 // ✅ String pour JSON
    private Integer vehiculeId;            // ✅ Integer
}
