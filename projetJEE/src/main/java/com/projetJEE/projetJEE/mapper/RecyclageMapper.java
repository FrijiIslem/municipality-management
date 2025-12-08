package com.projetJEE.projetJEE.mapper;

import org.springframework.stereotype.Component;
import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.entities.Recyclage;

@Component
public class RecyclageMapper {

    // Conversion ENTITY → DTO
    public RecyclageDTO toDTO(Recyclage r) {
        if (r == null) return null;

        RecyclageDTO dto = new RecyclageDTO();
        dto.setId(r.getId());
        dto.setQuantite(r.getQuantite());
        dto.setTaux(r.getTaux());
        dto.setTypeDechet(r.getTypeDechet());

        return dto;
    }

    // Conversion DTO → ENTITY
    public Recyclage toEntity(RecyclageDTO dto) {
        if (dto == null) return null;

        Recyclage r = new Recyclage();
        r.setId(dto.getId());
        r.setQuantite(dto.getQuantite());
        r.setTaux(dto.getTaux());
        r.setTypeDechet(dto.getTypeDechet());

        return r;
    }
}
