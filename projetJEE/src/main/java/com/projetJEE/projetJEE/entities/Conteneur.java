package com.projetJEE.projetJEE.entities;

import com.projetJEE.projetJEE.entities.enums.CouleurStatut;
import com.projetJEE.projetJEE.entities.enums.EtatRemplissage;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "conteneurs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conteneur {
    @Id
    private String id;

    private String localisation;

    private CouleurStatut couleurStatut;

    private EtatRemplissage etatRemplissage;

    public final static int quantite_max = 200;

    private List<Dechets> dechets = new ArrayList<>();

    private List<Citoyen> citoyens = new ArrayList<>();
}
