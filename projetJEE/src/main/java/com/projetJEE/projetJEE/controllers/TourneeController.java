package com.projetJEE.projetJEE.controllers;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.services.TourneeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tournees")
@CrossOrigin(origins = "*")
public class TourneeController {

    @Autowired
    private TourneeService tourneeService;

    // Créer une tournée
    @PostMapping
    public ResponseEntity<TourneeDto> createTournee(@RequestBody TourneeDto tourneeDto) {
        TourneeDto created = tourneeService.createTournee(tourneeDto);
        return ResponseEntity.ok(created);
    }

    // Lister toutes les tournées
    @GetMapping
    public ResponseEntity<List<TourneeDto>> getAllTournees() {
        return ResponseEntity.ok(tourneeService.getAllTournees());
    }

    // Récupérer une tournée par ID
    @GetMapping("/{id}")
    public ResponseEntity<TourneeDto> getTourneeById(@PathVariable String id) {
        TourneeDto tournee = tourneeService.getTourneeById(id);
        if (tournee != null) {
            return ResponseEntity.ok(tournee);
        }
        return ResponseEntity.notFound().build();
    }

    // Supprimer une tournée
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerTournee(@PathVariable String id) {
        tourneeService.supprimerTournee(id);
        return ResponseEntity.noContent().build();
    }

    // Tournées par agent
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<TourneeDto>> getTourneesByAgent(@PathVariable String agentId) {
        return ResponseEntity.ok(tourneeService.getTourneesByAgent(agentId));
    }

    // Tournées par état
    @GetMapping("/etat/{etat}")
    public ResponseEntity<List<TourneeDto>> getTourneesByEtat(@PathVariable String etat) {
        return ResponseEntity.ok(tourneeService.getTourneesByEtat(etat));
    }

    // Planifier une tournée
    @PostMapping("/planifier")
    public ResponseEntity<TourneeDto> planifierTournee(@RequestBody TourneeDto tourneeDto) {
        return ResponseEntity.ok(tourneeService.planifierTournee(tourneeDto));
    }

    // Affecter un agent à une tournée
    @PutMapping("/{id}/affecter/{agentId}")
    public ResponseEntity<Void> affecterTournee(@PathVariable String id, @PathVariable String agentId) {
        tourneeService.affecterTournee(id, agentId);
        return ResponseEntity.ok().build();
    }

    // Modifier une tournée
    @PutMapping("/")
    public ResponseEntity<TourneeDto> modifierTournee(@RequestBody TourneeDto tourneeDto) {
        return ResponseEntity.ok(tourneeService.modifierTournee(tourneeDto));
    }

    // Valider une tournée
    @PutMapping("/{id}/valider")
    public ResponseEntity<Void> validerTournee(@PathVariable String id) {
        tourneeService.validerTournee(id);
        return ResponseEntity.ok().build();
    }

    // Libérer une tournée
    @PutMapping("/{id}/liberer")
    public ResponseEntity<Void> libererTournee(@PathVariable String id) {
        tourneeService.libererTournee(id);
        return ResponseEntity.ok().build();
    }

    // Obtenir la durée d'une tournée
    @GetMapping("/{id}/duree")
    public ResponseEntity<Long> getDureeTournee(@PathVariable String id) {
        return ResponseEntity.ok(tourneeService.getDureeTournee(id));
    }

    // Obtenir la durée moyenne des tournées
    @GetMapping("/duree/moyenne")
    public ResponseEntity<Double> getMoyenneDureeTournees() {
        return ResponseEntity.ok(tourneeService.moyenneDureeTournees());
    }
}
