# Configuration rapide - Fichier .env

## Étapes pour configurer Google Maps API

### 1. Créer le fichier `.env`

Créez un fichier nommé `.env` à la racine du dossier `frontend` avec le contenu suivant :

```env
VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_google_maps
VITE_API_URL=http://localhost:9090/api
```

### 2. Obtenir une clé API Google Maps

1. **Allez sur Google Cloud Console** : https://console.cloud.google.com/
2. **Créez ou sélectionnez un projet**
3. **Activez l'API Maps JavaScript** :
   - Allez dans "APIs & Services" > "Library"
   - Recherchez "Maps JavaScript API"
   - Cliquez sur "Enable"
4. **Créez une clé API** :
   - Allez dans "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "API Key"
   - **Copiez la clé API générée**

### 3. Ajouter la clé dans le fichier `.env`

Remplacez `votre_cle_api_google_maps` par la clé que vous venez de copier :

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...votre_cle_ici
```

### 4. Redémarrer le serveur

**Important** : Après avoir créé ou modifié le fichier `.env`, vous devez **redémarrer** le serveur de développement :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

### 5. Vérification

Une fois redémarré, la carte Google Maps devrait se charger correctement.

## Note importante

- Le fichier `.env` ne doit **jamais** être partagé ou commité dans Git
- Il contient des informations sensibles (clé API)
- Utilisez `.env.example` pour partager la structure avec votre équipe

## Alternative : Utiliser sans clé API (mode développement)

Si vous voulez tester l'application sans Google Maps, vous pouvez temporairement désactiver les composants de carte ou utiliser une clé de test.

