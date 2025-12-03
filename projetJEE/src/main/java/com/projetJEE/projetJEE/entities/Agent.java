package com.projetJEE.projetJEE.entities;
import lombok.AllArgsConstructor;	
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import com.projetJEE.projetJEE.entities.enums.RoleUtilisateur;
import com.projetJEE.projetJEE.entities.enums.TypeTache;



@Data

@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Agent extends Utilisateur {

    private Boolean disponibilite;
    private String plageHoraire;
    private TypeTache tache;
  
    
}

