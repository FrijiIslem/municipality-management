package com.projetJEE.projetJEE.controllers;
import java.util.List;		

import org.springframework.web.bind.annotation.*;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.services.UtilisateurServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {
	private final UtilisateurServiceInterface utilisateurService;

    // ------------------- Authentification -------------------
    @PostMapping("/auth")
    public boolean authentifier(@RequestParam String email, @RequestParam String password) {
        return utilisateurService.authentifier(email, password);
    }

}
