package com.projetJEE.projetJEE.controllers;

import com.projetJEE.projetJEE.dto.TourneeDto;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;
import com.projetJEE.projetJEE.services.TourneeService;
import com.projetJEE.projetJEE.services.AutomaticPlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tournees")
public class TourneeController {

    private static final Logger logger = LoggerFactory.getLogger(TourneeController.class);

    @Autowired
    private TourneeService tourneeService;

    @Autowired
    private AutomaticPlanningService automaticPlanningService;

    @GetMapping
    public ResponseEntity<List<TourneeDto>> getAllTournees() {
        List<TourneeDto> tournees = tourneeService.getAllTournees();
        logger.info("Fetched tournees: {}", tournees);
        return ResponseEntity.ok(tournees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourneeDto> getTourneeById(@PathVariable String id) {
        TourneeDto tournee = tourneeService.getTourneeById(id);
        return ResponseEntity.ok(tournee);
    }

    @PostMapping
    public ResponseEntity<TourneeDto> createTournee(@RequestBody TourneeDto tourneeDto) {
        TourneeDto createdTournee = tourneeService.createTournee(tourneeDto);
        return ResponseEntity.ok(createdTournee);
    }

    /**
     * Endpoint pour déclencher manuellement la planification automatique
     * Utile pour les tests ou pour forcer une planification en dehors de l'horaire programmé
     * IMPORTANT: Cet endpoint doit être placé AVANT les autres mappings pour éviter les conflits
     */
    @PostMapping("/planifier-automatique")
    public ResponseEntity<TourneeDto> planifierAutomatique() {
        logger.info("Déclenchement manuel de la planification automatique");
        try {
            TourneeDto tournee = automaticPlanningService.planifyDailyTournees();
            if (tournee != null) {
                logger.info("Planification automatique réussie, tournée créée: {}", tournee.getId());
                return ResponseEntity.ok(tournee);
            } else {
                logger.warn("Planification automatique n'a pas pu créer de tournée");
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la planification automatique", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/planifier")
    public ResponseEntity<TourneeDto> planifierTournee(@RequestBody TourneeDto tourneeDto) {
        TourneeDto plannedTournee = tourneeService.planifierTournee(tourneeDto);
        return ResponseEntity.ok(plannedTournee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourneeDto> updateTournee(@PathVariable String id, @RequestBody TourneeDto tourneeDto) {
        TourneeDto updatedTournee = tourneeService.updateTournee(id, tourneeDto);
        return ResponseEntity.ok(updatedTournee);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<TourneeDto> validerTournee(@PathVariable String id) {
        TourneeDto tournee = tourneeService.validerTournee(id);
        return ResponseEntity.ok(tournee);
    }

    @PutMapping("/{id}/liberer")
    public ResponseEntity<TourneeDto> libererTournee(@PathVariable String id) {
        TourneeDto tournee = tourneeService.libererTournee(id);
        return ResponseEntity.ok(tournee);
    }

    @PutMapping("/{id}/affecter-agent/{agentId}")
    public ResponseEntity<TourneeDto> affecterAgent(@PathVariable String id, @PathVariable String agentId) {
        TourneeDto updatedTournee = tourneeService.affecterAgent(id, agentId);
        return ResponseEntity.ok(updatedTournee);
    }

    @PutMapping("/{id}/affecter-vehicule/{vehiculeId}")
    public ResponseEntity<TourneeDto> affecterVehicule(@PathVariable String id, @PathVariable String vehiculeId) {
        TourneeDto tournee = tourneeService.affectervehicule(id, vehiculeId);
        if (tournee != null) {
            return ResponseEntity.ok(tournee);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournee(@PathVariable String id) {
        tourneeService.deleteTournee(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/duree")
    public ResponseEntity<Long> getDureeTournee(@PathVariable String id) {
        Duration duree = tourneeService.getDureeTournee(id);
        return ResponseEntity.ok(duree.toMinutes());
    }

    @GetMapping("/etat/{etat}")
    public ResponseEntity<List<TourneeDto>> getTourneesByEtat(@PathVariable EtatTournee etat) {
        List<TourneeDto> tournees = tourneeService.getTourneesByEtat(etat);
        return ResponseEntity.ok(tournees);
    }

    @GetMapping("/duree/moyenne")
    public ResponseEntity<Double> getDureeMoyenneTournees() {
        Double dureeMoyenne = tourneeService.getDureeMoyenneTournees();
        return ResponseEntity.ok(dureeMoyenne);
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<TourneeDto>> getTourneesByAgent(@PathVariable String agentId) {
        List<TourneeDto> tournees = tourneeService.getTourneesByAgent(agentId);
        return ResponseEntity.ok(tournees);
    }
}