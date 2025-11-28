package com.projetJEE.projetJEE.dto;
import com.projetJEE.projetJEE.entities.Incident.CategorieIncident;
import com.projetJEE.projetJEE.entities.Incident.StatutIncident;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentDTO {

    private String id; // utile pour le front (GET, PUT, DELETE)
    
    private CategorieIncident categorie;
    private Date date;
    private String description;
    private StatutIncident statut;

    // On garde l'ID de l'utilisateur pour la relation Many-to-One
    private String utilisateurId;
}
