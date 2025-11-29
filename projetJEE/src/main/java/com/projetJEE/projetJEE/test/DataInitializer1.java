package com.projetJEE.projetJEE.test;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.repository.AgentRepository;
import com.projetJEE.projetJEE.repository.CitoyenRepository;
import com.projetJEE.projetJEE.repository.IncidentRepository;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer1 implements CommandLineRunner {

    private final AgentRepository agentRepository;
    private final CitoyenRepository citoyenRepository;
    private final IncidentRepository incidentRepository;

    public DataInitializer1(AgentRepository agentRepository, CitoyenRepository citoyenRepository, IncidentRepository incidentRepository) {
        this.agentRepository = agentRepository;
        this.citoyenRepository = citoyenRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("\n===== INITIALISATION DES DONNÉES MONGODB =====");

        // ----- AGENTS -----
        Agent agent1 = new Agent();
        agent1.setPrenom("Ali");
        agent1.setNom("Ben Salah");
        agent1.setDisponibilite(true);
        agent1.setPlageHoraire("8h-16h");
        agent1.setTache("Collecte");
        agent1.setRole(com.projetJEE.projetJEE.entities.Agent.RoleUtilisateur.AGENT);
        agent1.setEmail("ali.bensalah@email.com");
        agent1.setPassword("passAli123");
        agentRepository.save(agent1);
        System.out.println("✔ Agent ajouté : " + agent1.getId());

        Agent agent2 = new Agent();
        agent2.setPrenom("Sara");
        agent2.setNom("Khlifi");
        agent2.setDisponibilite(true);
        agent2.setPlageHoraire("10h-18h");
        agent2.setTache("Nettoyage");
        agent2.setRole(com.projetJEE.projetJEE.entities.Agent.RoleUtilisateur.AGENT);
        agent2.setEmail("sara.khlifi@email.com");
        agent2.setPassword("passSara123");
        agentRepository.save(agent2);
        System.out.println("✔ Agent ajouté : " + agent2.getId());

        // ----- CITOYENS -----
        Citoyen citoyen1 = new Citoyen();
        citoyen1.setPrenom("Farah");
        citoyen1.setNom("Moussa");
        citoyen1.setAdresse("Sfax");
        citoyen1.setRole(com.projetJEE.projetJEE.entities.Citoyen.RoleUtilisateur.CITOYEN);
        citoyen1.setEmail("farah.moussa@email.com");
        citoyen1.setPassword("passFarah123");
        citoyenRepository.save(citoyen1);
        System.out.println("✔ Citoyen ajouté : " + citoyen1.getId());

        Citoyen citoyen2 = new Citoyen();
        citoyen2.setPrenom("Molka");
        citoyen2.setNom("Moussa");
        citoyen2.setAdresse("Sousse");
        citoyen2.setRole(com.projetJEE.projetJEE.entities.Citoyen.RoleUtilisateur.CITOYEN);
        citoyen2.setEmail("molka.moussa@email.com");
        citoyen2.setPassword("passMolka123");
        citoyenRepository.save(citoyen2);
        System.out.println("✔ Citoyen ajouté : " + citoyen2.getId());

        Citoyen citoyen3 = new Citoyen();
        citoyen3.setPrenom("Ahmed");
        citoyen3.setNom("Trabelsi");
        citoyen3.setAdresse("Tunis");
        citoyen3.setRole(com.projetJEE.projetJEE.entities.Citoyen.RoleUtilisateur.CITOYEN);
        citoyen3.setEmail("ahmed.trabelsi@email.com");
        citoyen3.setPassword("passAhmed123");
        citoyenRepository.save(citoyen3);
        System.out.println("✔ Citoyen ajouté : " + citoyen3.getId());

        // ----- INCIDENTS -----
        Incident incident1 = new Incident();
        incident1.setDescription("Conteneur plein à Sfax");
        incident1.setStatut(Incident.StatutIncident.EN_ATTENTE);
        incident1.setCategorie(Incident.CategorieIncident.CONTENEUR);
        incident1.setDate(new Date());
        incident1.setUtilisateurId(citoyen1.getId());
        incidentRepository.save(incident1);
        System.out.println("✔ Incident ajouté pour " + citoyen1.getPrenom());

        Incident incident2 = new Incident();
        incident2.setDescription("Retard collecte à sfax");
        incident2.setStatut(Incident.StatutIncident.EN_ATTENTE);
        incident2.setCategorie(Incident.CategorieIncident.RETARD);
        incident2.setDate(new Date());
        incident2.setUtilisateurId(citoyen2.getId());
        incidentRepository.save(incident2);
        System.out.println("✔ Incident ajouté pour " + citoyen2.getPrenom());

        Incident incident3 = new Incident();
        incident3.setDescription("Panne véhicule à Sfax");
        incident3.setStatut(Incident.StatutIncident.EN_ATTENTE);
        incident3.setCategorie(Incident.CategorieIncident.PANNE_VEHICULE);
        incident3.setDate(new Date());
        incident3.setUtilisateurId(citoyen3.getId());
        incidentRepository.save(incident3);
        System.out.println("✔ Incident ajouté pour " + citoyen3.getPrenom());

        System.out.println("===== INITIALISATION TERMINÉE =====\n");
    }
}
