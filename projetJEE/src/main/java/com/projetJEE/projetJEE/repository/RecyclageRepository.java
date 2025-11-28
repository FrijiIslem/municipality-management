package com.projetJEE.projetJEE.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.projetJEE.projetJEE.entities.Recyclage;

public interface RecyclageRepository extends MongoRepository<Recyclage, String>{

}
