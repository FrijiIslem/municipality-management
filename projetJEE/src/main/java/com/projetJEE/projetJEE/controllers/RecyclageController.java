package com.projetJEE.projetJEE.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projetJEE.projetJEE.dto.RecyclageDTO;
import com.projetJEE.projetJEE.services.RecyclageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recyclage")
@RequiredArgsConstructor
public class RecyclageController {

    private final RecyclageService recyclageService;

    // Enregistrer une opération de recyclage
    @PostMapping
    public ResponseEntity<RecyclageDTO> create(@RequestBody RecyclageDTO dto) {
        return ResponseEntity.ok(recyclageService.create(dto));
    }

    // ➤ Lister toutes les opérations
    @GetMapping
    public ResponseEntity<List<RecyclageDTO>> findAll() {
        return ResponseEntity.ok(recyclageService.findAll());
    }

    // ➤ Trouver une opération par son ID
    @GetMapping("/{id}")
    public ResponseEntity<RecyclageDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok(recyclageService.findById(id));
    }

    // ➤ Modifier une opération de recyclage
    @PutMapping("/{id}")
    public ResponseEntity<RecyclageDTO> update(
            @PathVariable String id,
            @RequestBody RecyclageDTO dto) {
        return ResponseEntity.ok(recyclageService.update(id, dto));
    }

    // ➤ Supprimer une opération
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        recyclageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
