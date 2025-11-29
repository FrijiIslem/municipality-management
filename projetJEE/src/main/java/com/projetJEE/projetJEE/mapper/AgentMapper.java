package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.dto.AgentDTO;

import org.springframework.stereotype.Component;

@Component
public class AgentMapper {

    public AgentDTO toDTO(Agent agent) {
        if (agent == null) return null;

        return AgentDTO.builder()
                .id(agent.getId())
                .nom(agent.getNom())
                .prenom(agent.getPrenom())
                .email(agent.getEmail())
                .numeroTel(agent.getNumeroTel())
                .role(agent.getRole() != null ? com.projetJEE.projetJEE.dto.AgentDTO.RoleUtilisateur.valueOf(agent.getRole().name()) : null)
                .disponibilite(agent.getDisponibilite())
                .plageHoraire(agent.getPlageHoraire())
                .tache(agent.getTache())
                .build();
    }

    public Agent toEntity(AgentDTO dto) {
        if (dto == null) return null;

        Agent agent = new Agent();
        agent.setId(dto.getId());
        agent.setNom(dto.getNom());
        agent.setPrenom(dto.getPrenom());
        agent.setEmail(dto.getEmail());
        agent.setNumeroTel(dto.getNumeroTel());
        agent.setRole(dto.getRole() != null ? Agent.RoleUtilisateur.valueOf(dto.getRole().name()) : null);
        agent.setDisponibilite(dto.getDisponibilite());
        agent.setPlageHoraire(dto.getPlageHoraire());
        agent.setTache(dto.getTache());
        return agent;
    }

    public java.util.List<AgentDTO> toDTOList(java.util.List<Agent> list) {
        if (list == null) return null;
        return list.stream().map(this::toDTO).collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<Agent> toEntityList(java.util.List<AgentDTO> list) {
        if (list == null) return null;
        return list.stream().map(this::toEntity).collect(java.util.stream.Collectors.toList());
    }
}
