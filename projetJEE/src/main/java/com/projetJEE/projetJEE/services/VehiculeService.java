package com.projetJEE.projetJEE.services;

import com.projetJEE.projetJEE.dto.VehiculeDTO;
import com.projetJEE.projetJEE.entities.Vehicule;
import java.util.List;

public interface VehiculeService {

    VehiculeDTO createVehicule(VehiculeDTO vehiculeDTO);

    VehiculeDTO updateVehicule(String id, VehiculeDTO vehiculeDTO);

    void deleteVehicule(String id);

    VehiculeDTO getVehiculeById(String id);

    List<VehiculeDTO> getAllVehicules();

    VehiculeDTO modifierDisponibilite(String id, boolean dispo);
}
