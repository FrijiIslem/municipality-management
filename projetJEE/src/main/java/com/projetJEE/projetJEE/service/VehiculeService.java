package com.projetJEE.projetJEE.service;

import com.projetJEE.projetJEE.entity.Vehicule;
import java.util.List;

public interface VehiculeService {

    Vehicule createVehicule(Vehicule vehicule);

    Vehicule updateVehicule(String id, Vehicule vehicule);

    void deleteVehicule(String id);

    Vehicule getVehiculeById(String id);

    List<Vehicule> getAllVehicules();

    Vehicule modifierDisponibilite(String id, boolean dispo);
}
