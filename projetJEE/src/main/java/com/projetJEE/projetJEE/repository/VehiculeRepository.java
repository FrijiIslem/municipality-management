package com.projetJEE.projetJEE.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.projetJEE.projetJEE.entity.Vehicule;

public interface VehiculeRepository extends MongoRepository<Vehicule, String> {
}
