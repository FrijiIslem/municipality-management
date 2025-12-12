package com.projetJEE.projetJEE.entities;

import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@Document(collection = "utilisateurs")
@JsonInclude(JsonInclude.Include.NON_NULL)
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

    @JsonProperty("email")
    private String email;
    
    @JsonProperty("nom")
    private String nom;
    
    @JsonProperty("numeroTel")
    private Long numeroTel;
    
    @JsonProperty("password")
    private String password;
    
    @JsonProperty("prenom")
    private String prenom;
    
    @JsonProperty("role")
    private RoleUtilisateur role;
}
