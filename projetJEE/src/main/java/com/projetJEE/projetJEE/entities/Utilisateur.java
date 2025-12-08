package com.projetJEE.projetJEE.entities;
import lombok.Data;	
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "utilisateurs")
public class Utilisateur {
	public enum RoleUtilisateur {
	    AGENT,
	    CITOYEN,
	    ADMIN
	}
	public enum TypeNotification {
	    ALERT,
	    REMINDER,
	    SUCCESS
	}
    @Id
    private String id;
    
    private String email;
    private String nom;
    private Long numeroTel;
    private String password;
    private String prenom;
    private RoleUtilisateur role;
}
