package com.projetJEE.projetJEE.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Tournee {
    @Id private String id;
    private List<Conteneur> conteneur;
    private Agent agent;
    private LocalDateTime dateDebut;
    private String itineraire;
    private EtatTournee etat;
    private Vehicule vehicule;
}