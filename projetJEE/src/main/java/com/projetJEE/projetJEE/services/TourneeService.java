package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;

import java.time.Duration;
import java.util.List;

public interface TourneeService {
    List<TourneeDto> getAllTournees();
    TourneeDto getTourneeById(String id);
    TourneeDto createTournee(TourneeDto tourneeDto);
    TourneeDto planifierTournee(TourneeDto tourneeDto);
    TourneeDto updateTournee(String id, TourneeDto tourneeDto);
    TourneeDto validerTournee(String id);
    TourneeDto libererTournee(String id);
    TourneeDto affecterAgent(String id, String agentId);
    TourneeDto affectervehicule(String id, String vehiculeId);
    Duration getDureeTournee(String id);
    List<TourneeDto> getTourneesByEtat(EtatTournee etat);
    void deleteTournee(String id);
    List<TourneeDto> getTourneesByAgent(String agentId);
    Double getDureeMoyenneTournees();
    
    /**
     * Démarre une tournée (appelé par l'agent)
     * Met l'état à ENCOURS et enregistre la date de début
     */
    TourneeDto demarrerTournee(String id);
    
    /**
     * Termine une tournée (appelé par l'agent)
     * Met l'état à TERMINEE, enregistre la date de fin et libère les ressources
     */
    TourneeDto terminerTournee(String id);
}