package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.IncidentDTO;
import com.projetJEE.projetJEE.entities.Incident;

public class IncidentMapper {
	
	 // Entity → DTO
    public static IncidentDTO toDTO(Incident incident) {
        if (incident == null) return null;
        return IncidentDTO.builder()
                .id(incident.getId())
                .categorie(incident.getCategorie())
                .date(incident.getDate())
                .description(incident.getDescription())
                .statut(incident.getStatut())
                .utilisateurId(incident.getUtilisateurId())
                .build();
    }
    // DTO → Entity
    public static Incident toEntity(IncidentDTO dto) {
        if (dto == null) return null;
        Incident incident = new Incident();
        incident.setId(dto.getId());
        incident.setCategorie(dto.getCategorie());
        incident.setDate(dto.getDate());
        incident.setDescription(dto.getDescription());
        incident.setStatut(dto.getStatut());
        incident.setUtilisateurId(dto.getUtilisateurId());
        return incident;
    }
}
