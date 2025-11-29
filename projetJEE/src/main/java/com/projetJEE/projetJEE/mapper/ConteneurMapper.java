package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.entities.Dechets;
import com.projetJEE.projetJEE.repository.DechetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ConteneurMapper {

    @Autowired
    private DechetsRepository dechetsRepository;

    public ConteneurDTO toDTO(Conteneur c) {
        ConteneurDTO dto = new ConteneurDTO();
        dto.setId(c.getId());
        dto.setLocalisation(c.getLocalisation());
        dto.setCouleurStatut(c.getCouleurStatut());
        dto.setEtatRemplissage(c.getEtatRemplissage());
        dto.setTypeDechetsId(c.getTypeDechets() != null ? c.getTypeDechets().getId() : null);
        return dto;
    }

    public Conteneur toEntity(ConteneurDTO dto) {
        if (dto == null) return null;

        Dechets dechets = null;
        if (dto.getTypeDechetsId() != null) {
            dechets = dechetsRepository.findById(dto.getTypeDechetsId()).orElse(null);
        }

        return Conteneur.builder()
                .id(dto.getId())
                .localisation(dto.getLocalisation())
                .couleurStatut(dto.getCouleurStatut())
                .etatRemplissage(dto.getEtatRemplissage())
                .typeDechets(dechets)
                .build();
    }

    public List<ConteneurDTO> toDTOList(List<Conteneur> list) {
        if (list == null) return null;
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<Conteneur> toEntityList(List<ConteneurDTO> list) {
        if (list == null) return null;
        return list.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
