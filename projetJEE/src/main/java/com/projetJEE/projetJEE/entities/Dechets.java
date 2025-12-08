package com.projetJEE.projetJEE.entities;

import com.projetJEE.projetJEE.entities.enums.TypeDechets;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "dechets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dechets {
    @Id
    private String id;
    private TypeDechets type;
    private boolean ramasse;
}
