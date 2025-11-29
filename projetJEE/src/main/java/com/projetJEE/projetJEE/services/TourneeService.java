package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.dto.TourneeDto;
import java.util.List;

public interface TourneeService {
    TourneeDto createTournee(TourneeDto dto);
    List<TourneeDto> getAllTournees();
    TourneeDto getTourneeById(String id);
    List<TourneeDto> getTourneesByAgent(String agentId);
    List<TourneeDto> getTourneesByEtat(String etat);

    void affecterTournee(String tourneeId, String agentId);
    long getDureeTournee(String tourneeId);
    void libererTournee(String tourneeId);
    TourneeDto modifierTournee(TourneeDto dto);
    double moyenneDureeTournees();
    TourneeDto planifierTournee(TourneeDto dto);
    void supprimerTournee(String tourneeId);
    void validerTournee(String tourneeId);

}
