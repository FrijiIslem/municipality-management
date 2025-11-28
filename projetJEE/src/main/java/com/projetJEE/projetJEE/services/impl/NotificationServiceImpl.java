package com.projetJEE.projetJEE.services.impl;  // ✅ Package corrigé

import java.util.List;

import org.springframework.stereotype.Service;

import com.projetJEE.projetJEE.dto.NotificationDto;
import com.projetJEE.projetJEE.entities.Notification;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;
import com.projetJEE.projetJEE.mapper.NotificationMapper;  // ✅ NotificationMapper !
import com.projetJEE.projetJEE.repository.NotificationRepository;
import com.projetJEE.projetJEE.services.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;  // ✅ NotificationMapper

    public NotificationServiceImpl(NotificationRepository notificationRepository, 
                                   NotificationMapper notificationMapper) {  // ✅ NotificationMapper
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public NotificationDto createNotification(NotificationDto dto) {
        Notification entity = notificationMapper.toEntity(dto);  // ✅ notificationMapper
        Notification saved = notificationRepository.save(entity);
        return notificationMapper.toDto(saved);  // ✅ notificationMapper.toDto()
    }

    @Override
    public List<NotificationDto> getAllNotifications() {
        return notificationMapper.toDtoList(notificationRepository.findAll());  // ✅ toDtoList()
    }

    @Override
    public List<NotificationDto> getNotificationsByDestination(String destination) {
        return notificationMapper.toDtoList(  // ✅ toDtoList()
            notificationRepository.findByDestination(destination)
        );
    }
    @Override
    public List<NotificationDto> getNotificationsByType(TypeNotification type) {
        return notificationMapper.toDtoList(
            notificationRepository.findByType(type)
        );
    }

}
