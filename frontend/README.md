# Urbanova Frontend

Interface React pour la gestion intelligente des déchets urbains - Application Agent.

## 🚀 Installation

```bash
cd frontend
npm install
```

## ⚙️ Configuration

1. Copiez `.env.example` vers `.env`:
```bash
cp .env.example .env
```

2. Configurez vos variables d'environnement:
- `VITE_API_URL`: URL de l'API backend (par défaut: http://localhost:9090/api)
- `VITE_GOOGLE_MAPS_API_KEY`: Clé API Google Maps

## 🏃 Démarrage

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 📦 Build

```bash
npm run build
```

## 🎨 Design System

- **Couleurs principales:**
  - Vert éco: #4CAF50
  - Vert menthe: #8BC34A
  - Bleu urbain: #2196F3
  - Gris clair: #F5F5F5
  - Gris anthracite: #263238

- **Typographie:**
  - Titres: Poppins / Montserrat
  - Texte: Inter / Roboto

## 📱 Fonctionnalités

- ✅ Tableau de bord avec statistiques
- ✅ Gestion des tournées (planification, acceptation, démarrage)
- ✅ Carte interactive avec Google Maps
- ✅ Calcul du chemin optimal entre conteneurs
- ✅ Liste des conteneurs avec statut de remplissage
- ✅ Marquage des conteneurs comme vides
- ✅ Système de notifications
- ✅ Interface responsive

## 🔗 Intégration Backend

L'application se connecte automatiquement au backend Spring Boot sur le port 9090.

## 📝 Notes

- Les tournées sont planifiées automatiquement chaque jour à 6h
- Les notifications sont envoyées aux admins pour validation
- Les agents chauffeurs peuvent démarrer et gérer les tournées
- La carte affiche les conteneurs avec des couleurs selon leur état de remplissage

