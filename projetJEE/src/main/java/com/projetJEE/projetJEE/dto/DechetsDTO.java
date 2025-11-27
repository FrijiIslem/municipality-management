package com.projetJEE.projetJEE.dto;

import com.projetJEE.projetJEE.entity.enums.TypeDechets;
import lombok.Data;

@Data
public class DechetsDTO {
    public DechetsDTO(String id2, TypeDechets type2) {
		this.id=id2;
		this.type=type2;
	}
	public DechetsDTO() {
	}
	private String id;
    private TypeDechets type;
}
