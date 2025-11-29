package com.projetJEE.projetJEE.entities;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;
@Data
@NoArgsConstructor
@Document(collection = "citoyens")
public class Citoyen {

    @org.springframework.data.annotation.Id
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
    private String adresse;
}