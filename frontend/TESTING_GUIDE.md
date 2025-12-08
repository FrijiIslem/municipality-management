# Guide de Test - Urbanova Frontend

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
cd frontend
npm install
```

### 2. Configuration de l'environnement

Le fichier `.env` est déjà créé. Si vous avez une clé Google Maps API, remplacez `VITE_GOOGLE_MAPS_API_KEY` dans le fichier `.env`.

**Note:** Pour tester sans Google Maps, l'application fonctionnera mais la carte ne s'affichera pas.

### 3. Démarrer le backend

Assurez-vous que le backend Spring Boot est en cours d'exécution:

```bash
cd ../projetJEE
.\mvnw.cmd spring-boot:run
```

Le backend doit être accessible sur `http://localhost:9090`

### 4. Démarrer le frontend

Dans un nouveau terminal:

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 🧪 Tests à Effectuer

### Test 1: Page de Connexion

1. Ouvrez `http://localhost:3000`
2. Vous devriez voir la page de connexion avec le logo Urbanova
3. Testez la connexion (actuellement, l'endpoint `/api/utilisateurs/auth` doit être fonctionnel)

### Test 2: Tableau de Bord

1. Après connexion, vous devriez voir le tableau de bord
2. Vérifiez les statistiques:
   - Tournées actives
   - Tournées en attente
   - Conteneurs pleins
   - Notifications

### Test 3: Liste des Tournées

1. Cliquez sur "Tournées" dans la sidebar
2. Vérifiez que la liste s'affiche correctement
3. Cliquez sur "Voir détails" pour une tournée

### Test 4: Détails d'une Tournée

1. Sur la page de détails, vérifiez:
   - Les informations de la tournée (date, zone, équipe)
   - La carte (si Google Maps API key est configurée)
   - La liste des conteneurs
   - Les boutons "Démarrer" ou "Terminer" selon l'état

### Test 5: Carte Interactive

1. Sur la page de détails d'une tournée active
2. Vérifiez que:
   - Les conteneurs s'affichent avec des couleurs selon leur état
   - Le chemin optimal est tracé (si l'endpoint `/api/tournees/{id}/route` existe)
   - Les marqueurs sont cliquables

### Test 6: Liste des Conteneurs

1. Cliquez sur "Conteneurs" dans la sidebar
2. Vérifiez l'affichage des conteneurs avec leurs statuts
3. Les couleurs doivent correspondre à l'état de remplissage

### Test 7: Notifications

1. Cliquez sur "Notifications" dans la sidebar
2. Vérifiez l'affichage des notifications
3. Testez "Marquer comme lu" et "Tout marquer comme lu"

### Test 8: Marquage des Conteneurs

1. Sur une tournée active (état "EN_COURS")
2. Dans la liste des conteneurs à droite
3. Cliquez sur "Marquer comme vide" pour un conteneur
4. Vérifiez que le statut se met à jour

## 🔧 Tests avec Mock Data (si backend non disponible)

Si le backend n'est pas encore prêt, vous pouvez tester l'interface avec des données mockées.

Créez un fichier `src/services/mockData.js`:

```javascript
export const mockTours = [
  {
    id: '1',
    dateDebut: new Date().toISOString(),
    zone: 'Zone A',
    etat: 'EN_COURS',
    conteneurs: [
      {
        id: '1',
        etatRemplissage: 'PLEIN',
        localisation: { latitude: 36.8065, longitude: 10.1815, adresse: 'Rue Habib Bourguiba' }
      },
      {
        id: '2',
        etatRemplissage: 'MOYEN',
        localisation: { latitude: 36.8100, longitude: 10.1850, adresse: 'Avenue de la Liberté' }
      }
    ],
    agentChauffeur: { nom: 'Ahmed Ben Ali' },
    agentRamasseurs: [{ nom: 'Mohamed' }, { nom: 'Salah' }]
  }
]

export const mockContainers = [
  {
    id: '1',
    etatRemplissage: 'PLEIN',
    couleurStatut: 'ROUGE',
    localisation: { adresse: 'Rue Habib Bourguiba, Tunis' }
  },
  {
    id: '2',
    etatRemplissage: 'MOYEN',
    couleurStatut: 'ORANGE',
    localisation: { adresse: 'Avenue de la Liberté, Tunis' }
  }
]

export const mockNotifications = [
  {
    id: '1',
    titre: 'Nouvelle tournée planifiée',
    message: 'Une nouvelle tournée a été planifiée pour la Zone A',
    dateCreation: new Date().toISOString(),
    lu: false
  }
]
```

## 🐛 Dépannage

### Erreur: "Cannot find module"
```bash
npm install
```

### Erreur: "Port 3000 already in use"
Changez le port dans `vite.config.js`:
```javascript
server: {
  port: 3001, // Changez ici
}
```

### La carte ne s'affiche pas
1. Vérifiez que `VITE_GOOGLE_MAPS_API_KEY` est défini dans `.env`
2. Redémarrez le serveur de développement après modification de `.env`
3. Vérifiez la console du navigateur pour les erreurs

### Erreurs CORS
Le proxy est configuré dans `vite.config.js`. Si vous avez des problèmes:
1. Vérifiez que le backend est sur le port 9090
2. Vérifiez que le proxy est bien configuré

### Les données ne s'affichent pas
1. Vérifiez que le backend est démarré
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Vérifiez l'onglet Network pour voir les requêtes API

## 📝 Checklist de Test

- [ ] Installation des dépendances réussie
- [ ] Backend démarré et accessible
- [ ] Frontend démarré sur http://localhost:3000
- [ ] Page de connexion s'affiche
- [ ] Tableau de bord fonctionne
- [ ] Liste des tournées s'affiche
- [ ] Détails d'une tournée fonctionnent
- [ ] Carte s'affiche (si API key configurée)
- [ ] Liste des conteneurs fonctionne
- [ ] Notifications s'affichent
- [ ] Marquage des conteneurs fonctionne
- [ ] Navigation entre les pages fonctionne
- [ ] Design responsive (test sur mobile)

## 🎯 Prochaines Étapes

1. **Backend Endpoints à implémenter:**
   - `GET /api/tournees/{id}/route` - Calcul du chemin optimal
   - `PUT /api/tournees/{id}/start` - Démarrer une tournée
   - `PUT /api/tournees/{id}/complete` - Terminer une tournée
   - `PUT /api/conteneurs/{id}/empty` - Marquer un conteneur comme vide

2. **Fonctionnalités à ajouter:**
   - Planification automatique quotidienne (6h)
   - Système de notifications pour les admins
   - Authentification complète avec JWT

