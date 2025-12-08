package com.projetJEE.projetJEE.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Citoyen extends Utilisateur {

    private String adresse;
}
