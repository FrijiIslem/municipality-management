package com.projetJEE.projetJEE.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.projetJEE.projetJEE.entities.Citoyen;
import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;

import java.io.IOException;

public class CitoyenDeserializer extends JsonDeserializer<Citoyen> {
    @Override
    public Citoyen deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        
        Citoyen citoyen = new Citoyen();
        
        // Désérialiser les champs de Utilisateur
        if (node.has("id")) {
            citoyen.setId(node.get("id").asText());
        }
        if (node.has("email")) {
            citoyen.setEmail(node.get("email").asText());
        }
        if (node.has("nom")) {
            citoyen.setNom(node.get("nom").asText());
        }
        if (node.has("prenom")) {
            citoyen.setPrenom(node.get("prenom").asText());
        }
        if (node.has("password")) {
            citoyen.setPassword(node.get("password").asText());
        }
        if (node.has("numeroTel")) {
            citoyen.setNumeroTel(node.get("numeroTel").asLong());
        }
        if (node.has("role")) {
            try {
                citoyen.setRole(RoleUtilisateur.valueOf(node.get("role").asText()));
            } catch (Exception e) {
                citoyen.setRole(RoleUtilisateur.CITOYEN);
            }
        }
        
        // Désérialiser les champs spécifiques à Citoyen
        if (node.has("adresse")) {
            citoyen.setAdresse(node.get("adresse").asText());
        }
        
        return citoyen;
    }
}
