package com.projetJEE.projetJEE.service;

import com.projetJEE.projetJEE.dto.RecyclageDTO;

import java.util.List;

public interface RecyclageService {
    RecyclageDTO create(RecyclageDTO dto);
    List<RecyclageDTO> findAll();
    RecyclageDTO findById(String id);
    RecyclageDTO update(String id, RecyclageDTO dto);
    void delete(String id);
}
