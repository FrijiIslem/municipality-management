package com.projetJEE.projetJEE.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
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

    @DBRef
    private Dechets type;
}
