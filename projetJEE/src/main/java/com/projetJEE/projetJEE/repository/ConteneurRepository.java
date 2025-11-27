package com.projetJEE.projetJEE.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.projetJEE.projetJEE.entity.Conteneur;

public interface ConteneurRepository extends MongoRepository<Conteneur, String> {
}

