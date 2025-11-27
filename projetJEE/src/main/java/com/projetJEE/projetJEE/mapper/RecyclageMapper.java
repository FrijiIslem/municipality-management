package com.projetJEE.projetJEE.mapper;

import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.entity.Dechets;
import com.projetJEE.projetJEE.entity.Recyclage;
import com.projetJEE.projetJEE.repository.DechetsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RecyclageMapper {
	@Autowired
	private DechetsRepository dechetsRepository;

	public RecyclageDTO toDTO(Recyclage r) {
	    RecyclageDTO dto = new RecyclageDTO();
	    dto.setId(r.getId());
	    dto.setQuantite(r.getQuantite());
	    dto.setTaux(r.getTaux());
	    dto.setTypeDechetId(r.getType().getId());
	    return dto;
	}

    public Recyclage toEntity(RecyclageDTO dto) {
        Recyclage r = new Recyclage();
        r.setId(dto.getId());
        r.setQuantite(dto.getQuantite());
        r.setTaux(dto.getTaux());

        // Load the Dechets entity from the ID in the DTO
        Dechets dechet = dechetsRepository.findById(dto.getTypeDechetId())
                .orElseThrow(() -> new RuntimeException("Type de déchet introuvable"));

        r.setType(dechet);

        return r;
    }
}
