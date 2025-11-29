package com.projetJEE.projetJEE.config;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class DatabaseMigration {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            // Use mongoTemplate to get the collection
            MongoCollection<Document> tournees = mongoTemplate.getCollection("tournees");

            // Update all tournees that don't have the agentChauffeur field
            tournees.updateMany(
                Filters.exists("agentChauffeur", false),
                Updates.set("agentChauffeur", null)
            );
            
            System.out.println("Database migration completed: Added agentChauffeur field to tournees collection");
        };
    }
}