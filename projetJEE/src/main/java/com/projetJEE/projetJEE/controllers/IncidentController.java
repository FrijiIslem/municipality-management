package com.projetJEE.projetJEE.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.projetJEE.projetJEE.dto.IncidentDTO;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Incident.StatutIncident;
import com.projetJEE.projetJEE.services.IncidentServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/Incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentServiceInterface incidentService;

    // Rechercher par statut
    @GetMapping("/statut/{statut}")
    public List<Incident> getIncidentsByStatut(@PathVariable String statut) {
        try {
            StatutIncident statutEnum = StatutIncident.valueOf(statut.toUpperCase());
            return incidentService.getIncidentsByStatut(statutEnum);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut inconnu : " + statut);
        }
    }

    // Rechercher par date ou date + heure
    @GetMapping("/search")
    public List<Incident> searchIncidents(
            @RequestParam String date,
            @RequestParam(required = false) Integer hour
    ) {
        LocalDate localDate = LocalDate.parse(date); // yyyy-MM-dd
        return incidentService.getIncidentsByDayOrHour(localDate, hour);
    }
    // ---------------get all ---------------
    @GetMapping("/all")
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }
    //-----------get nb by cat----------------
    @GetMapping("/countByCategorie/{categorie}")
    public int countByCategorie(@PathVariable String categorie) {
        return incidentService.countIncidentsByCategorie(categorie);
    }
    
    //--------------createeee-----------------------------------------
    @PostMapping("/create")
    public Incident createIncident(@RequestBody IncidentDTO dto) {
        return incidentService.creeIncident(dto);
    }


}
