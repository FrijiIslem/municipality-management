package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.dto.TourneeDto;
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
    void deleteTournee(String id);
    Duration getDureeTournee(String id);
    List<TourneeDto> getTourneesByEtat(EtatTournee etat);
    Double getDureeMoyenneTournees();
    List<TourneeDto> getTourneesByAgent(String agentId);
    
    // Legacy methods for backward compatibility
    void affecterTournee(String tourneeId, String agentId, String vehiculeId);
    void supprimerTournee(String tourneeId);
    TourneeDto modifierTournee(TourneeDto dto);
    double moyenneDureeTournees();
    

    
}