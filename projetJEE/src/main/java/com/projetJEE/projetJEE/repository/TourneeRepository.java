package com.projetJEE.projetJEE.repository;

import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourneeRepository extends MongoRepository<Tournee, String> {
    List<Tournee> findByEtat(EtatTournee etatTournee);
    List<Tournee> findByAgentChauffeurId(String agentId);
    List<Tournee> findByAgentRamasseursId(String agentId);
    Optional<Tournee> findByAgentChauffeur_IdAndEtat(String agentId, EtatTournee etat);
    }

