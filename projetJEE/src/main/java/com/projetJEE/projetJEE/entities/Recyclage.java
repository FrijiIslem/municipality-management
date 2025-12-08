package com.projetJEE.projetJEE.entities;

import lombok.*;
import com.projetJEE.projetJEE.entities.enums.TypeDechets;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
