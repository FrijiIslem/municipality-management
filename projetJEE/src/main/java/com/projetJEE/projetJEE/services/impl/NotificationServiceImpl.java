package com.projetJEE.projetJEE.services.impl;

import com.projetJEE.projetJEE.dto.NotificationDto;
import com.projetJEE.projetJEE.mapper.TourneeMapper;
import com.projetJEE.projetJEE.repositories.NotificationRepository;
import com.projetJEE.projetJEE.services.NotificationService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final TourneeMapper tourneeMapper;

    public NotificationServiceImpl(NotificationRepository notificationRepository, TourneeMapper tourneeMapper) {
        this.notificationRepository = notificationRepository;
        this.tourneeMapper = tourneeMapper;
    }

    @Override
    public NotificationDto createNotification(NotificationDto dto) {
        return tourneeMapper.toDto(notificationRepository.save(tourneeMapper.toEntity(dto)));
    }

    @Override
    public List<NotificationDto> getAllNotifications() {
        return tourneeMapper.toNotificationDtoList(notificationRepository.findAll());
    }

    @Override
    public List<NotificationDto> getNotificationsByDestination(String destination) {
        return tourneeMapper.toNotificationDtoList(
            notificationRepository.findByDestination(destination)
        );
    }
}
