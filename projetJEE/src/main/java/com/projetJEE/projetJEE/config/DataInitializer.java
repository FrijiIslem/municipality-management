package com.projetJEE.projetJEE.config;

import com.projetJEE.projetJEE.entities.Agent;
import com.projetJEE.projetJEE.entities.Tournee;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.repository.AgentRepository;
import com.projetJEE.projetJEE.repository.TourneeRepository;
import com.projetJEE.projetJEE.repository.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Optional;

@Configuration
public class DataInitializer {

    @Autowired
    private AgentRepository agentRepository;
    
    @Autowired
    private TourneeRepository tourneeRepository;
    
    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Bean
    public CommandLineRunner assignAgentAndVehicleToTournee() {
        return args -> {
            System.out.println("🚀 === DATA INITIALIZER START ===");
            
            // Find the agent by ID
            String agentId = "692b378b040f3c3b04883cd5";
            Optional<Agent> agentOpt = agentRepository.findById(agentId);
            
            // Find an available vehicle
            List<Vehicule> availableVehicles = vehiculeRepository.findByDisponibilite(true);
            
            if (agentOpt.isPresent() && !availableVehicles.isEmpty()) {
                Agent agent = agentOpt.get();
                Vehicule vehicle = availableVehicles.get(0); // Get the first available vehicle
                
                // Find the tournee by ID
                Optional<Tournee> tourneeOpt = tourneeRepository.findById("T001");
                
                if (tourneeOpt.isPresent()) {
                    Tournee tournee = tourneeOpt.get();
                    tournee.setAgentChauffeur(agent);
                    tournee.setVehicule(vehicle); // Assign the vehicle
                    tourneeRepository.save(tournee);
                    
                    System.out.println("✅ Successfully assigned:");
                    System.out.println("   Agent: " + agent.getNom() + " (" + agent.getEmail() + ")");
                    System.out.println("   Vehicle: " + vehicle.getMatricule());
                    System.out.println("   to tournee T001");
                } else {
                    System.out.println("❌ Tournee T001 not found");
                }
            } else {
                if (!agentOpt.isPresent()) {
                    System.out.println("❌ Agent with ID " + agentId + " not found");
                }
                if (availableVehicles.isEmpty()) {
                    System.out.println("❌ No available vehicles found");
                }
            }
        };
    }
}