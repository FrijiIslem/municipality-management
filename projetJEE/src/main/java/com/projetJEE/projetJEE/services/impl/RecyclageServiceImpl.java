package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.entities.Dechets;
import com.projetJEE.projetJEE.entities.Recyclage;
import com.projetJEE.projetJEE.repository.DechetsRepository;
import com.projetJEE.projetJEE.repository.RecyclageRepository;
import com.projetJEE.projetJEE.services.RecyclageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecyclageServiceImpl implements RecyclageService {

    private final RecyclageRepository repo;
    private final DechetsRepository dechetsRepository;

    @Override
    public RecyclageDTO create(RecyclageDTO dto) {
        Recyclage entity = toEntity(dto);
        return toDTO(repo.save(entity));
    }

    @Override
    public RecyclageDTO update(String id, RecyclageDTO dto) {
        Recyclage existing = repo.findById(id).orElseThrow();

        existing.setQuantite(dto.getQuantite());
        existing.setTaux(dto.getTaux());

        // 🔥 FIX: set the Dechets object, not a string
        Dechets dechet = dechetsRepository.findById(dto.getTypeDechetId())
                .orElseThrow();
        existing.setType(dechet);

        return toDTO(repo.save(existing));
    }

    @Override
    public void delete(String id) {
        repo.deleteById(id);
    }

    @Override
    public RecyclageDTO findById(String id) {
        return toDTO(repo.findById(id).orElseThrow());
    }

    @Override
    public List<RecyclageDTO> findAll() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ---------------- MAPPERS ----------------

    private RecyclageDTO toDTO(Recyclage r) {
        RecyclageDTO dto = new RecyclageDTO();
        dto.setId(r.getId());
        dto.setQuantite(r.getQuantite());
        dto.setTaux(r.getTaux());

        // 🔥 FIX: extract the ID from the Dechets object
        dto.setTypeDechetId(r.getType().getId());

        return dto;
    }

    private Recyclage toEntity(RecyclageDTO dto) {
        Recyclage r = new Recyclage();
        r.setId(dto.getId());
        r.setQuantite(dto.getQuantite());
        r.setTaux(dto.getTaux());

        // 🔥 FIX: load Dechets using the ID from DTO
        Dechets dechet = dechetsRepository.findById(dto.getTypeDechetId())
                .orElseThrow();

        r.setType(dechet);

        return r;
    }
}
