package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.dto.CitoyenDTO;
import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.entities.enums.CouleurStatut;

import java.util.List;


public interface ConteneurService {

    ConteneurDTO createConteneur(ConteneurDTO conteneurDTO);


    void deleteConteneur(String id);

    ConteneurDTO getConteneurById(String id);

    List<ConteneurDTO> getAllConteneurs();

    
    CouleurStatut saturationColor(ConteneurDTO conteneurDTO);

	ConteneurDTO viderConteneur(String id, ConteneurDTO dto);


	ConteneurDTO ajouterDechet(String idConteneur, DechetsDTO dto);


	ConteneurDTO updateEtat(String idConteneur);


	ConteneurDTO ajouterCitoyen(String idConteneur, CitoyenDTO dto);
    

}
