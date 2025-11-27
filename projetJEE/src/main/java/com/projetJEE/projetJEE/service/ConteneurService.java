package com.projetJEE.projetJEE.service;

import com.projetJEE.projetJEE.entity.Conteneur;
import java.util.List;

public interface ConteneurService {

    Conteneur createConteneur(Conteneur conteneur);

    Conteneur updateConteneur(String id, Conteneur conteneur);

    void deleteConteneur(String id);

    Conteneur getConteneurById(String id);

    List<Conteneur> getAllConteneurs();

    Conteneur updateEtatRemplissage(String id, Conteneur conteneur);
}
