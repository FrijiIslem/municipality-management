# 🚀 Démarrage Rapide - Urbanova Frontend

## Étape 1: Installer les dépendances

```bash
cd frontend
npm install
```

## Étape 2: Configurer l'environnement

Le fichier `.env` devrait exister. Si non, créez-le avec:

```env
VITE_API_URL=http://localhost:9090/api
VITE_GOOGLE_MAPS_API_KEY=votre_cle_ici
```

**Note:** Pour tester sans Google Maps, laissez la clé vide. L'application fonctionnera mais la carte ne s'affichera pas.

## Étape 3: Démarrer le backend (dans un terminal séparé)

```bash
cd projetJEE
.\mvnw.cmd spring-boot:run
```

Attendez que le backend soit démarré (vous verrez "Started ProjetJeeApplication").

## Étape 4: Démarrer le frontend

### Option A: Utiliser le script batch (Windows)
```bash
cd frontend
start.bat
```

### Option B: Commande manuelle
```bash
cd frontend
npm run dev
```

## Étape 5: Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur: **http://localhost:3000**

## ✅ Vérifications

1. **Page de connexion** s'affiche correctement
2. **Backend accessible** - Vérifiez dans la console du navigateur (F12) qu'il n'y a pas d'erreurs CORS
3. **Navigation** - Testez les différents liens dans la sidebar

## 🐛 Problèmes courants

### "npm: command not found"
Installez Node.js depuis https://nodejs.org/

### "Port 3000 already in use"
Changez le port dans `vite.config.js` ligne 7: `port: 3001`

### Erreurs CORS
Vérifiez que le backend est bien démarré sur le port 9090

### La carte ne s'affiche pas
C'est normal si vous n'avez pas de clé Google Maps API. Le reste de l'application fonctionnera.

## 📱 Test de l'interface

1. **Connexion** - Testez avec des identifiants valides
2. **Tableau de bord** - Vérifiez les statistiques
3. **Tournées** - Consultez la liste et les détails
4. **Conteneurs** - Voir la liste avec les statuts colorés
5. **Notifications** - Vérifiez le système de notifications

## 🔗 URLs importantes

- Frontend: http://localhost:3000
- Backend API: http://localhost:9090/api
- Swagger UI: http://localhost:9090/swagger-ui.html

