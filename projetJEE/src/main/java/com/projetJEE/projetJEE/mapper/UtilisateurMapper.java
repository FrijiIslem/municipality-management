package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.dto.UtilisateurDTO;

public class UtilisateurMapper {

    public static UtilisateurDTO toDTO(Utilisateur utilisateur) {
        if (utilisateur == null) return null;

        return UtilisateurDTO.builder()
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .numeroTel(utilisateur.getNumeroTel())
                .role(utilisateur.getRole())
                .build();
    }

    public static Utilisateur toEntity(UtilisateurDTO dto) {
        if (dto == null) return null;

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(dto.getId());
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setNumeroTel(dto.getNumeroTel());
        utilisateur.setRole(dto.getRole());
        return utilisateur;
    }
}
