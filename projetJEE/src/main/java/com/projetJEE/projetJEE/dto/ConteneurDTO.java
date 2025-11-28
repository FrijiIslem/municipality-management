package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entities.enums.CouleurStatut;
import com.projetJEE.projetJEE.entities.enums.EtatRemplissage;
import lombok.Data;

@Data
public class ConteneurDTO {
    private String id;
    private String localisation;
    private CouleurStatut couleurStatut;
    private EtatRemplissage etatRemplissage;
    private String typeDechetsId;
}
