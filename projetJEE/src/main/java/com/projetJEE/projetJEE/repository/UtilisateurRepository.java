package com.projetJEE.projetJEE.repository
;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;

import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends MongoRepository<Utilisateur, String> {

    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Utilisateur> findByRole(RoleUtilisateur role);
    long countByRole(Utilisateur.RoleUtilisateur role);
    // for islem 
    //List<Utilisateur> findByRoleAndTacheAndDisponibilite(RoleUtilisateur role, 
      
    //Agent.TypeTache tache, 
      
    //Boolean disponibilite);

}