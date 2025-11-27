package com.projetJEE.projetJEE.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import com.projetJEE.projetJEE.enums.EtatTournee;

@Data @Builder
public class TourneeDto {
    private String id;
    private List<ConteneurDto> conteneur;
    private AgentDto agent;
    private LocalDateTime dateDebut;
    private EtatTournee etat;
    private String itineraire;
    private VehiculeDto vehicule;
}
