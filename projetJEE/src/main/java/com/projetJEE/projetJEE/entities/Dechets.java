package com.projetJEE.projetJEE.entities;

import com.projetJEE.projetJEE.entities.enums.TypeDechets;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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
}
