# Debug : Endpoint /api/tournees/{id}/route retourne 404

## Problème
L'endpoint retourne une erreur 404 avec le message "No static resource", ce qui signifie que Spring Boot ne trouve pas l'endpoint et essaie de le traiter comme une ressource statique.

## Étapes de débogage

### 1. Vérifier que le backend a été recompilé

**IMPORTANT** : Après avoir ajouté/modifié du code Java, vous DEVEZ recompiler le projet.

```bash
cd projetJEE
mvnw.cmd clean compile
```

### 2. Vérifier les logs au démarrage

Quand le backend démarre, cherchez dans les logs :

**✅ Si vous voyez cette ligne, l'endpoint est enregistré :**
```
Mapped "{[/api/tournees/{id}/route],methods=[GET]}"
```

**❌ Si vous ne voyez PAS cette ligne, l'endpoint n'est pas chargé.**

### 3. Vérifier les erreurs de compilation

Cherchez dans les logs au démarrage des erreurs comme :
- `Error creating bean`
- `Failed to instantiate`
- `NoSuchBeanDefinitionException`

### 4. Tester l'endpoint de test

J'ai ajouté un endpoint de test simple. Testez-le :

```
http://localhost:9090/api/tournees/test-route
```

**Si cet endpoint fonctionne** : Le contrôleur est chargé, mais il y a un problème avec l'endpoint spécifique.

**Si cet endpoint ne fonctionne pas** : Le contrôleur n'est pas chargé du tout.

### 5. Vérifier que le service StreetRoutingService est bien créé

Dans les logs au démarrage, cherchez :
```
Creating shared instance of singleton bean 'streetRoutingService'
```

Si vous voyez une erreur liée à `streetRoutingService`, il y a un problème avec l'injection de dépendances.

### 6. Vérifier la structure des packages

Assurez-vous que :
- `TourneeController` est dans `com.projetJEE.projetJEE.controllers`
- `StreetRoutingService` est dans `com.projetJEE.projetJEE.services`
- `ProjetJeeApplication` est dans `com.projetJEE.projetJEE`

Spring Boot scanne automatiquement tous les packages sous `com.projetJEE.projetJEE`.

## Solution rapide

1. **Arrêter le backend** (Ctrl+C)

2. **Nettoyer et recompiler** :
```bash
cd projetJEE
mvnw.cmd clean
mvnw.cmd compile
```

3. **Vérifier qu'il n'y a pas d'erreurs de compilation**

4. **Redémarrer le backend** :
```bash
mvnw.cmd spring-boot:run
```

5. **Vérifier les logs** pour voir si l'endpoint est enregistré

6. **Tester l'endpoint de test** :
```
http://localhost:9090/api/tournees/test-route
```

7. **Tester l'endpoint réel** :
```
http://localhost:9090/api/tournees/693a08a9e2a8186e8936962b/route
```

## Causes possibles

1. **Backend pas recompilé** : Le code modifié n'a pas été compilé
2. **Erreur de compilation** : Une erreur empêche le contrôleur de se charger
3. **Problème d'injection** : Le service `StreetRoutingService` ne peut pas être instancié
4. **Ordre des mappings** : L'endpoint `/{id}` capture la requête avant `/{id}/route` (mais on l'a déjà corrigé)

## Vérification manuelle

Ouvrez le fichier compilé :
```
projetJEE/target/classes/com/projetJEE/projetJEE/controllers/TourneeController.class
```

Si ce fichier n'existe pas ou est ancien, le projet n'a pas été recompilé.

