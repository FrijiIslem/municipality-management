package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.mapper.TourneeMapper;
import com.projetJEE.projetJEE.repository.TourneeRepository;
import com.projetJEE.projetJEE.services.TourneeService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TourneeServiceImpl implements TourneeService {

    private final TourneeRepository tourneeRepository;
    private final TourneeMapper tourneeMapper;

    public TourneeServiceImpl(TourneeRepository tourneeRepository, TourneeMapper tourneeMapper) {
        this.tourneeRepository = tourneeRepository;
        this.tourneeMapper = tourneeMapper;
    }

    @Override
    public TourneeDto createTournee(TourneeDto dto) {
        Tournee entity = tourneeMapper.toEntity(dto);
        Tournee saved = tourneeRepository.save(entity);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    public List<TourneeDto> getAllTournees() {
        return tourneeMapper.toDTO(tourneeRepository.findAll());
    }

    @Override
    public TourneeDto getTourneeById(String id) {
        return tourneeRepository.findById(id)
                .map(tourneeMapper::toDto)
                .orElse(null);
    }

    @Override
    public void deleteTournee(String id) {
        tourneeRepository.deleteById(id);
    }

	@Override
	public List<TourneeDto> getTourneesByAgent(String agentId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<TourneeDto> getTourneesByEtat(String etat) {
		// TODO Auto-generated method stub
		return null;
	}
}
