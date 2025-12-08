# 🔧 Résolution du problème "Rien ne s'affiche"

## Étapes de diagnostic

### Étape 1: Vérifier la console du navigateur

1. Ouvrez http://localhost:3001
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **Console**
4. Notez toutes les erreurs en rouge

### Étape 2: Test simple

Si vous voyez une page blanche, testez avec une version simplifiée:

1. **Sauvegardez** votre `App.jsx` actuel:
```bash
Copy-Item src/App.jsx src/App.backup.jsx
```

2. **Remplacez** temporairement `App.jsx` par la version simple:
```bash
Copy-Item src/App.simple.jsx src/App.jsx
```

3. **Rechargez** la page (F5)

Si la version simple fonctionne, le problème vient d'un composant spécifique.

### Étape 3: Vérifier les erreurs communes

#### Erreur: "Cannot find module './App'"
→ Vérifiez que `src/App.jsx` existe

#### Erreur: "Failed to resolve import"
→ Exécutez `npm install` pour réinstaller les dépendances

#### Erreur: "Tailwind CSS"
→ Vérifiez que Tailwind est bien configuré:
```bash
npx tailwindcss init -p
```

#### Erreur: "React is not defined"
→ Vérifiez que React est installé:
```bash
npm list react
```

### Étape 4: Vérifier le serveur

Dans le terminal où vous avez lancé `npm run dev`, vous devriez voir:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3001/
➜  Network: use --host to expose
```

Si vous ne voyez pas cela, le serveur n'est pas démarré correctement.

### Étape 5: Nettoyer et redémarrer

```bash
# Arrêter tous les processus Node
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# Nettoyer le cache Vite
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Réinstaller (optionnel)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install

# Redémarrer
npm run dev
```

### Étape 6: Vérifier les fichiers essentiels

Assurez-vous que ces fichiers existent:
- ✅ `index.html` avec `<div id="root"></div>`
- ✅ `src/main.jsx`
- ✅ `src/App.jsx`
- ✅ `src/index.css`
- ✅ `vite.config.js`
- ✅ `package.json`

## Solutions rapides

### Solution 1: Test minimal

Remplacez temporairement `src/main.jsx` par:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')).render(
  <h1>Test React - Si vous voyez ceci, ça fonctionne!</h1>
)
```

### Solution 2: Vérifier les imports

Ouvrez `src/App.jsx` et vérifiez que tous les imports sont corrects.

### Solution 3: Désactiver les routes

Temporairement, dans `src/App.jsx`, remplacez par:

```jsx
import Login from './pages/Login'

function App() {
  return <Login />
}

export default App
```

## Informations à partager

Si le problème persiste, partagez:
1. Les erreurs de la console du navigateur (F12 → Console)
2. Les erreurs du terminal où `npm run dev` est lancé
3. Une capture d'écran de la page blanche

