package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.VehiculeDTO;
import com.projetJEE.projetJEE.entities.Vehicule;
import org.springframework.stereotype.Component;

@Component
public class VehiculeMapper {

    public VehiculeDTO toDTO(Vehicule v) {
        VehiculeDTO dto = new VehiculeDTO();
        dto.setId(v.getId());
        dto.setMatricule(v.getMatricule());
        dto.setCapaciteMax(v.getCapaciteMax());
        dto.setDisponibilite(v.isDisponibilite());
        return dto;
    }

    public Vehicule toEntity(VehiculeDTO dto) {
        return Vehicule.builder()
                .id(dto.getId())
                .matricule(dto.getMatricule())
                .capaciteMax(dto.getCapaciteMax())
                .disponibilite(dto.isDisponibilite())
                .build();
    }
}
