package com.projetJEE.projetJEE.config;

import com.projetJEE.projetJEE.entities.Conteneur;
import com.projetJEE.projetJEE.entities.Vehicule;
import com.projetJEE.projetJEE.entities.enums.CouleurStatut;
import com.projetJEE.projetJEE.entities.enums.EtatRemplissage;
import com.projetJEE.projetJEE.repository.ConteneurRepository;
import com.projetJEE.projetJEE.repository.VehiculeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ConteneurRepository conteneurRepository;
    private final VehiculeRepository vehiculeRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialiser les conteneurs s'il n'y en a pas
        if (conteneurRepository.count() == 0) {
            Conteneur conteneur1 = new Conteneur();
            conteneur1.setLocalisation("Avenue Habib Bourguiba, Tunis");
            conteneur1.setEtatRemplissage(EtatRemplissage.vide);
            conteneur1.setCouleurStatut(CouleurStatut.vert);
            conteneurRepository.save(conteneur1);
        }

        // Initialiser les véhicules s'il n'y en a pas
        if (vehiculeRepository.count() == 0) {
            Vehicule vehicule1 = new Vehicule();
            vehicule1.setMatricule((long) 1234);
            vehicule1.setCapaciteMax(5000);
            vehicule1.setDisponibilite(true);
            vehiculeRepository.save(vehicule1);
        }
    }
}
