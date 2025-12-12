package com.projetJEE.projetJEE.repository;

import com.projetJEE.projetJEE.entities.Notification;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // trouver toutes les notifications pour une destination (id agent, email, etc.)
    List<Notification> findByDestination(String destination);

    // trouver par type (alert, reminder, succes...)
    List<Notification> findByType(TypeNotification type);
}
