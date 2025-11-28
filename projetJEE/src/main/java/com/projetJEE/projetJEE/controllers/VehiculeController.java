package com.projetJEE.projetJEE.controllers;

import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.services.VehiculeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicules")
@RequiredArgsConstructor
public class VehiculeController {

    private final VehiculeService vehiculeService;

    @PostMapping
    public Vehicule create(@RequestBody Vehicule vehicule) {
        return vehiculeService.createVehicule(vehicule);
    }

    @PutMapping("/{id}")
    public Vehicule update(@PathVariable String id, @RequestBody Vehicule vehicule) {
        return vehiculeService.updateVehicule(id, vehicule);
    }

    @GetMapping("/{id}")
    public Vehicule getOne(@PathVariable String id) {
        return vehiculeService.getVehiculeById(id);
    }

    @GetMapping
    public List<Vehicule> getAll() {
        return vehiculeService.getAllVehicules();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        vehiculeService.deleteVehicule(id);
    }

    @PutMapping("/{id}/disponibilite")
    public Vehicule updateDispo(@PathVariable String id, @RequestParam boolean dispo) {
        return vehiculeService.modifierDisponibilite(id, dispo);
    }
}

