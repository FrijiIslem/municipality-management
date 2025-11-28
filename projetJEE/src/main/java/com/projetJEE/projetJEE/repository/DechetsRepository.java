package com.projetJEE.projetJEE.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.projetJEE.projetJEE.entities.Dechets;

public interface DechetsRepository extends MongoRepository<Dechets, String> {
}
