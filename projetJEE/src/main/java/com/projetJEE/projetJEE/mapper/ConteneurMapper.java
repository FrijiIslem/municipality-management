package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.entities.Dechets;
import com.projetJEE.projetJEE.repository.DechetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class ConteneurMapper {

    @Autowired
    private DechetsRepository dechetsRepository;

    public ConteneurDTO toDTO(Conteneur c) {
        if (c == null) return null; // <-- évite le crash

        return ConteneurDTO.builder()
                .id(c.getId())
                .localisation(c.getLocalisation())
                .couleurStatut(c.getCouleurStatut())
                .etatRemplissage(c.getEtatRemplissage())
                .typeDechetsId(c.getTypeDechetsId())
                .build();
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
        if (list == null) return Collections.emptyList();
        return list.stream()
                .filter(Objects::nonNull) // <-- AJOUT ESSENTIEL !!!
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    public List<Conteneur> toEntityList(List<ConteneurDTO> list) {
        if (list == null) return null;
        return list.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
