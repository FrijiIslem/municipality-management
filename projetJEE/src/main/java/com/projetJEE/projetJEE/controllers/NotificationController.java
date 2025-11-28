package com.projetJEE.projetJEE.controllers;


import com.projetJEE.projetJEE.dto.NotificationDto;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;
import com.projetJEE.projetJEE.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Créer une notification
    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationDto notificationDto) {
        NotificationDto created = notificationService.createNotification(notificationDto);
        return ResponseEntity.ok(created);
    }

    // Lister toutes les notifications
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    // Notifications par destination (agent)
    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByDestination(@PathVariable String destination) {
        return ResponseEntity.ok(notificationService.getNotificationsByDestination(destination));
    }

    // Notifications par type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByType(@PathVariable String type) {
        return ResponseEntity.ok(notificationService.getNotificationsByType(TypeNotification.valueOf(type)));
    }
}
