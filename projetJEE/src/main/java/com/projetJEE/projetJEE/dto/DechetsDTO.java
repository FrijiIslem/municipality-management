package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entities.enums.TypeDechets;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DechetsDTO {

    private String id;
    private TypeDechets type;
}
