package com.projetJEE.projetJEE.dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitoyenDTO {

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

	    private String adresse;
	   
}
