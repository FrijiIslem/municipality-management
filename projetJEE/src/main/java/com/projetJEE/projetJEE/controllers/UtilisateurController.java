package com.projetJEE.projetJEE.controllers;
import java.util.List;		

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.projetJEE.projetJEE.dto.AgentDTO;
import com.projetJEE.projetJEE.dto.CitoyenDTO;
import com.projetJEE.projetJEE.dto.UtilisateurDTO;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.mapper.UtilisateurMapper;
import com.projetJEE.projetJEE.services.UtilisateurServiceInterface;
import java.util.Map;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {
	private final UtilisateurServiceInterface utilisateurService;

    // ------------------- Authentification -------------------
    @PostMapping("/auth")
    public ResponseEntity<?> authentifier(@RequestParam String email, @RequestParam String password) {
        Utilisateur user = utilisateurService.authentifier(email, password);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Email ou mot de passe incorrect"));
        }
        
        // Convertir en DTO (sans le mot de passe) en utilisant le mapper
        UtilisateurDTO userDTO = UtilisateurMapper.toDTO(user);
        
        return ResponseEntity.ok(userDTO);
    }
    
    // ------------------- Récupérer l'utilisateur actuel -------------------
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam(required = false) String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email requis"));
        }
        
        List<Utilisateur> matches = utilisateurService.getUtilisateurByEmail(email);
        if (matches.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Utilisateur non trouvé"));
        }
        
        Utilisateur user = matches.get(0);
        UtilisateurDTO userDTO = UtilisateurMapper.toDTO(user);
        
        return ResponseEntity.ok(userDTO);
    }
    //------------------------Ajouter----------------
    @PostMapping("/citoyens")
    public Citoyen ajouterCitoyen(@RequestBody Citoyen citoyen) {
        return utilisateurService.ajouterCitoyen(citoyen);
    }
    @PostMapping("/agents")
    public Agent ajouterAgent(@RequestBody Agent agent) {
        // Log pour déboguer
        System.out.println("=== DEBUG: Agent reçu ===");
        System.out.println("Agent object: " + agent);
        System.out.println("Email: " + agent.getEmail());
        System.out.println("Nom: " + agent.getNom());
        System.out.println("Prenom: " + agent.getPrenom());
        System.out.println("Password: " + (agent.getPassword() != null ? "***" : "null"));
        System.out.println("NumeroTel: " + agent.getNumeroTel());
        System.out.println("Tache: " + agent.getTache());
        System.out.println("Disponibilite: " + agent.getDisponibilite());
        System.out.println("All fields: " + agent.toString());
        try {
            Agent saved = utilisateurService.ajouterAgent(agent);
            System.out.println("=== DEBUG: Agent sauvegardé avec ID: " + saved.getId() + " ===");
            return saved;
        } catch (Exception e) {
            System.err.println("=== ERREUR lors de la sauvegarde de l'agent ===");
            e.printStackTrace();
            throw e;
        }
    }
    //---------------get all-----------------------
    @GetMapping("/getcitoyens")
    public List<CitoyenDTO> getTousLesCitoyens() {
        return utilisateurService.getTousLesCitoyens();
    }
    @GetMapping("/getagents")
    public List<AgentDTO> getTousLesAgents() {
        return utilisateurService.getTousLesAgents();
    }
    //----------------get nb ----------------------
    @GetMapping("/citoyens/count")
    public long getNbCitoyen() {
        return utilisateurService.getNbCitoyen();
    }
    @GetMapping("/agents/count")
    public long getNbAgent() {
        return utilisateurService.getNbAgent();
    }
    //-----------------modifier----------------
    @PutMapping("/citoyensMod")
    public Citoyen modifierCitoyen(@RequestParam String ancienPassword, @RequestBody Citoyen citoyen) {
    	if(citoyen.getId() == null || citoyen.getId().isEmpty()) {
            throw new RuntimeException("❌ ID du citoyen requis !");
        }
    	return utilisateurService.modifierCitoyen(citoyen, ancienPassword);
    }
    @PutMapping("/agentsMod")
    public Agent modifierUnAgent(@RequestBody Agent agent) {
        return utilisateurService.modifierUnAgent(agent);
    }
    // --------------supp--------------------------
    @DeleteMapping("/citoyenssupp/{id}")
    public boolean supprimerCitoyen(@PathVariable String id) {
        
        return utilisateurService.supprimerCitoyen(id);
    }
    @DeleteMapping("/agentssupp/{id}")
    public boolean supprimerUnAgent(@PathVariable String id) {
        // Ici on peut ajouter une vérification de rôle si besoin
        return utilisateurService.supprimerUnAgent(id);
    }
    
    // for islem
    @GetMapping("/getagenttache/{tache}")
    public List<Agent> getAgentsDisponibles(@PathVariable String tache) {
        Agent.TypeTache typeTache = Agent.TypeTache.valueOf(tache.toUpperCase());
        return utilisateurService.getAgentsDisponiblesParTache(typeTache);
    }



}
