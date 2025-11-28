package com.projetJEE.projetJEE.config;

import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.entities.Notification;
import com.projetJEE.projetJEE.entities.enums.EtatTournee;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;
import com.projetJEE.projetJEE.repository.TourneeRepository;
import com.projetJEE.projetJEE.repository.NotificationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TourneeRepository tourneeRepository;
    private final NotificationRepository notificationRepository;

    public DataInitializer(TourneeRepository tourneeRepository,
                          NotificationRepository notificationRepository) {
        this.tourneeRepository = tourneeRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("🚀 === DATA INITIALIZER START ===");
        
        // CLEAR existing data
        tourneeRepository.deleteAll();
        notificationRepository.deleteAll();
        System.out.println("🧹 Collections vidées");
		Conteneur c1 = null;
		Conteneur c5 = null;
		Agent A1 = null;
		Vehicule V1 = null;
        // 1. CREATE Tournee T001
        Tournee t = Tournee.builder()
                .id("T001")
                .conteneur(Arrays.asList(c1, c5))
                .agent(A1)
                .etat(EtatTournee.PLANIFIEE)
                .itineraire("C5→C1 GPS")
                .vehicule(V1)
                .dateDebut(LocalDateTime.now())
                .build();
        t = tourneeRepository.save(t);
        System.out.println("✅ Tournee saved with id: " + t.getId());

        // 2. CREATE Notification N001
        Notification n = Notification.builder()
                .id("N001")
                .dateEnvoi(LocalDateTime.now())
                .destination("A1")
                .message("Préparez tournée T001 - PLANIFIEE")
                .type(TypeNotification.REMINDER)
                .build();
        n = notificationRepository.save(n);
        System.out.println("✅ Notification saved with id: " + n.getId());

        System.out.println("📌 Données insérées avec succès → Collections créées automatiquement !");
        System.out.println("🎉 Total Tournees: " + tourneeRepository.count() + " | Notifications: " + notificationRepository.count());
    }
}
