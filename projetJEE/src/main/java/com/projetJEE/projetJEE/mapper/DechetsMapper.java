package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.entities.Dechets;
import org.springframework.stereotype.Component;

@Component
public class DechetsMapper {

    public DechetsDTO toDTO(Dechets d) {
        DechetsDTO dto = new DechetsDTO();
        dto.setId(d.getId());
        dto.setType(d.getType());
        return dto;
    }

    public Dechets toEntity(DechetsDTO dto) {
        return Dechets.builder()
                .id(dto.getId())
                .type(dto.getType())
                .build();
    }
}
