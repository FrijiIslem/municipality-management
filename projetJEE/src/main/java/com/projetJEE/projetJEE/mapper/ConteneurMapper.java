package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.entities.Dechets;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ConteneurMapper {

    // ====================================
    //           ENTITY → DTO
    // ====================================
    public ConteneurDTO toDTO(Conteneur cont) {
        if (cont == null) return null;

        ConteneurDTO dto = new ConteneurDTO();
        dto.setId(cont.getId());
        dto.setLocalisation(cont.getLocalisation());
        dto.setCouleurStatut(cont.getCouleurStatut());
        dto.setEtatRemplissage(cont.getEtatRemplissage());
        dto.setQuantite_max(Conteneur.quantite_max);

        dto.setDechets(
            cont.getDechets()
                .stream()
                .map(this::toDechetsDTO)
                .collect(Collectors.toList())
        );

        return dto;
    }

    private DechetsDTO toDechetsDTO(Dechets d) {
        if (d == null) return null;

        DechetsDTO dto = new DechetsDTO();
        dto.setId(d.getId());
        dto.setType(d.getType());
        return dto;
    }

    // ====================================
    //           DTO → ENTITY
    // ====================================
    public Conteneur toEntity(ConteneurDTO dto) {
        if (dto == null) return null;

        Conteneur cont = new Conteneur();
        cont.setId(dto.getId());
        cont.setLocalisation(dto.getLocalisation());
        cont.setCouleurStatut(dto.getCouleurStatut());
        cont.setEtatRemplissage(dto.getEtatRemplissage());

        if (dto.getDechets() != null) {
            cont.setDechets(
                dto.getDechets()
                    .stream()
                    .map(this::toDechetsEntity)
                    .collect(Collectors.toList())
            );
        }

        return cont;
    }

    public Dechets toDechetsEntity(DechetsDTO dto) {
        if (dto == null) return null;

        Dechets d = new Dechets();
        d.setId(dto.getId());
        d.setType(dto.getType());

        return d;
    }

    // ====================================
    //           LIST MAPPERS
    // ====================================
    public List<ConteneurDTO> toDTOList(List<Conteneur> list) {
        if (list == null) return null;
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<Conteneur> toEntityList(List<ConteneurDTO> list) {
        if (list == null) return null;
        return list.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
