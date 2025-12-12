package com.projetJEE.projetJEE.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import com.projetJEE.projetJEE.config.CitoyenDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Citoyen extends Utilisateur {

    private String adresse;
}
