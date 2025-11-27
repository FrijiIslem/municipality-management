package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.projetJEE.projetJEE.entity.Conteneur;
import com.projetJEE.projetJEE.entity.Dechets;
import org.springframework.stereotype.Component;

@Component
public class ConteneurMapper {

    public ConteneurDTO toDTO(Conteneur c) {
        ConteneurDTO dto = new ConteneurDTO();
        dto.setId(c.getId());
        dto.setLocalisation(c.getLocalisation());
        dto.setCouleurStatut(c.getCouleurStatut());
        dto.setEtatRemplissage(c.getEtatRemplissage());
        dto.setTypeDechetsId(c.getTypeDechets() != null ? c.getTypeDechets().getId() : null);
        return dto;
    }

    public Conteneur toEntity(ConteneurDTO dto, Dechets dechets) {
        return Conteneur.builder()
                .id(dto.getId())
                .localisation(dto.getLocalisation())
                .couleurStatut(dto.getCouleurStatut())
                .etatRemplissage(dto.getEtatRemplissage())
                .typeDechets(dechets)
                .build();
    }
}
