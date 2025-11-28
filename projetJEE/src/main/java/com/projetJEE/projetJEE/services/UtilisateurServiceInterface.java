package com.projetJEE.projetJEE.services;

import java.util.List;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;

public interface UtilisateurServiceInterface {
    boolean authentifier(String email, String password);

	 // ----- Citoyen -----
    Citoyen ajouterCitoyen(Citoyen citoyen);
    List<Citoyen> getTousLesCitoyens();
    long getNbCitoyen();
    double getPointCollect();  //*******IMP GET UNE LISTE DE CONTENEUR***
    Citoyen modifierCitoyen(Citoyen citoyen);
    boolean supprimerCitoyen(String id);
    Incident signalerUnIncidentPourCitoyen(Incident incident, String citoyenId);
    // ----- Agent -----
    Agent ajouterUnAgent(Agent agent);
    List<Agent> getTousLesAgents();
    long getNbAgent();
    boolean marqueDebutTournee(String agentId);
    boolean marqueFinTournee(String agentId);
    boolean marquerContentVidee(String agentId);
    Agent modifierUnAgent(Agent agent);
    boolean supprimerUnAgent(String id);
    Incident signalerUnIncidentPourAgent(Incident incident, String agentId);
	
}
