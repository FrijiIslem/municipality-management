package com.projetJEE.projetJEE.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.services.UtilisateurServiceInterface;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UtilisateurController.class)
public class AgentCreationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UtilisateurServiceInterface utilisateurService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateAgentWithValidData() throws Exception {
        // Create test agent
        Agent testAgent = new Agent();
        testAgent.setEmail("test.agent@example.com");
        testAgent.setNom("Agent");
        testAgent.setPrenom("Test");
        testAgent.setPassword("password123");
        testAgent.setNumeroTel(1234567890L);
        testAgent.setDisponibilite(true);
        testAgent.setPlageHoraire("9h-17h");
        testAgent.setTache(Agent.TypeTache.COLLECTE);

        when(utilisateurService.ajouterAgent(any(Agent.class))).thenReturn(testAgent);

        // Test JSON payload
        String agentJson = "{\"email\":\"test.agent@example.com\",\"nom\":\"Agent\",\"prenom\":\"Test\",\"password\":\"password123\",\"numeroTel\":1234567890,\"disponibilite\":true,\"plageHoraire\":\"9h-17h\",\"tache\":\"COLLECTE\"}";

        mockMvc.perform(post("/api/utilisateurs/agents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(agentJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test.agent@example.com"))
                .andExpect(jsonPath("$.nom").value("Agent"))
                .andExpect(jsonPath("$.prenom").value("Test"));
    }

    @Test
    public void testCreateAgentWithMissingFields() throws Exception {
        // Test with missing required fields
        String invalidJson = "{\"email\":\"\",\"nom\":\"\",\"prenom\":\"\",\"password\":\"\"}";

        mockMvc.perform(post("/api/utilisateurs/agents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}
