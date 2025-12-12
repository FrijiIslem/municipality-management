package com.projetJEE.projetJEE.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Utilisateur.RoleUtilisateur;

import java.io.IOException;

public class AgentDeserializer extends JsonDeserializer<Agent> {
    @Override
    public Agent deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        
        Agent agent = new Agent();
        
        // Désérialiser les champs de Utilisateur
        if (node.has("id")) {
            agent.setId(node.get("id").asText());
        }
        if (node.has("email")) {
            agent.setEmail(node.get("email").asText());
        }
        if (node.has("nom")) {
            agent.setNom(node.get("nom").asText());
        }
        if (node.has("prenom")) {
            agent.setPrenom(node.get("prenom").asText());
        }
        if (node.has("password")) {
            agent.setPassword(node.get("password").asText());
        }
        if (node.has("numeroTel")) {
            agent.setNumeroTel(node.get("numeroTel").asLong());
        }
        if (node.has("role")) {
            try {
                agent.setRole(RoleUtilisateur.valueOf(node.get("role").asText()));
            } catch (Exception e) {
                agent.setRole(RoleUtilisateur.AGENT);
            }
        }
        
        // Désérialiser les champs spécifiques à Agent
        if (node.has("disponibilite")) {
            agent.setDisponibilite(node.get("disponibilite").asBoolean());
        }
        if (node.has("plageHoraire")) {
            agent.setPlageHoraire(node.get("plageHoraire").asText());
        }
        if (node.has("tache")) {
            try {
                agent.setTache(Agent.TypeTache.valueOf(node.get("tache").asText()));
            } catch (Exception e) {
                // Ignorer si la tâche est invalide
            }
        }
        
        return agent;
    }
}
