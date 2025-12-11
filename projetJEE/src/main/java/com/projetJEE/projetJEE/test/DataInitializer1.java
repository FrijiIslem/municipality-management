package com.projetJEE.projetJEE.test;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Incident;
import com.projetJEE.projetJEE.entities.Utilisateur;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.repository.IncidentRepository;
import com.projetJEE.projetJEE.repository.UtilisateurRepository;
import com.projetJEE.projetJEE.repository.VehiculeRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer1 implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final IncidentRepository incidentRepository;
    
    private final VehiculeRepository vehiculeRepository;

  

    public DataInitializer1(UtilisateurRepository utilisateurRepository,
                            IncidentRepository incidentRepository , VehiculeRepository vehiculeRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.incidentRepository = incidentRepository;
		this.vehiculeRepository = vehiculeRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("\n===== INSERTION DE NOUVELLES DONNÉES =====");

		/*
		 * // ----- NOUVEAUX AGENTS ----- Agent agent3 = new Agent();
		 * agent3.setPrenom("Mohamed"); agent3.setNom("Trabelsi");
		 * agent3.setDisponibilite(true); agent3.setPlageHoraire("7h-15h");
		 * agent3.setTache(Agent.TypeTache.COLLECTE);
		 * agent3.setRole(Utilisateur.RoleUtilisateur.AGENT);
		 * agent3.setEmail("mohamed.trabelsi@email.com");
		 * agent3.setPassword("passMohamed123");
		 * 
		 * utilisateurRepository.save(agent3);
		 * System.out.println("✔ Nouvel agent ajouté : " + agent3.getId());
		 * 
		 * Agent agent = new Agent(); agent3.setPrenom("nour");
		 * agent3.setNom("Mesallmeni"); agent3.setDisponibilite(true);
		 * agent3.setPlageHoraire("7h-15h"); agent3.setTache(Agent.TypeTache.CHAUFFEUR);
		 * agent3.setRole(Utilisateur.RoleUtilisateur.AGENT);
		 * agent3.setEmail("nour@email.com"); agent3.setPassword("nour123");
		 * 
		 * utilisateurRepository.save(agent);
		 * System.out.println("✔ Nouvel agent ajouté pp : " + agent.getId());
		 * 
		 * // ----- NOUVEAUX CITOYENS ----- Citoyen citoyen4 = new Citoyen();
		 * citoyen4.setPrenom("Amina"); citoyen4.setNom("Haddad");
		 * citoyen4.setAdresse("Monastir");
		 * citoyen4.setRole(Utilisateur.RoleUtilisateur.CITOYEN);
		 * citoyen4.setEmail("amina.haddad@email.com");
		 * citoyen4.setPassword("passAmina123");
		 * 
		 * utilisateurRepository.save(citoyen4);
		 * System.out.println("✔ Nouveau citoyen ajouté : " + citoyen4.getId());
		 * 
		 * // ----- NOUVEAUX INCIDENTS ----- Incident incident4 = new Incident();
		 * incident4.setDescription("Conteneur débordant à Monastir");
		 * incident4.setStatut(Incident.StatutIncident.EN_ATTENTE);
		 * incident4.setCategorie(Incident.CategorieIncident.CONTENEUR);
		 * incident4.setDate(new Date()); incident4.setUtilisateurId(citoyen4.getId());
		 * 
		 * incidentRepository.save(incident4);
		 * System.out.println("✔ Nouvel incident ajouté pour : " +
		 * citoyen4.getPrenom());
		 */
       
            System.out.println("\n===== INSERTION DE NOUVELLES DONNÉES =====");

            // ----- VEHICULES -----
            // Si tu as une entité VehiculeRepository, tu peux l'utiliser comme ceci :
            // VehiculeRepository vehiculeRepository;
            
            Vehicule v1 = Vehicule.builder()
                .matricule(1001L)
                .capaciteMax(300)
                .disponibilite(true)
                .build();
            
            Vehicule v2 = Vehicule.builder()
                .matricule(1002L)
                .capaciteMax(250)
                .disponibilite(true)
                .build();
                
            Vehicule v3 = Vehicule.builder()
                .id("v3")
                .matricule(1003L)
                .capaciteMax(400)
                .disponibilite(true)
                .build();
                
            Vehicule v4 = Vehicule.builder()
                .id("v4")
                .matricule(1004L)
                .capaciteMax(350)
                .disponibilite(true)
                .build();
                
            Vehicule v5 = Vehicule.builder()
                .id("v5")
                .matricule(1005L)
                .capaciteMax(280)
                .disponibilite(true)
                .build();

            vehiculeRepository.save(v1);
            vehiculeRepository.save(v2);
            vehiculeRepository.save(v3);
            vehiculeRepository.save(v4);
            vehiculeRepository.save(v5);

            System.out.println("✔ 5 véhicules ajoutés");
            

            // ----- UTILISATEURS -----

            // Agents Collecte
            for (int i = 1; i <= 15; i++) {
                Agent agent = new Agent();
                agent.setPrenom("Agent" + i);
                agent.setNom("Nom" + i);
                agent.setDisponibilite(true);
                agent.setPlageHoraire("08:00-16:00");
                agent.setTache(Agent.TypeTache.COLLECTE);
                agent.setRole(Utilisateur.RoleUtilisateur.AGENT);
                agent.setEmail("agent" + i + "@mail.com");
                agent.setPassword("pass" + i);
                utilisateurRepository.save(agent);
                System.out.println("✔ Nouvel agent COLLECTE ajouté : " + agent.getId());
            }

            // Chauffeurs
            for (int i = 16; i <= 20; i++) {
                Agent chauffeur = new Agent();
                chauffeur.setPrenom("Chauffeur" + i);
                chauffeur.setNom("Nom" + i);
                chauffeur.setDisponibilite(true);
                chauffeur.setPlageHoraire("07:00-15:00");
                chauffeur.setTache(Agent.TypeTache.CHAUFFEUR);
                chauffeur.setRole(Utilisateur.RoleUtilisateur.AGENT);
                chauffeur.setEmail("chauffeur" + i + "@mail.com");
                chauffeur.setPassword("pass" + i);
                utilisateurRepository.save(chauffeur);
                System.out.println("✔ Nouvel agent CHAUFFEUR ajouté : " + chauffeur.getId());
            }

            // Citoyens
            for (int i = 21; i <= 30; i++) {
                Citoyen citoyen = new Citoyen();
                citoyen.setPrenom("Citoyen" + i);
                citoyen.setNom("Nom" + i);
                citoyen.setAdresse("Adresse" + i);
                citoyen.setRole(Utilisateur.RoleUtilisateur.CITOYEN);
                citoyen.setEmail("citoyen" + i + "@mail.com");
                citoyen.setPassword("pass" + i);
                utilisateurRepository.save(citoyen);
                System.out.println("✔ Nouveau citoyen ajouté : " + citoyen.getId());
            }

            System.out.println("===== INSERTION TERMINÉE =====\n");
        
    }
}
