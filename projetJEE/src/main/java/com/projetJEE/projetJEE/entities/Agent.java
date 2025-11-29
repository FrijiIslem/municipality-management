package com.projetJEE.projetJEE.entities;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;



@Data

@NoArgsConstructor
@Document(collection = "agents")
public class Agent {

    @Id
    private String id;
    private String email;
    private String nom;
    private Long numeroTel;
    private String password;
    private String prenom;
    public enum RoleUtilisateur {
        AGENT,
        CITOYEN,
        ADMIN
    }

    private RoleUtilisateur role;
    private Boolean disponibilite;
    private String plageHoraire;
    private String tache;
}

