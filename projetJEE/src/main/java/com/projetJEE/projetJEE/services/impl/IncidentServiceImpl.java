package com.projetJEE.projetJEE.services.impl;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.projetJEE.projetJEE.dto.IncidentDTO;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Incident.StatutIncident;
import com.projetJEE.projetJEE.repository.IncidentRepository;
import com.projetJEE.projetJEE.services.IncidentServiceInterface;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentServiceInterface {

    private final IncidentRepository incidentRepository;

    @Override
    public List<Incident> getIncidentsByStatut(StatutIncident statut) {
        return incidentRepository.findByStatut(statut);
    }

    @Override
    public List<Incident> getIncidentsByDayOrHour(LocalDate localDate, Integer hour) {

        // ⚡ On utilise UTC car MongoDB stocke les dates en UTC
        ZoneId utc = ZoneId.of("UTC");

        LocalDateTime start;
        LocalDateTime end;

        if (hour == null) {
            // Recherche par JOUR
            start = localDate.atStartOfDay();       // 00:00:00
            end   = localDate.atTime(23, 59, 59);  // 23:59:59
        } else {
            // Recherche par HEURE
            start = localDate.atTime(hour, 0, 0);   // ex: 20:00:00
            end   = localDate.atTime(hour, 59, 59); // ex: 20:59:59
        }

        Date startDate = Date.from(start.atZone(utc).toInstant());
        Date endDate   = Date.from(end.atZone(utc).toInstant());

        System.out.println("START = " + startDate);
        System.out.println("END   = " + endDate);

        return incidentRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    public List<Incident> getIncidentsByPriorite(String priorite) {
        return null; // non utilisé pour l'instant
    }

    @Override
    public int countIncidentsByStatut(String statut) {
        return 0; // non utilisé pour l'instant
    }

    @Override
    public Incident getIncidentById(String id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident introuvable pour l'id: " + id));
    }

    @Override
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }
    @Override
    public int countIncidentsByCategorie(String categorie) {
        try {
            Incident.CategorieIncident catEnum = Incident.CategorieIncident.valueOf(categorie.toUpperCase());
            return incidentRepository.findByCategorie(catEnum).size();
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Catégorie inconnue : " + categorie);
        }
    }
    @Override
    public Incident creeIncident(IncidentDTO dto) {

        // Création d’un objet Incident
        Incident incident = new Incident();
        incident.setCategorie(dto.getCategorie());
        incident.setDescription(dto.getDescription());
        incident.setUtilisateurId(dto.getUtilisateurId());

        // Date actuelle
        incident.setDate(new Date());

        // Par défaut chaque incident commence par "EN_ATTENTE"
        incident.setStatut(Incident.StatutIncident.EN_ATTENTE);

        // Sauvegarde MongoDB
        return incidentRepository.save(incident);
    }

    @Override
    public Incident updateStatut(String id, String statut) {
        Incident incident = getIncidentById(id);
        try {
            incident.setStatut(StatutIncident.valueOf(statut.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut inconnu : " + statut);
        }
        return incidentRepository.save(incident);
    }


	@Override
	public List<Incident> getIncidentsByDayOrHour(Date day, Integer hour) {
		// TODO Auto-generated method stub
		return null;
	}
}
