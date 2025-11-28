package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.dto.AgentDTO;

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
}
