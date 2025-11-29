package com.projetJEE.projetJEE.repository;

import com.projetJEE.projetJEE.entities.Citoyen;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitoyenRepository extends MongoRepository<Citoyen, String> {

    java.util.Optional<Citoyen> findByEmail(String email);
}
