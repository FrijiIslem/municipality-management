package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.mapper.TourneeMapper;
import com.projetJEE.projetJEE.repository.AgentRepository;
import com.projetJEE.projetJEE.repository.TourneeRepository;
import com.projetJEE.projetJEE.services.TourneeService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TourneeServiceImpl implements TourneeService {

    private final TourneeRepository tourneeRepository;
    private final TourneeMapper tourneeMapper;
    private final AgentRepository agentRepository;

    public TourneeServiceImpl(TourneeRepository tourneeRepository, TourneeMapper tourneeMapper, AgentRepository agentRepository) {
        this.tourneeRepository = tourneeRepository;
        this.tourneeMapper = tourneeMapper;
        this.agentRepository = agentRepository;
    }

    @Override
    public TourneeDto createTournee(TourneeDto dto) {
        Tournee entity = tourneeMapper.toEntity(dto);
        Tournee saved = tourneeRepository.save(entity);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    public List<TourneeDto> getAllTournees() {
        return tourneeMapper.toDTOList(tourneeRepository.findAll());
    }

    @Override
    public TourneeDto getTourneeById(String id) {
        return tourneeRepository.findById(id)
                .map(tourneeMapper::toDTO)
                .orElse(null);
    }


	@Override
	public List<TourneeDto> getTourneesByAgent(String agentId) {
		List<Tournee> tournees = tourneeRepository.findByAgentChauffeurId(agentId);
		tournees.addAll(tourneeRepository.findByAgentRamasseursId(agentId));
		return tourneeMapper.toDTOList(tournees);
	}

	@Override
    public List<TourneeDto> getTourneesByEtat(String etat) {
        return tourneeMapper.toDTOList(tourneeRepository.findByEtat(com.projetJEE.projetJEE.entities.enums.EtatTournee.valueOf(etat)));
    }

    @Override
    public void affecterTournee(String tourneeId, String agentId) {
        Tournee tournee = tourneeRepository.findById(tourneeId).orElse(null);
        if (tournee != null) {
            // Assuming agentId is for agentChauffeur for now
            tournee.setAgentChauffeur(agentRepository.findById(agentId).orElse(null));
            tourneeRepository.save(tournee);
        }
    }

    @Override
    public long getDureeTournee(String tourneeId) {
        Tournee tournee = tourneeRepository.findById(tourneeId).orElse(null);
        if (tournee != null && tournee.getDateDebut() != null && tournee.getDateFin() != null) {
            return java.time.Duration.between(tournee.getDateDebut(), tournee.getDateFin()).toMinutes();
        }
        return 0;
    }

    @Override
    public void libererTournee(String tourneeId) {
        Tournee tournee = tourneeRepository.findById(tourneeId).orElse(null);
        if (tournee != null) {
            tournee.setEtat(com.projetJEE.projetJEE.entities.enums.EtatTournee.LIBRE);
            tourneeRepository.save(tournee);
        }
    }

    @Override
    public TourneeDto modifierTournee(TourneeDto dto) {
        Tournee entity = tourneeMapper.toEntity(dto);
        Tournee saved = tourneeRepository.save(entity);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    public double moyenneDureeTournees() {
        List<Tournee> tournees = tourneeRepository.findAll();
        return tournees.stream()
                .filter(t -> t.getDateDebut() != null && t.getDateFin() != null)
                .mapToLong(t -> java.time.Duration.between(t.getDateDebut(), t.getDateFin()).toMinutes())
                .average()
                .orElse(0.0);
    }

    @Override
    public TourneeDto planifierTournee(TourneeDto dto) {
        dto.setEtat(com.projetJEE.projetJEE.entities.enums.EtatTournee.PLANIFIEE);
        Tournee entity = tourneeMapper.toEntity(dto);
        Tournee saved = tourneeRepository.save(entity);
        return tourneeMapper.toDTO(saved);
    }

    @Override
    public void supprimerTournee(String tourneeId) {
        tourneeRepository.deleteById(tourneeId);
    }

    @Override
    public void validerTournee(String tourneeId) {
        Tournee tournee = tourneeRepository.findById(tourneeId).orElse(null);
        if (tournee != null) {
            tournee.setEtat(com.projetJEE.projetJEE.entities.enums.EtatTournee.VALIDEE);
            tourneeRepository.save(tournee);
        }
    }
}
