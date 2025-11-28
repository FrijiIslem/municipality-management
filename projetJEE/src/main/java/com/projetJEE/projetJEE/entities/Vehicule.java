package com.projetJEE.projetJEE.entities;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Vehicule {
	@Id
    private String id;

    private Long matricule;

    private float capaciteMax;

    private boolean disponibilite;
}
