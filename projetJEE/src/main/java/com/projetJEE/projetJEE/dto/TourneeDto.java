package com.projetJEE.projetJEE.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;

 @Builder
public class TourneeDto {
    private String id;
    private List<ConteneurDTO> conteneur;
    private AgentDto agent;
    private LocalDateTime dateDebut;
    private EtatTournee etat;
    private String itineraire;
    private VehiculeDTO vehicule;
	public EtatTournee getEtat() {
		// TODO Auto-generated method stub
		return null;
	}
	public String getItineraire() {
		// TODO Auto-generated method stub
		return null;
	}
	public LocalDateTime getDateDebut() {
		// TODO Auto-generated method stub
		return null;
	}
	public String getId() {
		// TODO Auto-generated method stub
		return null;
	}
	public List<ConteneurDTO> getConteneur() {
		return conteneur;
	}
	public void setConteneur(List<ConteneurDTO> conteneur) {
		this.conteneur = conteneur;
	}
	public AgentDto getAgent() {
		return agent;
	}
	public void setAgent(AgentDto agent) {
		this.agent = agent;
	}
	public VehiculeDTO getVehicule() {
		return vehicule;
	}
	public void setVehicule(VehiculeDTO vehicule) {
		this.vehicule = vehicule;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setDateDebut(LocalDateTime dateDebut) {
		this.dateDebut = dateDebut;
	}
	public void setEtat(EtatTournee etat) {
		this.etat = etat;
	}
	public void setItineraire(String itineraire) {
		this.itineraire = itineraire;
	}
	public void setAgentId(Object object) {
		// TODO Auto-generated method stub
		
	}
	public void setVehiculeId(Object object) {
		// TODO Auto-generated method stub
		
	}
	public void setConteneurIds(Object conteneurIds) {
		// TODO Auto-generated method stub
		
	}
}
