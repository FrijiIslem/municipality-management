package com.projetJEE.projetJEE.controllers;

import com.projetJEE.projetJEE.dto.VehiculeDTO;
import com.projetJEE.projetJEE.services.VehiculeService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicules")
@RequiredArgsConstructor
public class VehiculeController {

    private final VehiculeService vehiculeService;

    // Créer un véhicule
    @Operation(summary = "Créer un véhicule")
    @PostMapping
    public VehiculeDTO create(@RequestBody VehiculeDTO vehiculeDTO) {
        System.out.println("=== DEBUG: VehiculeDTO reçu ===");
        System.out.println("VehiculeDTO: " + vehiculeDTO);
        System.out.println("ID: " + vehiculeDTO.getId());
        System.out.println("Matricule: " + vehiculeDTO.getMatricule());
        System.out.println("CapaciteMax: " + vehiculeDTO.getCapaciteMax());
        System.out.println("Disponibilite: " + vehiculeDTO.isDisponibilite());
        try {
            VehiculeDTO saved = vehiculeService.createVehicule(vehiculeDTO);
            System.out.println("=== DEBUG: Vehicule sauvegardé avec ID: " + saved.getId() + " ===");
            return saved;
        } catch (Exception e) {
            System.err.println("=== ERREUR lors de la sauvegarde du véhicule ===");
            e.printStackTrace();
            throw e;
        }
    }

    // Mettre à jour un véhicule
    @Operation(summary = "Mettre à jour un véhicule")
    @PutMapping("/{id}")
    public VehiculeDTO update(@PathVariable String id, @RequestBody VehiculeDTO vehiculeDTO) {
        return vehiculeService.updateVehicule(id, vehiculeDTO);
    }

    // Récupérer un véhicule par ID
    @Operation(summary = "Récupérer un véhicule par id")
    @GetMapping("/{id}")
    public VehiculeDTO getOne(@PathVariable String id) {
        return vehiculeService.getVehiculeById(id);
    }

    // Récupérer tous les véhicules
    @Operation(summary = "Récupérer tous les véhicules")
    @GetMapping
    public List<VehiculeDTO> getAll() {
        return vehiculeService.getAllVehicules();
    }

    // Supprimer un véhicule
    @Operation(summary = "Supprimer un véhicule")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        vehiculeService.deleteVehicule(id);
    }

    // Mettre à jour la disponibilité
    @Operation(summary = "Mettre à jour la disponibilité")
    @PutMapping("/{id}/disponibilite")
    public VehiculeDTO updateDispo(@PathVariable String id, @RequestParam boolean dispo) {
        return vehiculeService.modifierDisponibilite(id, dispo);
    }
}
