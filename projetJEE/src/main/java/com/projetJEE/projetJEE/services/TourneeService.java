package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.dto.TourneeDto;
import java.util.List;

public interface TourneeService {
    TourneeDto createTournee(TourneeDto dto);
    List<TourneeDto> getAllTournees();
    TourneeDto getTourneeById(String id);
    void deleteTournee(String id);
}
