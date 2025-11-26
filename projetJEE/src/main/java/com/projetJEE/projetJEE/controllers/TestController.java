package com.projetJEE.projetJEE.controllers;

import com.projetJEE.projetJEE.entities.Notification;
import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.enums.EtatTournee;
import com.projetJEE.projetJEE.enums.TypeNotification;
import com.projetJEE.projetJEE.repositories.TourneeRepository;
import com.projetJEE.projetJEE.repositories.NotificationRepository;  // ← MANQUANT !
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @Autowired private TourneeRepository tourneeRepository;
    @Autowired private NotificationRepository notificationRepository;  // ← MANQUANT !
    
    @GetMapping("/health")
    public String health() {
        return "✅ MongoDB OK ! Tournees: " + tourneeRepository.count() + 
               " | Notifications: " + notificationRepository.count();
    }
    
    @PostMapping("/tournee")
    public String createTournee() {
        Tournee t = new Tournee();
        t.setId("T001");
        t.setConteneur(Arrays.asList("C1", "C5"));
        t.setAgent("A1");
        t.setEtat(EtatTournee.PLANIFIEE);
        t.setItineraire("C5→C1 GPS");
        t.setVehicule("V1");
        t.setDateDebut(LocalDateTime.now());
        tourneeRepository.save(t);
        return "✅ T001 PLANIFIEE ! Total: " + tourneeRepository.count();
    }

    @PostMapping("/notification")
    public String createNotification() {
        Notification n = new Notification();
        n.setId("N001");
        n.setDateEnvoi(LocalDateTime.now());
        n.setDestination("A1");
        n.setMessage("Préparez tournée T001");
        n.setType(TypeNotification.REMINDER);
        notificationRepository.save(n);  // ← MAINTENANT OK !
        return "✅ Notification REMINDER ! Total: " + notificationRepository.count();
    }

    @GetMapping("/tournees")
    public List<Tournee> getTournees() {
        return tourneeRepository.findAll();
    }
    
    @GetMapping("/notifications")
    public List<Notification> getNotifications() {
        return notificationRepository.findAll();
    }
}
