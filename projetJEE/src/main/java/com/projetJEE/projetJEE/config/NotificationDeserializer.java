package com.projetJEE.projetJEE.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.projetJEE.projetJEE.entities.Notification;
import com.projetJEE.projetJEE.entities.enums.TypeNotification;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class NotificationDeserializer extends JsonDeserializer<Notification> {
    @Override
    public Notification deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        
        Notification notification = new Notification();
        
        if (node.has("id")) {
            notification.setId(node.get("id").asText());
        }
        if (node.has("dateEnvoi")) {
            try {
                String dateStr = node.get("dateEnvoi").asText();
                notification.setDateEnvoi(LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME));
            } catch (Exception e) {
                // Ignorer si la date est invalide
            }
        }
        if (node.has("destination")) {
            notification.setDestination(node.get("destination").asText());
        }
        if (node.has("message")) {
            notification.setMessage(node.get("message").asText());
        }
        if (node.has("type")) {
            try {
                notification.setType(TypeNotification.valueOf(node.get("type").asText()));
            } catch (Exception e) {
                // Ignorer si le type est invalide
            }
        }
        
        return notification;
    }
}
