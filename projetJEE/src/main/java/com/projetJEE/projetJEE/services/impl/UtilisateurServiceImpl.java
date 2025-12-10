package com.projetJEE.projetJEE.services.impl;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.projetJEE.projetJEE.dto.AgentDTO;
import com.projetJEE.projetJEE.dto.CitoyenDTO;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;
import com.projetJEE.projetJEE.mapper.AgentMapper;
import com.projetJEE.projetJEE.mapper.CitoyenMapper;
import com.projetJEE.projetJEE.repository.IncidentRepository;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import com.projetJEE.projetJEE.services.UtilisateurServiceInterface;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(UtilisateurServiceImpl.class);

    private final UtilisateurRepository utilisateurRepository;
    private final IncidentRepository incidentRepository;

	@Override
	public boolean authentifier(String email, String password) {
	    List<Utilisateur> matches = utilisateurRepository.findAllByEmail(email);
	    if (matches.isEmpty()) {
	        return false;
	    }
	    if (matches.size() > 1) {
	        logger.warn("Plusieurs utilisateurs partagent le même email {}. Vérifiez les données MongoDB.", email);
	    }
	    return matches.stream().anyMatch(u -> Objects.equals(u.getPassword(), password));
	}

	@Override
	public Citoyen ajouterCitoyen(Citoyen citoyen) {
        // Vérifier que les champs obligatoires ne sont pas null
        if (citoyen.getEmail() == null || citoyen.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ L'email est obligatoire !");
        }
        if (citoyen.getPassword() == null || citoyen.getPassword().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ Le mot de passe est obligatoire !");
        }
        if (citoyen.getNom() == null || citoyen.getNom().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ Le nom est obligatoire !");
        }
        if (citoyen.getPrenom() == null || citoyen.getPrenom().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ Le prénom est obligatoire !");
        }

        // Vérifier si l'email existe déjà
		boolean emailExiste = !utilisateurRepository.findAllByEmail(citoyen.getEmail()).isEmpty();
	    if (emailExiste) {
	        throw new ResponseStatusException(
	            HttpStatus.CONFLICT, "❌ Citoyen existe déjà avec cet email !");
	    }
	
        // Créer un nouveau citoyen avec toutes les valeurs
        Citoyen citoyenToSave = new Citoyen();
        citoyenToSave.setNom(citoyen.getNom().trim());
        citoyenToSave.setPrenom(citoyen.getPrenom().trim());
        citoyenToSave.setEmail(citoyen.getEmail().trim());
        citoyenToSave.setPassword(citoyen.getPassword());
        citoyenToSave.setRole(RoleUtilisateur.CITOYEN);
        
        // Champs optionnels
        if (citoyen.getNumeroTel() != null) {
            citoyenToSave.setNumeroTel(citoyen.getNumeroTel());
        }
        if (citoyen.getAdresse() != null && !citoyen.getAdresse().trim().isEmpty()) {
            citoyenToSave.setAdresse(citoyen.getAdresse().trim());
        }

        // Sauvegarder dans MongoDB
	    return utilisateurRepository.save(citoyenToSave);
	}

	@Override
	public List<CitoyenDTO> getTousLesCitoyens() {
		 return utilisateurRepository.findByRole(Citoyen.RoleUtilisateur.CITOYEN)
		            .stream()
		            .map(c -> CitoyenMapper.toDTO((Citoyen) c)) // transformer entité en DTO
		            .toList();
	}

	@Override
	public long getNbCitoyen() {
	    return utilisateurRepository.countByRole(Citoyen.RoleUtilisateur.CITOYEN);

	}

	@Override
	public double getPointCollect() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Citoyen modifierCitoyen(Citoyen citoyen, String ancienPassword) {
	    Citoyen existing = (Citoyen) utilisateurRepository.findById(citoyen.getId())
	            .orElseThrow(() -> new RuntimeException("❌ Citoyen non trouvé avec l'ID : " + citoyen.getId()));

	    //  l'ancien
	    if (!existing.getPassword().equals(ancienPassword)) {
	        throw new RuntimeException("❌ Ancien mot de passe incorrect !");
	    }

	    existing.setNom(citoyen.getNom() != null ? citoyen.getNom() : existing.getNom());
	    existing.setPrenom(citoyen.getPrenom() != null ? citoyen.getPrenom() : existing.getPrenom());
	    existing.setEmail(citoyen.getEmail() != null ? citoyen.getEmail() : existing.getEmail());
	    existing.setNumeroTel(citoyen.getNumeroTel() != null ? citoyen.getNumeroTel() : existing.getNumeroTel());
	    existing.setAdresse(citoyen.getAdresse() != null ? citoyen.getAdresse() : existing.getAdresse());

	    if (citoyen.getPassword() != null && !citoyen.getPassword().isEmpty()) {
	        existing.setPassword(citoyen.getPassword());
	    }

	    // save 
	    return (Citoyen) utilisateurRepository.save(existing);
	}

	@Override
	public boolean supprimerCitoyen(String id) {
		  
	    if (!utilisateurRepository.existsById(id)) {
	        throw new RuntimeException("❌ Citoyen non trouvé !");
	    }

	    utilisateurRepository.deleteById(id);
	    return true;
	}

	@Override
	public Incident signalerUnIncidentPourCitoyen(Incident incident, String citoyenId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Agent ajouterAgent(Agent agent) {
        // Vérifier que les champs obligatoires ne sont pas null
        if (agent.getEmail() == null || agent.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ L'email est obligatoire !");
        }
        if (agent.getPassword() == null || agent.getPassword().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ Le mot de passe est obligatoire !");
        }
        if (agent.getNom() == null || agent.getNom().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ Le nom est obligatoire !");
        }
        if (agent.getPrenom() == null || agent.getPrenom().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "❌ Le prénom est obligatoire !");
        }

        // Vérifier si l'email existe déjà
        List<Utilisateur> matches = utilisateurRepository.findAllByEmail(agent.getEmail());
        if (!matches.isEmpty()) {
            logger.warn("Tentative d'ajout d'un agent avec un email déjà utilisé {} ({} occurrences).",
                    agent.getEmail(), matches.size());
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "❌ agent existe déjà avec cet email !");
        }

        // Créer un nouvel agent avec toutes les valeurs
        Agent agentToSave = new Agent();
        agentToSave.setNom(agent.getNom().trim());
        agentToSave.setPrenom(agent.getPrenom().trim());
        agentToSave.setEmail(agent.getEmail().trim());
        agentToSave.setPassword(agent.getPassword());
        agentToSave.setRole(RoleUtilisateur.AGENT);
        
        // Champs optionnels
        if (agent.getNumeroTel() != null) {
            agentToSave.setNumeroTel(agent.getNumeroTel());
        }
        if (agent.getDisponibilite() != null) {
            agentToSave.setDisponibilite(agent.getDisponibilite());
        } else {
            agentToSave.setDisponibilite(true); // Par défaut disponible
        }
        if (agent.getPlageHoraire() != null && !agent.getPlageHoraire().trim().isEmpty()) {
            agentToSave.setPlageHoraire(agent.getPlageHoraire().trim());
        }
        if (agent.getTache() != null) {
            agentToSave.setTache(agent.getTache());
        }

        System.out.println("=== DEBUG UtilisateurServiceImpl.ajouterAgent ===");
        System.out.println("Agent à sauvegarder: " + agentToSave);
        System.out.println("ID avant save: " + agentToSave.getId());
        
        Agent saved = utilisateurRepository.save(agentToSave);
        System.out.println("Agent sauvegardé: " + saved);
        System.out.println("ID après save: " + saved.getId());
        
        return saved;
    }

	@Override
	public List<AgentDTO> getTousLesAgents() {
		 return utilisateurRepository.findByRole(Agent.RoleUtilisateur.AGENT)
		            .stream()
		            .map(a -> AgentMapper.toDTO((Agent) a)) // transformer entité en DTO
		            .toList();
	}

	@Override
	public long getNbAgent() {
	    return utilisateurRepository.countByRole(Agent.RoleUtilisateur.AGENT);

	}

	
	
	//**************************************WATING FOR TOURNNEEµµµµµµµµµµµµµµµµµ
	
	@Override
	public boolean marqueDebutTournee(String agentId) {
		/*
		 * // Vérifier si l'agent existe et est un Agent Optional<Agent> agentOpt =
		 * utilisateurRepository.findById(agentId) .filter(u -> u instanceof Agent)
		 * .map(u -> (Agent) u);
		 * 
		 * if (agentOpt.isEmpty()) { return false; // agent non trouvé }
		 * 
		 * Agent agent = agentOpt.get();
		 * 
		 * // Trouver la tournée planifiée pour ce chauffeur Optional<Tournee>
		 tourneeOpt = tourneeRepository.findByAgentChauffeur_IdAndEtat(agent.getId(),
		 EtatTournee.PLANIFIEE);
		 * 
		 * if (tourneeOpt.isPresent()) { Tournee tournee = tourneeOpt.get();
		 * tournee.setEtat(EtatTournee.ENCOURS);
		 * tournee.setDateDebut(LocalDateTime.now()); tourneeRepository.save(tournee);
		 * return true; // tournée démarrée }
		 * 
		 * return false; // aucune tournée planifiée trouvée }
		 */
		return false;
	}

	@Override
	public boolean marqueFinTournee(String agentId) {
		/*
		 * // Vérifier si l'agent existe et est un Agent Optional<Agent> agentOpt =
		 * utilisateurRepository.findById(agentId) .filter(u -> u instanceof Agent)
		 * .map(u -> (Agent) u);
		 * 
		 * if (agentOpt.isEmpty()) { return false; // agent non trouvé }
		 * 
		 * Agent agent = agentOpt.get();
		 * 
		 * // Trouver la tournée en cours pour ce chauffeur Optional<Tournee> tourneeOpt
		 * = tourneeRepository.findByAgentChauffeur_IdAndEtat(agent.getId(),
		 * EtatTournee.ENCOURS);
		 * 
		 * if (tourneeOpt.isPresent()) { Tournee tournee = tourneeOpt.get();
		 * tournee.setEtat(EtatTournee.TERMINEE);
		 * tournee.setDateFin(LocalDateTime.now()); tourneeRepository.save(tournee);
		 * return true; // tournée terminée }
		 * 
		 * return false; // aucune tournée en cours trouvée }
		 */
		return false;
	}

	@Override
	public boolean marquerContentVidee(String agentId) {
		// TODO Auto-generated method stub
		return false;
	}
	// admin 
	@Override
	public Agent modifierUnAgent(Agent agent) {
		 
	    Agent agentExistant = (Agent) utilisateurRepository.findById(agent.getId())
	            .orElseThrow(() -> new RuntimeException("❌ Agent non trouvé !"));

	    agentExistant.setNom(agent.getNom());
	    agentExistant.setPrenom(agent.getPrenom());
	    agentExistant.setEmail(agent.getEmail());
	    agentExistant.setNumeroTel(agent.getNumeroTel());
	    agentExistant.setDisponibilite(agent.getDisponibilite());
	    agentExistant.setPlageHoraire(agent.getPlageHoraire());
	    agentExistant.setTache(agent.getTache());

	    
	    return (Agent) utilisateurRepository.save(agentExistant);
	}

	@Override
	public boolean supprimerUnAgent(String id) {
		  
	    if (!utilisateurRepository.existsById(id)) {
	        throw new RuntimeException("❌ Agent non trouvé !");
	    }

	    utilisateurRepository.deleteById(id);
	    return true;
	}

	@Override
	public Incident signalerUnIncidentPourAgent(Incident incident, String agentId) {
		// TODO Auto-generated method stub
		return null;
	}
	

	// false  
@Override
public List<Utilisateur> getAgentsByTacheEtDisponibilite(Agent.TypeTache tache, Boolean dispo) {
    return null;
    
}
//for islem
@Override

public List<Agent> getAgentsDisponiblesParTache(Agent.TypeTache tache) {
    // Récupérer tous les utilisateurs avec rôle AGENT
    List<Utilisateur> utilisateurs = utilisateurRepository.findByRole(RoleUtilisateur.AGENT);

    // Filtrer uniquement les Agents correspondant à la tâche et disponibles
    return utilisateurs.stream()
            .filter(u -> u instanceof Agent)           // s'assurer que c'est un Agent
            .map(u -> (Agent) u)                        // cast en Agent
            .filter(a -> a.getTache() == tache && Boolean.TRUE.equals(a.getDisponibilite()))
            .collect(Collectors.toList());
}
}
