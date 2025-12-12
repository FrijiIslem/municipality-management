# Guide de Test - Dashboard Citoyen

## Prérequis
1. **Backend** : Doit être démarré sur `http://localhost:9090`
2. **Frontend** : Doit être démarré sur `http://localhost:5173` (ou le port affiché)

## Étapes de Test

### 1. Accéder à l'application
- Ouvrez votre navigateur et allez à : `http://localhost:5173`
- Connectez-vous avec un compte citoyen

### 2. Tester l'affichage du type de déchet du jour
**À tester :**
- ✅ Vérifiez que la carte en haut du dashboard affiche le type de déchet d'aujourd'hui
- ✅ Vérifiez que le jour de la semaine est correct (Lundi, Mardi, etc.)
- ✅ Vérifiez que le type correspond au calendrier :
  - **Lundi** : Organique 🌱
  - **Mardi** : Plastique ♻️
  - **Mercredi** : Organique 🌱
  - **Jeudi** : Mixte 🗑️
  - **Vendredi** : Métaux 🔩
  - **Samedi** : Organique 🌱
  - **Dimanche** : Verre 🍾

### 3. Tester la sélection de conteneur

#### Scénario A : Utilisateur sans adresse
1. Si votre profil n'a pas d'adresse :
   - ✅ Vous devriez voir un message bleu indiquant "Adresse requise"
   - ✅ Un bouton "Aller au profil" devrait être visible
   - Cliquez sur "Aller au profil"
   - Ajoutez une adresse dans votre profil
   - Retournez au dashboard

#### Scénario B : Utilisateur avec adresse mais sans conteneur
1. Si vous avez une adresse mais pas de conteneur sélectionné :
   - ✅ Vous devriez voir un message jaune "Aucun conteneur sélectionné"
   - ✅ Un bouton "Sélectionner un conteneur" devrait être visible
   - Cliquez sur "Sélectionner un conteneur"
   - ✅ Une carte devrait s'afficher avec les conteneurs
   - ✅ Les conteneurs proches de votre adresse devraient être visibles
   - Cliquez sur un conteneur sur la carte
   - ✅ Les détails du conteneur devraient s'afficher (ID, adresse, état)
   - ✅ La distance devrait être affichée
   - Cliquez sur "Confirmer la sélection"
   - ✅ Un message de succès devrait apparaître
   - ✅ Le dashboard devrait maintenant afficher "Conteneur associé" en vert

#### Scénario C : Utilisateur avec conteneur déjà sélectionné
1. Si vous avez déjà un conteneur :
   - ✅ Vous devriez voir une carte verte "Conteneur associé"
   - ✅ Les détails du conteneur devraient être affichés
   - ✅ Un bouton "Changer" devrait être visible
   - Cliquez sur "Changer" pour sélectionner un autre conteneur

#### Scénario D : Changement d'adresse
1. Allez dans votre profil
2. Modifiez votre adresse
3. Enregistrez les modifications
4. Retournez au dashboard
5. ✅ Vous devriez voir une notification indiquant que votre adresse a changé
6. ✅ Le système devrait vous demander de sélectionner un nouveau conteneur
7. Sélectionnez un nouveau conteneur

### 4. Tester le Chatbot

#### Accès au chatbot
- ✅ Un bouton rond vert avec une icône de message devrait être visible en bas à droite
- Cliquez sur le bouton pour ouvrir le chatbot

#### Tests de questions

**Questions sur les types de déchets :**
- "Quel type de déchet est la batterie ?"
  - ✅ Devrait répondre : "Déchets dangereux / Électronique"
- "Quel type de déchet est le verre ?"
  - ✅ Devrait répondre : "Verre"
- "Quel type de déchet est le plastique ?"
  - ✅ Devrait répondre : "Plastique"

**Questions sur le recyclage :**
- "En quoi peut-on recycler le verre ?"
  - ✅ Devrait expliquer les utilisations du verre recyclé
- "En quoi peut-on recycler le plastique ?"
  - ✅ Devrait expliquer les utilisations du plastique recyclé
- "En quoi peut-on recycler les métaux ?"
  - ✅ Devrait expliquer les utilisations des métaux recyclés

**Questions générales :**
- "Quand est la collecte ?"
  - ✅ Devrait afficher le calendrier de collecte
- "Bonjour"
  - ✅ Devrait répondre poliment
- "Aide"
  - ✅ Devrait afficher les fonctionnalités disponibles

**Fonctionnalités du chatbot :**
- ✅ Les messages utilisateur devraient apparaître à droite (vert)
- ✅ Les réponses du bot devraient apparaître à gauche (blanc)
- ✅ Le chatbot devrait scroller automatiquement vers le bas
- ✅ Vous devriez pouvoir fermer le chatbot en cliquant sur X
- ✅ Le bouton d'envoi devrait être désactivé pendant le chargement

### 5. Vérifications générales

#### Dashboard
- ✅ Toutes les cartes de statistiques devraient être visibles
- ✅ Les liens vers les autres pages devraient fonctionner
- ✅ Les incidents récents devraient s'afficher (si vous en avez)

#### Navigation
- ✅ Le chatbot devrait être accessible depuis toutes les pages du dashboard citoyen
- ✅ Les autres fonctionnalités existantes devraient toujours fonctionner

## Problèmes potentiels et solutions

### Le backend ne démarre pas
- Vérifiez que le port 9090 n'est pas déjà utilisé
- Vérifiez que MongoDB est démarré
- Consultez les logs du backend pour les erreurs

### Le frontend ne démarre pas
- Vérifiez que le port 5173 n'est pas déjà utilisé
- Exécutez `npm install` dans le dossier frontend si nécessaire
- Consultez les logs du frontend pour les erreurs

### La carte ne s'affiche pas
- Vérifiez votre connexion internet (la carte utilise OpenStreetMap)
- Vérifiez la console du navigateur pour les erreurs

### Le chatbot ne répond pas
- Vérifiez la console du navigateur pour les erreurs
- Les réponses sont générées localement, pas besoin de backend

### Les conteneurs ne s'affichent pas
- Vérifiez que le backend retourne des conteneurs
- Vérifiez que les conteneurs ont des coordonnées valides
- Consultez la console du navigateur pour les erreurs

## URLs importantes
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:9090/api
- **Swagger/OpenAPI** : http://localhost:9090/swagger-ui.html (si configuré)
