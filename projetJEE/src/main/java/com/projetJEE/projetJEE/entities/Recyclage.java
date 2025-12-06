package com.projetJEE.projetJEE.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.projetJEE.projetJEE.entities.enums.TypeDechets;

@Document("recyclage")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recyclage {

    @Id
    private String id;

    private float quantite;

    private float taux;

    private TypeDechets typeDechet;
}
