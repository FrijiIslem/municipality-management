package com.projetJEE.projetJEE.dto;

import java.time.LocalDateTime;

import com.projetJEE.projetJEE.enums.TypeNotification;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class NotificationDto {
    private String id;
    private LocalDateTime dateEnvoi;
    private String destination;
    private String message;
    private TypeNotification type;
    private TourneeDto tournee;  // Lien vers Tournee
}
