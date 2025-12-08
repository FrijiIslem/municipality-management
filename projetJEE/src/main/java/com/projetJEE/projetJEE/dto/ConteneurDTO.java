package com.projetJEE.projetJEE.dto;

import java.util.List;

import com.projetJEE.projetJEE.entities.enums.CouleurStatut;
import com.projetJEE.projetJEE.entities.enums.EtatRemplissage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConteneurDTO {
    private String id;
    private String localisation;
    private CouleurStatut couleurStatut;
    private EtatRemplissage etatRemplissage;
    private int quantite_max;
    private List<DechetsDTO> dechets;
    private List<CitoyenDTO> citoyens;
}
