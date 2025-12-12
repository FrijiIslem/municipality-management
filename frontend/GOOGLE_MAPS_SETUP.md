# Configuration Google Maps API

## Problème
L'erreur `ApiProjectMapError` indique que la clé API Google Maps n'est pas configurée ou invalide.

## Solution

### 1. Obtenir une clé API Google Maps

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les APIs suivantes :
   - **Maps JavaScript API** (requis)
   - **Places API** (optionnel, pour la recherche de lieux)
   - **Geocoding API** (optionnel, pour la conversion d'adresses)

4. Créez des identifiants (Credentials) :
   - Allez dans "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "API Key"
   - Copiez la clé API générée

### 2. Configurer la clé API dans le projet

1. Créez un fichier `.env` à la racine du dossier `frontend` (s'il n'existe pas déjà)
2. Ajoutez votre clé API :

```env
VITE_GOOGLE_MAPS_API_KEY=votre_cle_api_ici
```

3. Redémarrez le serveur de développement Vite :
   ```bash
   npm run dev
   ```

### 3. Restreindre la clé API (Recommandé pour la production)

Pour la sécurité, restreignez votre clé API :

1. Dans Google Cloud Console, allez dans "APIs & Services" > "Credentials"
2. Cliquez sur votre clé API
3. Dans "Application restrictions", sélectionnez "HTTP referrers (web sites)"
4. Ajoutez les domaines autorisés :
   - `http://localhost:3002/*` (développement)
   - `http://localhost:5173/*` (Vite par défaut)
   - Votre domaine de production (ex: `https://votre-domaine.com/*`)

### 4. Vérification

Après configuration, la carte devrait se charger correctement. Si l'erreur persiste :

- Vérifiez que la clé API est correctement copiée dans le fichier `.env`
- Vérifiez que le fichier `.env` est à la racine du dossier `frontend`
- Vérifiez que vous avez redémarré le serveur de développement
- Vérifiez que les APIs nécessaires sont activées dans Google Cloud Console

## Note importante

Le fichier `.env` ne doit **jamais** être commité dans Git. Il est déjà dans `.gitignore`.

Pour partager la configuration avec l'équipe, utilisez le fichier `.env.example` qui contient les variables sans les valeurs sensibles.

