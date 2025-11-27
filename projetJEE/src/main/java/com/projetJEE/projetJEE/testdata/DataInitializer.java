package com.projetJEE.projetJEE.testdata;

import com.projetJEE.projetJEE.entity.*;
import com.projetJEE.projetJEE.entity.enums.*;
import com.projetJEE.projetJEE.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class DataInitializer implements CommandLineRunner {

    private final ConteneurRepository conteneurRepository;
    private final DechetsRepository dechetsRepository;
    private final VehiculeRepository vehiculeRepository;

    public DataInitializer(ConteneurRepository conteneurRepository,
                           DechetsRepository dechetsRepository,
                           VehiculeRepository vehiculeRepository) {
        this.conteneurRepository = conteneurRepository;
        this.dechetsRepository = dechetsRepository;
        this.vehiculeRepository = vehiculeRepository;
    }

    @Override
    public void run(String... args) {

        // Create and save a Dechets
        Dechets d = Dechets.builder()
                .type(TypeDechets.plastique)
                .build();
        d = dechetsRepository.save(d);
        System.out.println("Dechets saved with id: " + d.getId());
        // Create and save a Conteneur
        Conteneur c = Conteneur.builder()
                .localisation("Centre-ville")
                .couleurStatut(CouleurStatut.vert)
                .etatRemplissage(EtatRemplissage.vide)
                .typeDechets(d)
                .build();
        conteneurRepository.save(c);
        System.out.println("Conteneur saved with id: " + c.getId());

        // Create and save a Vehicule
        Vehicule v = Vehicule.builder()
                .matricule(12345L)
                .capaciteMax(500)
                .disponibilite(true)
                .build();
        vehiculeRepository.save(v);
        System.out.println("Vehicule saved with id: " + v.getId());

        System.out.println("📌 Données insérées avec succès → Collections créées automatiquement !");
    }
}

