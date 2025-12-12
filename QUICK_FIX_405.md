# 🚨 SOLUTION RAPIDE - Erreur 405

## Le problème
L'erreur `405 Method 'POST' is not supported` signifie que **le backend n'a pas été redémarré** après l'ajout du nouvel endpoint.

## ✅ SOLUTION EN 3 ÉTAPES

### Option 1 : Script automatique (RECOMMANDÉ)

1. **Double-cliquez** sur le fichier `restart-backend.bat` à la racine du projet
2. Attendez que le backend démarre (vous verrez "Started ProjetJeeApplication")
3. **Rafraîchissez** votre navigateur (F5)

### Option 2 : Commande manuelle

Ouvrez un **nouveau terminal** et exécutez :

```bash
cd projetJEE
.\mvnw.cmd clean
.\mvnw.cmd spring-boot:run
```

**IMPORTANT** : Attendez de voir ce message :
```
Started ProjetJeeApplication in X.XXX seconds
```

### Option 3 : Si le backend tourne déjà

1. **Arrêtez** le backend (Ctrl+C dans le terminal où il tourne)
2. **Relancez** avec :
   ```bash
   cd projetJEE
   .\mvnw.cmd spring-boot:run
   ```

## 🔍 Vérification

Une fois le backend redémarré, dans les logs vous devriez voir :
```
Mapped "{[/api/tournees/planifier-automatique],methods=[POST]}"
```

## ⚠️ Pourquoi ça arrive ?

Spring Boot charge les endpoints **au démarrage**. Si vous ajoutez un nouvel endpoint sans redémarrer, Spring Boot ne le connaît pas encore.

**Règle d'or** : Après chaque modification du code Java backend, **redémarrez toujours** le serveur Spring Boot.

## ✅ Test rapide

Après redémarrage, testez dans la console du navigateur (F12) :
```javascript
fetch('http://localhost:9090/api/tournees/planifier-automatique', {
  method: 'POST'
})
.then(r => r.json())
.then(d => console.log('✅ Succès!', d))
.catch(e => console.error('❌ Erreur:', e))
```

Si vous voyez "✅ Succès!", c'est bon ! 🎉

