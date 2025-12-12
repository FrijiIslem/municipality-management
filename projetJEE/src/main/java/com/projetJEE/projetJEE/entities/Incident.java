package com.projetJEE.projetJEE.entities;


import lombok.Data;	
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "incidents")
public class Incident {
	public enum StatutIncident {
	    SEEN,
	    EN_ATTENTE,
	    FIXEE
	}
	public enum CategorieIncident {
	    RETARD,
	    PANNE_VEHICULE,
	    CONTENEUR
	}
    @Id
    private String id;
    
    private CategorieIncident categorie;
    private Date date;
    private String description;
    private StatutIncident statut;
    private String utilisateurId; 
}