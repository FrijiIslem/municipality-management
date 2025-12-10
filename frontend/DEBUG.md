# 🔍 Guide de Débogage - Problème d'affichage

## Vérifications à faire

### 1. Vérifier que le serveur est démarré

Dans le terminal, vous devriez voir:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3001/
```

### 2. Vérifier la console du navigateur

Ouvrez les outils de développement (F12) et vérifiez:
- **Console** : Y a-t-il des erreurs JavaScript ?
- **Network** : Les fichiers se chargent-ils correctement ?
- **Elements** : Y a-t-il un `<div id="root">` dans le HTML ?

### 3. Erreurs courantes

#### Erreur: "Cannot find module"
```bash
npm install
```

#### Erreur: "Failed to resolve import"
Vérifiez que tous les fichiers existent dans `src/`

#### Erreur: "Tailwind CSS not found"
```bash
npm install -D tailwindcss postcss autoprefixer
```

#### Page blanche
- Vérifiez la console du navigateur (F12)
- Vérifiez que `main.jsx` importe correctement `App.jsx`
- Vérifiez que `index.html` a bien `<div id="root"></div>`

### 4. Test simple

Temporairement, remplacez le contenu de `src/App.jsx` par:

```jsx
function App() {
  return <h1>Test - Si vous voyez ceci, React fonctionne!</h1>
}

export default App
```

Si cela fonctionne, le problème vient d'un composant spécifique.

### 5. Vérifier les imports

Assurez-vous que tous les fichiers importés existent:
- `src/components/Layout/Layout.jsx`
- `src/components/Layout/Header.jsx`
- `src/components/Layout/Sidebar.jsx`
- `src/pages/Login.jsx`
- `src/pages/Dashboard.jsx`
- etc.

### 6. Vérifier Tailwind CSS

Si les styles ne s'appliquent pas:
```bash
npx tailwindcss init -p
```

### 7. Redémarrer proprement

1. Arrêtez le serveur (Ctrl+C)
2. Supprimez le cache:
```bash
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
```
3. Redémarrez:
```bash
npm run dev
```

## Commandes de diagnostic

```bash
# Vérifier les processus Node
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Vérifier les ports
netstat -ano | findstr :3001

# Vérifier les erreurs npm
npm run dev -- --debug
```


