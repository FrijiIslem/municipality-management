package com.projetJEE.projetJEE.service;

import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.entity.Dechets;
import java.util.List;

public interface DechetsService {

    Dechets create(DechetsDTO dto);

    List<DechetsDTO> findAll();

    DechetsDTO findById(String id);

    DechetsDTO update(String id, DechetsDTO dto);

    void delete(String id);
}

