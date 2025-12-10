package com.projetJEE.projetJEE.entities;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;
import com.projetJEE.projetJEE.config.AgentDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonDeserialize(using = AgentDeserializer.class)
public class Agent extends Utilisateur {
	
    @JsonProperty("disponibilite")
    private Boolean disponibilite;
    
    @JsonProperty("plageHoraire")
    private String plageHoraire;
    
    @JsonProperty("tache")
    private TypeTache tache;

    public enum TypeTache {
        COLLECTE,
        CHAUFFEUR
    }
    
}