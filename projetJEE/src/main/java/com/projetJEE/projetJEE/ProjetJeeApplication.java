package com.projetJEE.projetJEE;

import org.springframework.boot.SpringApplication;	
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class ProjetJeeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjetJeeApplication.class, args);
    }
}
