package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.CitoyenDTO;
import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.entities.Dechets;
import com.projetJEE.projetJEE.entities.enums.CouleurStatut;
import com.projetJEE.projetJEE.entities.enums.EtatRemplissage;
import com.projetJEE.projetJEE.mapper.CitoyenMapper;
import com.projetJEE.projetJEE.mapper.ConteneurMapper;
import com.projetJEE.projetJEE.repository.ConteneurRepository;
import com.projetJEE.projetJEE.services.ConteneurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConteneurServiceImp implements ConteneurService {

    private final ConteneurRepository conteneurRepository;
    private final ConteneurMapper conteneurMapper;

    // 1. CREATE CONTENEUR
    @Override
    public ConteneurDTO createConteneur(ConteneurDTO dto) {
        Conteneur entity = conteneurMapper.toEntity(dto);
        Conteneur saved = conteneurRepository.save(entity);
        return conteneurMapper.toDTO(saved);
    }

    // 2. DELETE
    @Override
    public void deleteConteneur(String id) {
        conteneurRepository.deleteById(id);
    }

    // 3. GET BY ID
    @Override
    public ConteneurDTO getConteneurById(String id) {
        Conteneur entity = conteneurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteneur non trouvé : " + id));
        return conteneurMapper.toDTO(entity);
    }

    // 4. GET ALL
    @Override
    public List<ConteneurDTO> getAllConteneurs() {
        return conteneurRepository.findAll()
                .stream()
                .map(conteneurMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 6. SATURATION COLOR
    @Override
    public CouleurStatut saturationColor(ConteneurDTO dto) {
        EtatRemplissage etat = dto.getEtatRemplissage();
        switch (etat) {
            case vide: return CouleurStatut.vert;
            case moyen: return CouleurStatut.orange;
            case saturee: return CouleurStatut.rouge;
        }
        return null;
    }

    // 7. VIDER CONTENEUR
    @Override
    public ConteneurDTO viderConteneur(String id, ConteneurDTO dto) {
        Conteneur cont = conteneurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteneur non trouvé"));

        cont.getDechets().forEach(d -> d.setRamasse(true));
        cont.setEtatRemplissage(EtatRemplissage.vide);

        dto.setEtatRemplissage(EtatRemplissage.vide);
        cont.setCouleurStatut(saturationColor(dto));

        Conteneur saved = conteneurRepository.save(cont);
        return conteneurMapper.toDTO(saved);
    }

    // 8. UPDATE ETAT DE REMPLISSAGE
    @Override
    public ConteneurDTO updateEtat(String idConteneur) {
        Conteneur cont = conteneurRepository.findById(idConteneur)
                .orElseThrow(() -> new RuntimeException("Conteneur non trouvé : " + idConteneur));

        int nbDechets = cont.getDechets().size();
        double taux = (nbDechets / (double) Conteneur.quantite_max) * 100;

        EtatRemplissage etat;
        if (nbDechets == 0) etat = EtatRemplissage.vide;
        else if (taux < 70.0) etat = EtatRemplissage.moyen;
        else etat = EtatRemplissage.saturee;

        cont.setEtatRemplissage(etat);
        ConteneurDTO tmp = new ConteneurDTO();
        tmp.setEtatRemplissage(etat);
        cont.setCouleurStatut(saturationColor(tmp));

        Conteneur saved = conteneurRepository.save(cont);
        return conteneurMapper.toDTO(saved);
    }

    // AJOUTER DECHET
    @Override
    public ConteneurDTO ajouterDechet(String idConteneur, DechetsDTO dto) {
        Conteneur cont = conteneurRepository.findById(idConteneur)
                .orElseThrow(() -> new RuntimeException("Conteneur non trouvé"));

        Dechets d = conteneurMapper.toDechetsEntity(dto);
        d.setId(UUID.randomUUID().toString());

        cont.getDechets().add(d);

        Conteneur saved = conteneurRepository.save(cont);
        return conteneurMapper.toDTO(saved);
    }

    // AJOUTER CITOYEN
    @Override
    public ConteneurDTO ajouterCitoyen(String idConteneur, CitoyenDTO dto) {
        Conteneur cont = conteneurRepository.findById(idConteneur)
                .orElseThrow(() -> new RuntimeException("Conteneur non trouvé"));

        Citoyen citoyen = CitoyenMapper.toEntity(dto);
        citoyen.setId(UUID.randomUUID().toString());

        cont.getCitoyens().add(citoyen);

        Conteneur saved = conteneurRepository.save(cont);
        return conteneurMapper.toDTO(saved);
    }
}
