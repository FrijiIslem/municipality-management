package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entities.Agent.TypeTache;
import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentDTO {
	   private String id;
	    private String nom;
	    private String prenom;
	    private String email;
	    private Long numeroTel;
	    private Utilisateur.RoleUtilisateur role;

	    private Boolean disponibilite;
	    private String plageHoraire;
	    private TypeTache tache; 
}
