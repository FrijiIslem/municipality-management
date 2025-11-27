package com.projetJEE.projetJEE.services;
import com.projetJEE.projetJEE.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    NotificationDto createNotification(NotificationDto dto);
    List<NotificationDto> getAllNotifications();
    List<NotificationDto> getNotificationsByDestination(String destination);
}
