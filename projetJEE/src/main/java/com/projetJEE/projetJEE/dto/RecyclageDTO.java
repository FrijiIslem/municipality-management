package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entities.enums.TypeDechets;

import lombok.Data;

@Data
public class RecyclageDTO {
    private String id;
    private float quantite;
    private float taux;
    private TypeDechets typeDechet;
    
}
