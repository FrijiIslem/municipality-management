# 🔧 Résolution de l'erreur 405 - Method Not Allowed

## Problème
L'erreur `405 Method 'POST' is not supported` signifie que l'endpoint existe mais que Spring Boot n'a pas rechargé les nouveaux endpoints.

## Solution : Redémarrer le Backend

### Étape 1 : Arrêter le backend actuel
Dans le terminal où le backend tourne, appuyez sur `Ctrl+C` pour l'arrêter.

### Étape 2 : Recompiler et redémarrer

**Windows:**
```bash
cd projetJEE
.\mvnw.cmd clean
.\mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
cd projetJEE
./mvnw clean
./mvnw spring-boot:run
```

### Étape 3 : Vérifier que le backend est démarré
Attendez de voir dans la console :
```
Started ProjetJeeApplication in X.XXX seconds
```

### Étape 4 : Vérifier les endpoints disponibles
Une fois démarré, vous pouvez vérifier que l'endpoint est disponible en consultant les logs Spring Boot. Vous devriez voir :
```
Mapped "{[/api/tournees/planifier-automatique],methods=[POST]}"
```

## Alternative : Utiliser votre IDE

Si vous utilisez IntelliJ IDEA ou Eclipse :

1. **Arrêtez** l'application en cours
2. **Recompilez** le projet (Build > Rebuild Project)
3. **Relancez** l'application (Run > Run 'ProjetJeeApplication')

## Vérification

Pour tester si l'endpoint fonctionne, vous pouvez utiliser curl :

```bash
curl -X POST http://localhost:9090/api/tournees/planifier-automatique
```

Ou dans votre navigateur, ouvrez les DevTools (F12) et dans la console, testez :
```javascript
fetch('http://localhost:9090/api/tournees/planifier-automatique', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## Pourquoi cette erreur ?

Spring Boot charge les contrôleurs au démarrage. Si vous ajoutez un nouvel endpoint sans redémarrer, Spring Boot ne le connaît pas encore. C'est pourquoi vous devez toujours redémarrer après avoir modifié le code Java.

## Note importante

Après chaque modification du code backend Java, vous **devez** redémarrer le serveur Spring Boot pour que les changements prennent effet.

