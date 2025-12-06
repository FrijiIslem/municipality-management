package com.projetJEE.projetJEE.entities;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Citoyen extends Utilisateur {

   
    private String adresse;
}