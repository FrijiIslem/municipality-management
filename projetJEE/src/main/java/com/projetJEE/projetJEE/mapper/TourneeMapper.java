package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.dto.AgentDTO;
import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TourneeMapper {

    private final ConteneurMapper conteneurMapper;
    private final VehiculeMapper vehiculeMapper;
    private final UtilisateurRepository utilisateurRepository;

    public TourneeMapper(ConteneurMapper conteneurMapper, VehiculeMapper vehiculeMapper, UtilisateurRepository utilisateurRepository) {
        this.conteneurMapper = conteneurMapper;
        this.vehiculeMapper = vehiculeMapper;
        this.utilisateurRepository = utilisateurRepository;
    }

    public TourneeDto toDTO(Tournee entity) {
        if (entity == null) return null;

        // Charger l'agent chauffeur depuis l'ID
        AgentDTO agentChauffeurDTO = null;
        if (entity.getAgentChauffeurId() != null) {
            agentChauffeurDTO = utilisateurRepository.findById(entity.getAgentChauffeurId())
                    .filter(u -> u instanceof Agent)
                    .map(u -> AgentMapper.toDTO((Agent) u))
                    .orElse(null);
        }

        // Charger les agents ramasseurs depuis les IDs
        List<AgentDTO> agentRamasseursDTO = null;
        if (entity.getAgentRamasseursIds() != null && !entity.getAgentRamasseursIds().isEmpty()) {
            agentRamasseursDTO = entity.getAgentRamasseursIds().stream()
                    .map(id -> utilisateurRepository.findById(id)
                            .filter(u -> u instanceof Agent)
                            .map(u -> AgentMapper.toDTO((Agent) u))
                            .orElse(null))
                    .filter(agent -> agent != null)
                    .collect(Collectors.toList());
        }

        return TourneeDto.builder()
                .id(entity.getId())
                .conteneurs(entity.getConteneurs() != null ? conteneurMapper.toDTOList(entity.getConteneurs()) : null)
                .agentChauffeur(agentChauffeurDTO)
                .agentRamasseurs(agentRamasseursDTO)
                .dateDebut(entity.getDateDebut())
                .dateFin(entity.getDateFin())
                .itineraire(entity.getItineraire())
                .etat(entity.getEtat())
                .vehicule(entity.getVehicule() != null ? vehiculeMapper.toDTO(entity.getVehicule()) : null)
                .build();
    }

    public Tournee toEntity(TourneeDto dto) {
        if (dto == null) return null;

        // Extraire l'ID du chauffeur depuis le DTO
        String agentChauffeurId = null;
        if (dto.getAgentChauffeur() != null && dto.getAgentChauffeur().getId() != null) {
            agentChauffeurId = dto.getAgentChauffeur().getId();
        }

        // Extraire les IDs des ramasseurs depuis le DTO
        List<String> agentRamasseursIds = null;
        if (dto.getAgentRamasseurs() != null && !dto.getAgentRamasseurs().isEmpty()) {
            agentRamasseursIds = dto.getAgentRamasseurs().stream()
                    .map(AgentDTO::getId)
                    .filter(id -> id != null)
                    .collect(Collectors.toList());
        }

        return Tournee.builder()
                .id(dto.getId())
                .conteneurs(dto.getConteneurs() != null ? conteneurMapper.toEntityList(dto.getConteneurs()) : null)
                .agentChauffeurId(agentChauffeurId)
                .agentRamasseursIds(agentRamasseursIds)
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