package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entities.enums.TypeTache;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentDTO {

    public enum RoleUtilisateur {
        AGENT,
        CITOYEN,
        ADMIN
    }
	   private String id;
	    private String nom;
	    private String prenom;
	    private String email;
	    private Long numeroTel;
	    private RoleUtilisateur role;

	    private Boolean disponibilite;
	    private String plageHoraire;
	    private TypeTache tache; 
}
