package com.projetJEE.projetJEE.config;

import com.projetJEE.projetJEE.entities.*;
import com.projetJEE.projetJEE.entities.enums.*;
import com.projetJEE.projetJEE.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Profile("!test") // Ne s'exécute pas pendant les tests
public class DataInitializer implements CommandLineRunner {

    private final ConteneurRepository conteneurRepository;
    private final VehiculeRepository vehiculeRepository;
    private final TourneeRepository tourneeRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 Démarrage de l'initialisation des données...");
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

