package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entities.Utilisateur;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitoyenDTO {
    private String id;
    private String nom;
    private String prenom;
    private String email;
    private Long numeroTel;
    private Utilisateur.RoleUtilisateur role;
    private String adresse;
}
