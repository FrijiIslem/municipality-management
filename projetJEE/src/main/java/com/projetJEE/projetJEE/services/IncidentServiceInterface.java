package com.projetJEE.projetJEE.services;

import java.sql.Date;
import java.util.List;

import com.projetJEE.projetJEE.entities.Incident;

public interface IncidentServiceInterface {
	   List<Incident> getIncidentsByStatut(String statut);
	    List<Incident> getIncidentsBetweenDates(Date dateDebut, Date dateFin);
	    List<Incident> getIncidentsByPriorite(String priorite);
	    int countIncidentsByStatut(String statut);
	    Incident ajouterIncident(Incident incident);
	    Incident modifierIncident(Incident incident);
	    boolean supprimerIncident(String id);
	    Incident getIncidentById(String id);
	    List<Incident> getAllIncidents();
}
