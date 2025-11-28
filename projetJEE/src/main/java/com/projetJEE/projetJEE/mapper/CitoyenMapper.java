package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.dto.CitoyenDTO;

public class CitoyenMapper {

    public static CitoyenDTO toDTO(Citoyen citoyen) {
        if (citoyen == null) return null;

        return CitoyenDTO.builder()
                .id(citoyen.getId())
                .nom(citoyen.getNom())
                .prenom(citoyen.getPrenom())
                .email(citoyen.getEmail())
                .numeroTel(citoyen.getNumeroTel())
                .role(citoyen.getRole())
                .adresse(citoyen.getAdresse())
                .build();
    }

    public static Citoyen toEntity(CitoyenDTO dto) {
        if (dto == null) return null;

        Citoyen citoyen = new Citoyen();
        citoyen.setId(dto.getId());
        citoyen.setNom(dto.getNom());
        citoyen.setPrenom(dto.getPrenom());
        citoyen.setEmail(dto.getEmail());
        citoyen.setNumeroTel(dto.getNumeroTel());
        citoyen.setRole(dto.getRole());
        citoyen.setAdresse(dto.getAdresse());
        return citoyen;
    }
}
