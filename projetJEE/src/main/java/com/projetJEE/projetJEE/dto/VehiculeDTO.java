package com.projetJEE.projetJEE.dto;

import lombok.Data;

@Data
public class VehiculeDTO {
    private String id;
    private Long matricule;
    private float capaciteMax;
    private boolean disponibilite;
}
