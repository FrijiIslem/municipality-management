package com.projetJEE.projetJEE.entities;

import lombok.AllArgsConstructor;	
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.DBRef;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;

import jakarta.persistence.PrePersist;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;
@Document(collection = "tournees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class Tournee {
    @Id 
    private String id;
    
    private List<Conteneur> conteneurs;

    @DBRef
    @Builder.Default
    private Agent agentChauffeur = null;

    @DBRef
    @Builder.Default
    private List<Agent> agentRamasseurs = new ArrayList<>();

    private LocalDateTime dateDebut;
    private String itineraire;
    private EtatTournee etat;
    private Vehicule vehicule;
    private LocalDateTime dateFin;

    @PrePersist
    public void prePersist() {
        if (this.agentChauffeur == null) {
            this.agentChauffeur = null;  // Explicitly set to null
        }
        if (this.agentRamasseurs == null) {
            this.agentRamasseurs = new ArrayList<>();
        }
    }
}