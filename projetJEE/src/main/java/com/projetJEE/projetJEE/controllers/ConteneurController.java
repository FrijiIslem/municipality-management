package com.projetJEE.projetJEE.controllers;

import com.projetJEE.projetJEE.dto.CitoyenDTO;
import com.projetJEE.projetJEE.dto.ConteneurDTO;
import com.projetJEE.projetJEE.dto.DechetsDTO;
import com.projetJEE.projetJEE.services.ConteneurService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conteneurs")
@RequiredArgsConstructor
@Tag(name = "Conteneurs", description = "Gestion des conteneurs et déchets")
public class ConteneurController {

    private final ConteneurService conteneurService;

    // Créer un conteneur
    @Operation(summary = "Créer un conteneur")
    @PostMapping
    public ConteneurDTO create(@RequestBody ConteneurDTO conteneurDTO) {
        return conteneurService.createConteneur(conteneurDTO);
    }

    // Récupérer un conteneur par ID
    @Operation(summary = "Récupérer un conteneur par ID")
    @GetMapping("/{id}")
    public ConteneurDTO getOne(@PathVariable String id) {
        return conteneurService.getConteneurById(id);
    }

    // Récupérer tous les conteneurs
    @Operation(summary = "Récupérer tous les conteneurs")
    @GetMapping
    public List<ConteneurDTO> getAll() {
        return conteneurService.getAllConteneurs();
    }

    // Mettre à jour uniquement l'état de remplissage
    @Operation(summary = "Mettre à jour l'état de remplissage")
    @PutMapping("/{id}/etat")
    public ConteneurDTO updateEtat(@PathVariable String id, @RequestBody ConteneurDTO conteneurDTO) {
        return conteneurService.updateEtat(id);
    }

    // Vider un conteneur
    @Operation(summary = "Vider un conteneur")
    @PostMapping("/{id}/vider")
    public ResponseEntity<ConteneurDTO> viderConteneur(@PathVariable String id, @RequestBody ConteneurDTO dto) {
        ConteneurDTO updated = conteneurService.viderConteneur(id, dto);
        return ResponseEntity.ok(updated);
    }

    // Ajouter un déchet dans un conteneur
    @PostMapping("/{id}/dechets")
    @Operation(summary = "Ajouter un déchet dans un conteneur")
    public ResponseEntity<ConteneurDTO> ajouterDechet(
            @PathVariable String id,
            @RequestBody DechetsDTO dto) {

        return ResponseEntity.ok(conteneurService.ajouterDechet(id, dto));
    }

    // Ajouter un citoyen dans un conteneur
    @PostMapping("/{id}/citoyens")
    @Operation(summary = "Ajouter un citoyen dans un conteneur")
    public ResponseEntity<ConteneurDTO> ajouterCitoyen(
            @PathVariable String id,
            @RequestBody CitoyenDTO dto) {

        return ResponseEntity.ok(conteneurService.ajouterCitoyen(id, dto));
    }
    
 // Supprimer un conteneur
    @Operation(summary = "Supprimer un conteneur")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        conteneurService.deleteConteneur(id);
    }
}
