package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.AgentDTO;
import com.projetJEE.projetJEE.entities.Agent;

import java.util.List;
import java.util.stream.Collectors;

public class AgentMapper {

    public static AgentDTO toDTO(Agent agent) {
        if (agent == null) return null;

        return AgentDTO.builder()
                .id(agent.getId())
                .nom(agent.getNom())
                .prenom(agent.getPrenom())
                .email(agent.getEmail())
                .numeroTel(agent.getNumeroTel())
                .role(agent.getRole())
                .disponibilite(agent.getDisponibilite())
                .plageHoraire(agent.getPlageHoraire())
                .tache(agent.getTache())
                .build();
    }

    public static Agent toEntity(AgentDTO dto) {
        if (dto == null) return null;

        Agent agent = new Agent();
        agent.setId(dto.getId());
        agent.setNom(dto.getNom());
        agent.setPrenom(dto.getPrenom());
        agent.setEmail(dto.getEmail());
        agent.setNumeroTel(dto.getNumeroTel());
        agent.setRole(dto.getRole());
        agent.setDisponibilite(dto.getDisponibilite());
        agent.setPlageHoraire(dto.getPlageHoraire());
        agent.setTache(dto.getTache());
        return agent;
    }



// zedtha ana islem !!!!!!!!!
    public static List<AgentDTO> toDTOList(List<Agent> agents) {
        if (agents == null) return null;
        return agents.stream().map(AgentMapper::toDTO).collect(Collectors.toList());
    }

    public static List<Agent> toEntityList(List<AgentDTO> dtos) {
        if (dtos == null) return null;
        return dtos.stream().map(AgentMapper::toEntity).collect(Collectors.toList());
    }
}
