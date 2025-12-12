# Solution : Affichage du chemin suivant les rues réelles

## Problème
L'endpoint `/api/tournees/{id}/route` retourne une erreur 404, et le chemin affiché sur la carte est une ligne droite au lieu de suivre les rues réelles.

## Cause
Le backend Spring Boot n'a pas été redémarré après l'ajout du nouvel endpoint et du service `StreetRoutingService`.

## Solution

### Étape 1 : Arrêter le backend
Si le backend est en cours d'exécution, arrêtez-le avec `Ctrl+C` dans le terminal.

### Étape 2 : Redémarrer le backend
Utilisez l'un des scripts suivants :

**Option A - Redémarrage complet (recommandé) :**
```bash
restart-backend.bat
```

**Option B - Démarrage simple :**
```bash
start-backend-java21.bat
```

### Étape 3 : Vérifier que l'endpoint est enregistré
Dans les logs du backend au démarrage, cherchez une ligne similaire à :
```
Mapped "{[/api/tournees/{id}/route],methods=[GET]}"
```

Si cette ligne n'apparaît pas, il y a un problème de compilation ou de configuration.

### Étape 4 : Tester l'endpoint
Une fois le backend démarré, testez l'endpoint :

**Option A - Avec le script de test :**
```bash
test-route-endpoint.bat
```

**Option B - Dans le navigateur :**
```
http://localhost:9090/api/tournees/693a08a9e2a8186e8936962b/route
```
(Remplacez l'ID par un ID de tournée valide)

**Option C - Avec curl :**
```bash
curl http://localhost:9090/api/tournees/693a08a9e2a8186e8936962b/route
```

### Étape 5 : Vérifier dans le frontend
1. Ouvrez la page de détail d'une tournée
2. Ouvrez la console du navigateur (F12)
3. Vérifiez qu'il n'y a plus d'erreur 404
4. La route sur la carte devrait maintenant suivre les rues réelles au lieu d'être une ligne droite

## Comment ça fonctionne

1. **Backend** : Le service `StreetRoutingService` utilise l'API OSRM (Open Source Routing Machine) pour calculer les routes réelles entre les conteneurs
2. **Endpoint** : `/api/tournees/{id}/route` retourne une liste de points `[lat, lng]` représentant la géométrie complète de la route
3. **Frontend** : Le composant `TourMap` affiche cette route avec une `Polyline` de Leaflet qui suit exactement les rues

## Dépannage

### Si l'endpoint retourne toujours 404 :
1. Vérifiez que le backend a bien été redémarré
2. Vérifiez les logs du backend pour des erreurs de compilation
3. Vérifiez que le service `StreetRoutingService` est bien dans le package scanné par Spring (`com.projetJEE.projetJEE.services`)

### Si la route est toujours une ligne droite :
1. Vérifiez dans la console du navigateur que l'endpoint retourne bien des données
2. Vérifiez que la réponse contient bien un tableau de points avec `lat` et `lng`
3. Vérifiez que `route.length > 0` dans le composant `TourMap`

### Si l'API OSRM ne répond pas :
Le service bascule automatiquement sur une ligne droite entre les points. C'est normal si :
- Vous êtes hors ligne
- L'API OSRM est temporairement indisponible
- Les coordonnées sont en dehors de la zone couverte par OSRM

## Notes importantes

- L'endpoint `/{id}/route` doit être défini **AVANT** `/{id}` dans le contrôleur pour éviter les conflits de mapping Spring Boot
- L'API OSRM est gratuite et basée sur OpenStreetMap
- Les routes sont calculées pour des véhicules (driving profile)

