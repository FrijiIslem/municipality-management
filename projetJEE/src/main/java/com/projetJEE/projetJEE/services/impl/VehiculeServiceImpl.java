package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.VehiculeDTO;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.exceptions.ResourceNotFoundException;
import com.projetJEE.projetJEE.repository.VehiculeRepository;
import com.projetJEE.projetJEE.services.VehiculeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehiculeServiceImpl implements VehiculeService {

    private final VehiculeRepository vehiculeRepository;
    private final com.projetJEE.projetJEE.mapper.VehiculeMapper vehiculeMapper; 

    @Override
    public VehiculeDTO createVehicule(VehiculeDTO vehiculeDTO) {
        System.out.println("=== DEBUG VehiculeServiceImpl.createVehicule ===");
        System.out.println("DTO reçu: " + vehiculeDTO);
        
        // Validation
        if (vehiculeDTO.getMatricule() == null) {
            throw new IllegalArgumentException("Le matricule est obligatoire");
        }
        if (vehiculeDTO.getCapaciteMax() <= 0) {
            throw new IllegalArgumentException("La capacité maximale doit être supérieure à 0");
        }
        
        Vehicule vehicule = vehiculeMapper.toEntity(vehiculeDTO);
        System.out.println("Entité créée: " + vehicule);
        System.out.println("ID avant save: " + vehicule.getId());
        
        Vehicule saved = vehiculeRepository.save(vehicule);
        System.out.println("Entité sauvegardée: " + saved);
        System.out.println("ID après save: " + saved.getId());
        
        VehiculeDTO result = vehiculeMapper.toDTO(saved);
        System.out.println("DTO retourné: " + result);
        return result;
    }

    @Override
    public VehiculeDTO updateVehicule(String id, VehiculeDTO updatedDTO) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Véhicule introuvable avec l'ID: " + id));
        vehicule.setMatricule(updatedDTO.getMatricule());
        vehicule.setCapaciteMax(updatedDTO.getCapaciteMax());
        vehicule.setDisponibilite(updatedDTO.isDisponibilite());
        Vehicule updated = vehiculeRepository.save(vehicule);
        return vehiculeMapper.toDTO(updated);
    }

    @Override
    public void deleteVehicule(String id) {
        if (!vehiculeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Véhicule introuvable avec l'ID: " + id);
        }
        vehiculeRepository.deleteById(id);
    }

    @Override
    public VehiculeDTO getVehiculeById(String id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Véhicule introuvable avec l'ID: " + id));
        return vehiculeMapper.toDTO(vehicule);
    }

    @Override
    public List<VehiculeDTO> getAllVehicules() {
        return vehiculeRepository.findAll()
                .stream()
                .map(vehiculeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VehiculeDTO modifierDisponibilite(String id, boolean dispo) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Véhicule introuvable avec l'ID: " + id));
        vehicule.setDisponibilite(dispo);
        Vehicule updated = vehiculeRepository.save(vehicule);
        return vehiculeMapper.toDTO(updated);
    }
}
