package com.projetJEE.projetJEE.entities;

import com.projetJEE.projetJEE.entities.enums.CouleurStatut;
import com.projetJEE.projetJEE.entities.enums.EtatRemplissage;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

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

    @DBRef
    private Dechets typeDechets;
}
