package com.projetJEE.projetJEE.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.entities.enums.TypeDechets;
import com.projetJEE.projetJEE.services.RecyclageService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recyclage")
@RequiredArgsConstructor
public class RecyclageController {

    private final RecyclageService recyclageService;

    // 
    @Operation(summary = "Enregistrer une opération de recyclage")
    @PostMapping
    public ResponseEntity<RecyclageDTO> create(@RequestBody RecyclageDTO dto) {
        return ResponseEntity.ok(recyclageService.create(dto));
    }

    
    @Operation(summary = "Lister toutes les opérations")
    @GetMapping
    public ResponseEntity<List<RecyclageDTO>> findAll() {
        return ResponseEntity.ok(recyclageService.findAll());
    }

   
    @Operation(summary = "Trouver une opération par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<RecyclageDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok(recyclageService.findById(id));
    }

   
    @Operation(summary = "Modifier une opération de recyclage")
    @PutMapping("/{id}")
    public ResponseEntity<RecyclageDTO> update(
            @PathVariable String id,
            @RequestBody RecyclageDTO dto) {
        return ResponseEntity.ok(recyclageService.update(id, dto));
    }

    @Operation(summary = "Supprimer une opération")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        recyclageService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "Voir Quantités par Types")
    @GetMapping("/quantite-par-type")
    public ResponseEntity<Map<TypeDechets, Float>> getQuantiteParType() {
        return ResponseEntity.ok(recyclageService.quantiteParType());
    }

    @Operation(summary = "Voir taux recyclage par type")
    @GetMapping("/taux-par-type")
    public ResponseEntity<Map<TypeDechets, Float>> getTauxParType() {
        return ResponseEntity.ok(recyclageService.tauxParType());
    }

    @Operation(summary = "voir Taux Moyens par Type")
    @GetMapping("/taux-moyen-par-type")
    public ResponseEntity<Map<TypeDechets, Float>> getTauxMoyenParType() {
        return ResponseEntity.ok(recyclageService.tauxMoyenParType());
    }
}
