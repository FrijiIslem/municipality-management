package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.entities.Dechets;
import com.projetJEE.projetJEE.repository.DechetsRepository;
import com.projetJEE.projetJEE.services.DechetsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DechetsServiceImpl implements DechetsService {

    private final DechetsRepository dechetsRepository;

    @Override
    public Dechets create(DechetsDTO dto) {
        Dechets dechet = new Dechets();
        dechet.setType(dto.getType());
        return dechetsRepository.save(dechet);
    }

    @Override
    public List<DechetsDTO> findAll() {
        return dechetsRepository.findAll()
                .stream()
                .map(d -> new DechetsDTO(d.getId(), d.getType()))
                .toList();
    }

    @Override
    public DechetsDTO findById(String id) {
        Dechets d = dechetsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Déchet introuvable"));
        return new DechetsDTO(d.getId(), d.getType());
    }

    @Override
    public DechetsDTO update(String id, DechetsDTO dto) {
        Dechets d = dechetsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Déchet introuvable"));

        d.setType(dto.getType());
        dechetsRepository.save(d);

        return new DechetsDTO(d.getId(), d.getType());
    }

    @Override
    public void delete(String id) {
        dechetsRepository.deleteById(id);
    }
}
