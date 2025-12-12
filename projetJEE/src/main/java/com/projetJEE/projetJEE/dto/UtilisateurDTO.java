package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurDTO {
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private Long numeroTel;
    private RoleUtilisateur role; // ADMIN, AGENT ou CITOYEN
}
