package com.projetJEE.projetJEE.services;
import java.time.LocalDate;	
import java.util.Date;	
import java.util.List;
import java.util.List;

import com.projetJEE.projetJEE.dto.IncidentDTO;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Incident.StatutIncident;

public interface IncidentServiceInterface {
		public List<Incident> getIncidentsByStatut(StatutIncident statut);
		 public List<Incident> getIncidentsByDayOrHour(Date day, Integer hour) ;  // java.util.Date
	    List<Incident> getIncidentsByPriorite(String priorite);
	    int countIncidentsByStatut(String statut);
	    public Incident creeIncident(IncidentDTO dto);
	    Incident getIncidentById(String id);
	    List<Incident> getAllIncidents();
		List<Incident> getIncidentsByDayOrHour(LocalDate localDate, Integer hour);
	    int countIncidentsByCategorie(String categorie);   

	    Incident updateStatut(String id, String statut);


}
