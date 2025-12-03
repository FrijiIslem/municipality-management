package com.projetJEE.projetJEE.test;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.repository.IncidentRepository;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer1 implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final IncidentRepository incidentRepository;

  

    public DataInitializer1(UtilisateurRepository utilisateurRepository,
                            IncidentRepository incidentRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("\n===== INSERTION DE NOUVELLES DONNÉES =====");

        // ----- NOUVEAUX AGENTS -----
        Agent agent3 = new Agent();
        agent3.setPrenom("Mohamed");
        agent3.setNom("Trabelsi");
        agent3.setDisponibilite(true);
        agent3.setPlageHoraire("7h-15h");
        agent3.setTache(Agent.TypeTache.AGENT_RAMASSEURS);
        agent3.setRole(Utilisateur.RoleUtilisateur.AGENT);
        agent3.setEmail("mohamed.trabelsi@email.com");
        agent3.setPassword("passMohamed123");

        utilisateurRepository.save(agent3);
        System.out.println("✔ Nouvel agent ajouté : " + agent3.getId());

        // ----- NOUVEAUX CITOYENS -----
        Citoyen citoyen4 = new Citoyen();
        citoyen4.setPrenom("Amina");
        citoyen4.setNom("Haddad");
        citoyen4.setAdresse("Monastir");
        citoyen4.setRole(Utilisateur.RoleUtilisateur.CITOYEN);
        citoyen4.setEmail("amina.haddad@email.com");
        citoyen4.setPassword("passAmina123");

        utilisateurRepository.save(citoyen4);
        System.out.println("✔ Nouveau citoyen ajouté : " + citoyen4.getId());

        // ----- NOUVEAUX INCIDENTS -----
        Incident incident4 = new Incident();
        incident4.setDescription("Conteneur débordant à Monastir");
        incident4.setStatut(Incident.StatutIncident.EN_ATTENTE);
        incident4.setCategorie(Incident.CategorieIncident.CONTENEUR);
        incident4.setDate(new Date());
        incident4.setUtilisateurId(citoyen4.getId());

        incidentRepository.save(incident4);
        System.out.println("✔ Nouvel incident ajouté pour : " + citoyen4.getPrenom());

        System.out.println("===== INSERTION TERMINÉE =====\n");
    }
}
