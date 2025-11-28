package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.repository.VehiculeRepository;
import com.projetJEE.projetJEE.services.VehiculeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculeServiceImp implements VehiculeService {

    private final VehiculeRepository vehiculeRepository;

    @Override
    public Vehicule createVehicule(Vehicule vehicule) {
        return vehiculeRepository.save(vehicule);
    }

    @Override
    public Vehicule updateVehicule(String id, Vehicule updated) {
        Vehicule v = vehiculeRepository.findById(id).orElseThrow();
        v.setCapaciteMax(updated.getCapaciteMax());
        v.setDisponibilite(updated.isDisponibilite());
        v.setMatricule(updated.getMatricule());
        return vehiculeRepository.save(v);
    }

    @Override
    public void deleteVehicule(String id) {
        vehiculeRepository.deleteById(id);
    }

    @Override
    public Vehicule getVehiculeById(String id) {
        return vehiculeRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    @Override
    public Vehicule modifierDisponibilite(String id, boolean dispo) {
        Vehicule v = vehiculeRepository.findById(id).orElseThrow();
        v.setDisponibilite(dispo);
        return vehiculeRepository.save(v);
    }
}
