package com.projetJEE.projetJEE.services;

import java.util.List;	

import com.projetJEE.projetJEE.dto.AgentDTO;
import com.projetJEE.projetJEE.dto.CitoyenDTO;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Agent.TypeTache;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Utilisateur;

public interface UtilisateurServiceInterface {
    boolean authentifier(String email, String password);

	 // ----- Citoyen -----
    Citoyen ajouterCitoyen(Citoyen citoyen);
    List<CitoyenDTO >getTousLesCitoyens();
    long getNbCitoyen();
    double getPointCollect();  //*******IMP GET UNE LISTE DE CONTENEUR***
    Citoyen modifierCitoyen(Citoyen citoyen , String ancienPassword);
    boolean supprimerCitoyen(String id);
    Incident signalerUnIncidentPourCitoyen(Incident incident, String citoyenId);
    // ----- Agent -----
    Agent ajouterUnAgent(Agent agent);
    List<AgentDTO> getTousLesAgents();
    long getNbAgent();
    boolean marqueDebutTournee(String agentId);
    boolean marqueFinTournee(String agentId);
    boolean marquerContentVidee(String agentId);
    Agent modifierUnAgent(Agent agent);
    boolean supprimerUnAgent(String id);
    Incident signalerUnIncidentPourAgent(Incident incident, String agentId);

	List<Utilisateur> getAgentsByTacheEtDisponibilite(TypeTache tache, Boolean dispo);
	public List<Agent> getAgentsDisponiblesParTache(Agent.TypeTache tache);
	
}
