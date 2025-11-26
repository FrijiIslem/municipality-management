package com.projetJEE.projetJEE.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import com.projetJEE.projetJEE.enums.EtatTournee;

@Document(collection = "Tournee")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Tournee {
    @Id private String id;
    private List<String> conteneur;
    private String agent;
    private LocalDateTime dateDebut;
    private String itineraire;
    private EtatTournee etat;
    private String vehicule;
}
