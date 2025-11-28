package com.projetJEE.projetJEE.repository;  // ✅ Package corrigé

import com.projetJEE.projetJEE.entities.Agent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends MongoRepository<Agent, String> {

    // Trouver agent par nom (LIKE)
    List<Agent> findByNomContainingIgnoreCase(String nom);

    // Trouver agents disponibles (pas en tournée)
    List<Agent> findByDisponibleTrue();

    // Trouver par téléphone
    Optional<Agent> findByTelephone(String telephone);

    // Query personnalisée : agents par région
    @Query("{ 'region' : ?0 }")
    List<Agent> findByRegion(String region);

    // Compter agents actifs
    long countByActifTrue();
}
