package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Tournee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TourneeMapper {

    @Autowired
    private AgentMapper agentMapper;
    @Autowired
    private ConteneurMapper conteneurMapper;
    @Autowired
    private VehiculeMapper vehiculeMapper;

    public TourneeDto toDTO(Tournee entity) {
        if (entity == null) return null;

        return TourneeDto.builder()
                .id(entity.getId())
                .conteneurs(conteneurMapper.toDTOList(entity.getConteneur()))
                .agentChauffeur(agentMapper.toDTO(entity.getAgentChauffeur()))
                .agentRamasseurs(agentMapper.toDTOList(entity.getAgentRamasseurs()))
                .dateDebut(entity.getDateDebut())
                .dateFin(entity.getDateFin())
                .itineraire(entity.getItineraire())
                .etat(entity.getEtat())
                .vehicule(vehiculeMapper.toDTO(entity.getVehicule()))
                .build();
    }

    public Tournee toEntity(TourneeDto dto) {
        if (dto == null) return null;

        return Tournee.builder()
                .id(dto.getId())
                .conteneur(conteneurMapper.toEntityList(dto.getConteneurs()))
                .agentChauffeur(agentMapper.toEntity(dto.getAgentChauffeur()))
                .agentRamasseurs(agentMapper.toEntityList(dto.getAgentRamasseurs()))
                .dateDebut(dto.getDateDebut())
                .dateFin(dto.getDateFin())
                .itineraire(dto.getItineraire())
                .etat(dto.getEtat())
                .vehicule(vehiculeMapper.toEntity(dto.getVehicule()))
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