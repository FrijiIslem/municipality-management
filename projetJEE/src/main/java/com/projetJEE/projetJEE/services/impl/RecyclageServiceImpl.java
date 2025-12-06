package com.projetJEE.projetJEE.services.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.entities.Recyclage;
import com.projetJEE.projetJEE.entities.enums.TypeDechets;
import com.projetJEE.projetJEE.mapper.RecyclageMapper;
import com.projetJEE.projetJEE.repository.RecyclageRepository;
import com.projetJEE.projetJEE.services.RecyclageService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecyclageServiceImpl implements RecyclageService {

    private final RecyclageRepository repo;
    private final RecyclageMapper recyclageMapper;

    @Override
    public RecyclageDTO create(RecyclageDTO dto) {
        Recyclage entity = recyclageMapper.toEntity(dto);
        return recyclageMapper.toDTO(repo.save(entity));
    }

    @Override
    public RecyclageDTO update(String id, RecyclageDTO dto) {
        Recyclage existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Recyclage not found"));

        existing.setQuantite(dto.getQuantite());
        existing.setTaux(dto.getTaux());

        // enum is assigned directly
        existing.setTypeDechet(dto.getTypeDechet());

        return recyclageMapper.toDTO(repo.save(existing));
    }

    @Override
    public void delete(String id) {
        repo.deleteById(id);
    }

    @Override
    public RecyclageDTO findById(String id) {
        return recyclageMapper.toDTO(
                repo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Recyclage not found"))
        );
    }

    @Override
    public List<RecyclageDTO> findAll() {
        return repo.findAll()
                .stream()
                .map(recyclageMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public Map<TypeDechets, Float> quantiteParType() {
        return repo.findAll().stream()
                .collect(Collectors.groupingBy(
                        Recyclage::getTypeDechet,
                        Collectors.summingDouble(r -> (double) r.getQuantite())
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().floatValue()
                ));
    }

    @Override
    public Map<TypeDechets, Float> tauxParType() {
        return repo.findAll().stream()
                .collect(Collectors.groupingBy(
                        Recyclage::getTypeDechet,
                        Collectors.summingDouble(r -> (double) r.getTaux())
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().floatValue()
                ));
    }
    
    @Override
    public Map<TypeDechets, Float> tauxMoyenParType() {

        Map<TypeDechets, List<Recyclage>> grouped =
                repo.findAll()
                    .stream()
                    .collect(Collectors.groupingBy(Recyclage::getTypeDechet));

        Map<TypeDechets, Float> result = new HashMap<>();

        for (var entry : grouped.entrySet()) {

            TypeDechets type = entry.getKey();
            List<Recyclage> list = entry.getValue();

            float totalQte = 0;
            float totalTaux = 0;

            for (Recyclage r : list) {
                totalQte += r.getQuantite();  // total collected
                totalTaux += r.getTaux();     // total recycled
            }

            float percentage = (totalQte == 0) ? 0 : (totalTaux / totalQte) * 100;

            // round to 2 decimals
            percentage = Math.round(percentage * 100f) / 100f;

            result.put(type, percentage);
        }

        return result;
    }


}
