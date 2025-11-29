package com.projetJEE.projetJEE.repository;  // ✅ Package corrigé

import com.projetJEE.projetJEE.entities.Agent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends MongoRepository<Agent, String> {

    java.util.Optional<Agent> findByEmail(String email);

    // Trouver agent par nom (LIKE)
    List<Agent> findByNomContainingIgnoreCase(String nom);

    // Trouver agents disponibles (pas en tournée)
    List<Agent> findByDisponibiliteTrue();

    // Trouver par téléphone
    Optional<Agent> findByNumeroTel(Long numeroTel);
    Optional<Agent> findFirstByTacheAndDisponibiliteTrue(String tache);
    List<Agent> findByTacheAndDisponibiliteTrue(String tache);
    List<Agent> findByTache(String tache);
}
