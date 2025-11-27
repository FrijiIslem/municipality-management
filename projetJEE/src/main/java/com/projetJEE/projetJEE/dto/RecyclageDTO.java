package com.projetJEE.projetJEE.dto;

import lombok.Data;

@Data
public class RecyclageDTO {
    private String id;
    private float quantite;
    private float taux;
    private String typeDechetId;
}
