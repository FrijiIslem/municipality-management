package com.projetJEE.projetJEE.mapper;


import com.projetJEE.projetJEE.dto.*;
import com.projetJEE.projetJEE.entities.*;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TourneeMapper {

    // Conteneur
    public ConteneurDto toDto(Conteneur c) {
        if (c == null) return null;
        return ConteneurDto.builder()
                .id(c.getId())
                .localisation(c.getLocalisation())
                .etatRemplissage(c.getEtatRemplissage())
                .build();
    }

    public Conteneur toEntity(ConteneurDto dto) {
        if (dto == null) return null;
        return Conteneur.builder()
                .id(dto.getId())
                .localisation(dto.getLocalisation())
                .etatRemplissage(dto.getEtatRemplissage())
                .build();
    }

    public List<ConteneurDto> toDtoList(List<Conteneur> list) {
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<Conteneur> toEntityList(List<ConteneurDto> list) {
        return list.stream().map(this::toEntity).collect(Collectors.toList());
    }

    // Agent
    public AgentDto toDto(Agent a) {
        if (a == null) return null;
        return AgentDto.builder()
                .id(a.getId())
                .nom(a.getNom())
                .telephone(a.getTelephone())
                .build();
    }

    public Agent toEntity(AgentDto dto) {
        if (dto == null) return null;
        return Agent.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .telephone(dto.getTelephone())
                .build();
    }

    // Vehicule
    public VehiculeDto toDto(Vehicule v) {
        if (v == null) return null;
        return VehiculeDto.builder()
                .id(v.getId())
                .matricule(v.getMatricule())
                .capaciteMax(v.getCapaciteMax())
                .disponibilite(v.getDisponibilite())
                .build();
    }

    public Vehicule toEntity(VehiculeDto dto) {
        if (dto == null) return null;
        return Vehicule.builder()
                .id(dto.getId())
                .matricule(dto.getMatricule())
                .capaciteMax(dto.getCapaciteMax())
                .disponibilite(dto.getDisponibilite())
                .build();
    }

    // TOURNEES UNIQUEMENT
    public TourneeDto toDto(Tournee t) {
        if (t == null) return null;
        return TourneeDto.builder()
                .id(t.getId())
                .conteneur(toDtoList(t.getConteneur()))
                .agent(toDto(t.getAgent()))
                .dateDebut(t.getDateDebut())
                .etat(t.getEtat())
                .itineraire(t.getItineraire())
                .vehicule(toDto(t.getVehicule()))
                .build();
    }

    public Tournee toEntity(TourneeDto dto) {
        if (dto == null) return null;
        return Tournee.builder()
                .id(dto.getId())
                .conteneur(toEntityList(dto.getConteneur()))
                .agent(toEntity(dto.getAgent()))
                .dateDebut(dto.getDateDebut())
                .etat(dto.getEtat())
                .itineraire(dto.getItineraire())
                .vehicule(toEntity(dto.getVehicule()))
                .build();
    }

    public List<TourneeDto> toDtoList(List<Tournee> list) {
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }
}
