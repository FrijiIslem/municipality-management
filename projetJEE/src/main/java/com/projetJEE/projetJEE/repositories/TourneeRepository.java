package com.projetJEE.projetJEE.repositories;

import com.projetJEE.projetJEE.entities.Tournee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TourneeRepository extends MongoRepository<Tournee, String> {
    List<Tournee> findByEtat(String etat);
}
