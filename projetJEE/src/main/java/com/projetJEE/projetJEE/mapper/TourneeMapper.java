package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Tournee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TourneeMapper {

    private final ConteneurMapper conteneurMapper;
    private final VehiculeMapper vehiculeMapper;

    @Autowired
    public TourneeMapper(ConteneurMapper conteneurMapper, VehiculeMapper vehiculeMapper) {
        this.conteneurMapper = conteneurMapper;
        this.vehiculeMapper = vehiculeMapper;
    }

    public TourneeDto toDTO(Tournee entity) {
        if (entity == null) return null;

        return TourneeDto.builder()
                .id(entity.getId())
                .conteneurs(entity.getConteneurs() != null ? conteneurMapper.toDTOList(entity.getConteneurs()) : null)
                .agentChauffeur(entity.getAgentChauffeur() != null ? AgentMapper.toDTO(entity.getAgentChauffeur()) : null)
                .agentRamasseurs(entity.getAgentRamasseurs() != null ? AgentMapper.toDTOList(entity.getAgentRamasseurs()) : null)
                .dateDebut(entity.getDateDebut())
                .dateFin(entity.getDateFin())
                .itineraire(entity.getItineraire())
                .etat(entity.getEtat())
                .vehicule(entity.getVehicule() != null ? vehiculeMapper.toDTO(entity.getVehicule()) : null)
                .build();
    }

    public Tournee toEntity(TourneeDto dto) {
        if (dto == null) return null;

        return Tournee.builder()
                .id(dto.getId())
                .conteneurs(dto.getConteneurs() != null ? conteneurMapper.toEntityList(dto.getConteneurs()) : null)
                .agentChauffeur(dto.getAgentChauffeur() != null ? AgentMapper.toEntity(dto.getAgentChauffeur()) : null)
                .agentRamasseurs(dto.getAgentRamasseurs() != null ? AgentMapper.toEntityList(dto.getAgentRamasseurs()) : null)
                .dateDebut(dto.getDateDebut())
                .dateFin(dto.getDateFin())
                .itineraire(dto.getItineraire())
                .etat(dto.getEtat())
                .vehicule(dto.getVehicule() != null ? vehiculeMapper.toEntity(dto.getVehicule()) : null)
                .build();
    }

    public List<TourneeDto> toDTOList(List<Tournee> list) {
        if (list == null) return null;
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<Tournee> toEntityList(List<TourneeDto> list) {
        if (list == null) return null;
        return list.stream().map(this::toEntity).collect(Collectors.toList());
    }
}