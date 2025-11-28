package com.projetJEE.projetJEE.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Incident.CategorieIncident;
import com.projetJEE.projetJEE.entities.Incident.StatutIncident;

import java.util.List;

public interface IncidentRepository extends MongoRepository<Incident, String> {
    List<Incident> findByCategorie(CategorieIncident categorie);
    List<Incident> findByStatut(StatutIncident statut);
    List<Incident> findByUtilisateurId(String utilisateurId);
}