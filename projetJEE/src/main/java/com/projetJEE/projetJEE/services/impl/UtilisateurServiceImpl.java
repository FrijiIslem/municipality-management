package com.projetJEE.projetJEE.services.impl;

import java.util.List;	

import org.springframework.stereotype.Service;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.repository.IncidentRepository;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import com.projetJEE.projetJEE.services.UtilisateurServiceInterface;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurServiceInterface {

    private final UtilisateurRepository utilisateurRepository;
    private final IncidentRepository incidentRepository;

	@Override
	public boolean authentifier(String email, String password) {
	    return utilisateurRepository.findByEmail(email)
	            .filter(u -> u.getPassword().equals(password))
	            .isPresent();
	}

	@Override
	public Citoyen ajouterCitoyen(Citoyen citoyen) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Citoyen> getTousLesCitoyens() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public long getNbCitoyen() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public double getPointCollect() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Citoyen modifierCitoyen(Citoyen citoyen) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean supprimerCitoyen(String id) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Incident signalerUnIncidentPourCitoyen(Incident incident, String citoyenId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Agent ajouterUnAgent(Agent agent) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Agent> getTousLesAgents() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public long getNbAgent() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public boolean marqueDebutTournee(String agentId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean marqueFinTournee(String agentId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean marquerContentVidee(String agentId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Agent modifierUnAgent(Agent agent) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean supprimerUnAgent(String id) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Incident signalerUnIncidentPourAgent(Incident incident, String agentId) {
		// TODO Auto-generated method stub
		return null;
	}


}
