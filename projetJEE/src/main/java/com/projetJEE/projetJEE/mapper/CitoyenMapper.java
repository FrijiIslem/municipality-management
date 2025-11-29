package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.dto.CitoyenDTO;

import org.springframework.stereotype.Component;

@Component
public class CitoyenMapper {

    public CitoyenDTO toDTO(Citoyen citoyen) {
        if (citoyen == null) return null;

        return CitoyenDTO.builder()
                .id(citoyen.getId())
                .nom(citoyen.getNom())
                .prenom(citoyen.getPrenom())
                .email(citoyen.getEmail())
                .numeroTel(citoyen.getNumeroTel())
                .role(citoyen.getRole() != null ? com.projetJEE.projetJEE.dto.CitoyenDTO.RoleUtilisateur.valueOf(citoyen.getRole().name()) : null)
                .adresse(citoyen.getAdresse())
                .build();
    }

    public Citoyen toEntity(CitoyenDTO dto) {
        if (dto == null) return null;

        Citoyen citoyen = new Citoyen();
        citoyen.setId(dto.getId());
        citoyen.setNom(dto.getNom());
        citoyen.setPrenom(dto.getPrenom());
        citoyen.setEmail(dto.getEmail());
        citoyen.setNumeroTel(dto.getNumeroTel());
        citoyen.setRole(dto.getRole() != null ? com.projetJEE.projetJEE.entities.Citoyen.RoleUtilisateur.valueOf(dto.getRole().name()) : null);
        citoyen.setAdresse(dto.getAdresse());
        return citoyen;
    }

    public java.util.List<CitoyenDTO> toDTOList(java.util.List<Citoyen> list) {
        if (list == null) return null;
        return list.stream().map(this::toDTO).collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<Citoyen> toEntityList(java.util.List<CitoyenDTO> list) {
        if (list == null) return null;
        return list.stream().map(this::toEntity).collect(java.util.stream.Collectors.toList());
    }
}
