package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.entities.enums.TypeDechets;

import java.util.List;
import java.util.Map;

public interface RecyclageService {
    RecyclageDTO create(RecyclageDTO dto);
    
    List<RecyclageDTO> findAll();
    
    RecyclageDTO findById(String id);
    
    RecyclageDTO update(String id, RecyclageDTO dto);
    
    void delete(String id);
    
    Map<TypeDechets, Float> quantiteParType();

    Map<TypeDechets, Float> tauxParType();
    
    Map<TypeDechets, Float> tauxMoyenParType();


}
