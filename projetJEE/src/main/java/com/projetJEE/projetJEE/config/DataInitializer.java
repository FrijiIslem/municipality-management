package com.projetJEE.projetJEE.config;

import com.projetJEE.projetJEE.entities.*;
import com.projetJEE.projetJEE.entities.enums.*;
import com.projetJEE.projetJEE.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Profile("!test") // Ne s'exécute pas pendant les tests
public class DataInitializer implements CommandLineRunner {

    private final ConteneurRepository conteneurRepository;
    private final VehiculeRepository vehiculeRepository;
    private final TourneeRepository tourneeRepository;
    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 Démarrage de l'initialisation des données...");
        
        // Créer un compte admin par défaut s'il n'existe pas
        List<Utilisateur> admins = utilisateurRepository.findByRole(Utilisateur.RoleUtilisateur.ADMIN);
        if (admins.isEmpty()) {
            Utilisateur admin = new Utilisateur();
            admin.setEmail("admin@urbanova.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Mot de passe hashé avec BCrypt
            admin.setNom("Admin");
            admin.setPrenom("Urbanova");
            admin.setRole(Utilisateur.RoleUtilisateur.ADMIN);
            utilisateurRepository.save(admin);
            System.out.println("✅ Compte admin créé :");
            System.out.println("   📧 Email: admin@urbanova.com");
            System.out.println("   🔑 Mot de passe: admin123");
        } else {
            System.out.println("ℹ️ Un compte admin existe déjà.");
        }
        
        // Initialiser les conteneurs s'il n'y en a pas
        if (conteneurRepository.count() == 0) {
            Conteneur conteneur1 = new Conteneur();
            conteneur1.setLocalisation("Avenue Habib Bourguiba, Tunis");
            conteneur1.setEtatRemplissage(EtatRemplissage.vide);
            conteneur1.setCouleurStatut(CouleurStatut.vert);
            conteneurRepository.save(conteneur1);
        }

        // Initialiser les véhicules s'il n'y en a pas
        if (vehiculeRepository.count() == 0) {
            Vehicule vehicule1 = new Vehicule();
            vehicule1.setMatricule((long) 1234);
            vehicule1.setCapaciteMax(5000);
            vehicule1.setDisponibilite(true);
            vehiculeRepository.save(vehicule1);
        }

        // Initialiser les tournées s'il n'y en a pas
        if (tourneeRepository.count() == 0) {
            Tournee tournee1 = Tournee.builder()
                    .dateDebut(LocalDateTime.now().plusDays(1))
                    .dateFin(LocalDateTime.now().plusDays(1).plusHours(4))
                    .etat(EtatTournee.PLANIFIEE)
                    .build();

            Tournee tournee2 = Tournee.builder()
                    .dateDebut(LocalDateTime.now().plusDays(2))
                    .dateFin(LocalDateTime.now().plusDays(2).plusHours(6))
                    .etat(EtatTournee.PLANIFIEE)
                    .build();

            tourneeRepository.saveAll(Arrays.asList(tournee1, tournee2));
        }

        // Initialiser les notifications s'il n'y en a pas
        if (notificationRepository.count() == 0) {
            Notification notif1 = Notification.builder()
                    .dateEnvoi(LocalDateTime.now())
                    .destination("agent1@example.com")
                    .message("Nouvelle tournée planifiée pour demain")
                    .type(TypeNotification.ALERT)
                    .build();

            Notification notif2 = Notification.builder()
                    .dateEnvoi(LocalDateTime.now().minusHours(1))
                    .destination("agent2@example.com")
                    .message("Rappel : Tournée dans 2 jours")
                    .type(TypeNotification.REMINDER)
                    .build();

            notificationRepository.saveAll(Arrays.asList(notif1, notif2));
            
            System.out.println("✅ Données de test initialisées avec succès !");
        } else {
            System.out.println("ℹ️ Des données existent déjà, pas d'initialisation nécessaire.");
            System.out.println("   - Nombre de notifications : " + notificationRepository.count());
            System.out.println("   - Nombre de tournées : " + tourneeRepository.count());
        }
    }
}

