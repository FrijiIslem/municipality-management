package com.projetJEE.projetJEE.controller;

import com.projetJEE.projetJEE.entity.Conteneur;
import com.projetJEE.projetJEE.service.ConteneurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conteneurs")
@RequiredArgsConstructor
public class ConteneurController {

    private final ConteneurService conteneurService;

    @PostMapping
    public Conteneur create(@RequestBody Conteneur conteneur) {
        return conteneurService.createConteneur(conteneur);
    }

    @PutMapping("/{id}")
    public Conteneur update(@PathVariable String id, @RequestBody Conteneur conteneur) {
        return conteneurService.updateConteneur(id, conteneur);
    }

    @GetMapping("/{id}")
    public Conteneur getOne(@PathVariable String id) {
        return conteneurService.getConteneurById(id);
    }

    @GetMapping
    public List<Conteneur> getAll() {
        return conteneurService.getAllConteneurs();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        conteneurService.deleteConteneur(id);
    }

    @PutMapping("/{id}/etat")
    public Conteneur updateEtat(@PathVariable String id, @RequestBody Conteneur conteneur) {
        return conteneurService.updateEtatRemplissage(id, conteneur);
    }
}
