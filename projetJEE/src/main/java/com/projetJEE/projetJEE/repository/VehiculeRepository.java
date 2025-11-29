package com.projetJEE.projetJEE.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.projetJEE.projetJEE.entities.Vehicule;

public interface VehiculeRepository extends MongoRepository<Vehicule, String> {
    List<Vehicule> findByDisponibilite(boolean disponibilite);
}