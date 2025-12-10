package com.projetJEE.projetJEE.config;

import com.projetJEE.projetJEE.services.AutomaticPlanningService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Scheduler pour la planification automatique des tournées
 * Déclenche la planification chaque jour à 6h du matin
 */
@Component
public class ScheduledTasks {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    @Autowired
    private AutomaticPlanningService automaticPlanningService;

    /**
     * Planifie automatiquement les tournées chaque jour à 6h du matin
     * Format cron: seconde minute heure jour mois jour-semaine
     * 0 0 6 * * ? = Tous les jours à 6h00:00
     */
    @Scheduled(cron = "0 0 6 * * ?")
    public void planifyDailyTournees() {
        logger.info("⏰ Déclenchement de la planification automatique à {}", LocalDateTime.now());
        
        try {
            automaticPlanningService.planifyDailyTournees();
            logger.info("✅ Planification automatique terminée avec succès");
        } catch (Exception e) {
            logger.error("❌ Erreur lors de la planification automatique", e);
        }
    }
}

