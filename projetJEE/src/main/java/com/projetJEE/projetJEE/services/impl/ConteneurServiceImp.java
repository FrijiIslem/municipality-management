package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.repository.ConteneurRepository;
import com.projetJEE.projetJEE.services.ConteneurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConteneurServiceImp implements ConteneurService {

    private final ConteneurRepository conteneurRepository;

    @Override
    public Conteneur createConteneur(Conteneur conteneur) {
        return conteneurRepository.save(conteneur);
    }

    @Override
    public Conteneur updateConteneur(String id, Conteneur updated) {
        Conteneur c = conteneurRepository.findById(id).orElseThrow();
        c.setLocalisation(updated.getLocalisation());
        c.setCouleurStatut(updated.getCouleurStatut());
        c.setEtatRemplissage(updated.getEtatRemplissage());
        c.setTypeDechets(updated.getTypeDechets());
        return conteneurRepository.save(c);
    }

    @Override
    public void deleteConteneur(String id) {
        conteneurRepository.deleteById(id);
    }

    @Override
    public Conteneur getConteneurById(String id) {
        return conteneurRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Conteneur> getAllConteneurs() {
        return conteneurRepository.findAll();
    }

    @Override
    public Conteneur updateEtatRemplissage(String id, Conteneur conteneur) {
        Conteneur c = conteneurRepository.findById(id).orElseThrow();
        c.setEtatRemplissage(conteneur.getEtatRemplissage());
        return conteneurRepository.save(c);
    }
}
