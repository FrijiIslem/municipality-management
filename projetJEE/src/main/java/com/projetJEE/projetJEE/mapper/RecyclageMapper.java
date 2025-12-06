package com.projetJEE.projetJEE.mapper;

import org.springframework.stereotype.Component;
import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.entities.Recyclage;

@Component
public class RecyclageMapper {
	
	public RecyclageDTO toDTO(Recyclage r) {

	    RecyclageDTO dto = new RecyclageDTO();

	    dto.setId(r.getId());
	    dto.setQuantite(r.getQuantite());
	    dto.setTaux(r.getTaux());
	    dto.setTypeDechet(r.getTypeDechet());

	    return dto;
	}

	public Recyclage toEntity(RecyclageDTO dto) {

	    Recyclage r = new Recyclage();

	    r.setId(dto.getId());
	    r.setQuantite(dto.getQuantite());
	    r.setTaux(dto.getTaux());

	    // Enum is passed directly
	    r.setTypeDechet(dto.getTypeDechet());

	    return r;
	}

}
