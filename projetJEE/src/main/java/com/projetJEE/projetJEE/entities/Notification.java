package com.projetJEE.projetJEE.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id private String id;
    private LocalDateTime dateEnvoi;
    private String destination;
    private String message;
    private TypeNotification type;
}
