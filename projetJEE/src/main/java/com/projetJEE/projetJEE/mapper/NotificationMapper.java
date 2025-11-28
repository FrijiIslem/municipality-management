package com.projetJEE.projetJEE.mapper;


import com.projetJEE.projetJEE.dto.NotificationDto;
import com.projetJEE.projetJEE.entities.Notification;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification n) {
        if (n == null) return null;
        return NotificationDto.builder()
                .id(n.getId())
                .dateEnvoi(n.getDateEnvoi())
                .destination(n.getDestination())
                .message(n.getMessage())
                .type(n.getType())
                .build();
    }

    public Notification toEntity(NotificationDto dto) {
        if (dto == null) return null;
        return Notification.builder()
                .id(dto.getId())
                .dateEnvoi(dto.getDateEnvoi())
                .destination(dto.getDestination())
                .message(dto.getMessage())
                .type(dto.getType())
                .build();
    }

    public List<NotificationDto> toDtoList(List<Notification> list) {
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }
}
