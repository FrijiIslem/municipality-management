# 🚀 Démarrage du Backend Spring Boot

## Problème
Si vous voyez l'erreur `ERR_CONNECTION_REFUSED` ou `Failed to load resource`, cela signifie que le backend n'est pas démarré.

## Solution : Démarrer le Backend

### Option 1 : Utiliser Maven Wrapper (Recommandé)

**Windows:**
```bash
cd projetJEE
.\mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
cd projetJEE
./mvnw spring-boot:run
```

### Option 2 : Utiliser Maven installé

```bash
cd projetJEE
mvn spring-boot:run
```

### Option 3 : Utiliser votre IDE

1. Ouvrez le projet dans IntelliJ IDEA ou Eclipse
2. Localisez le fichier `ProjetJeeApplication.java`
3. Clic droit > Run 'ProjetJeeApplication'

## Vérification

Une fois le backend démarré, vous devriez voir dans la console :

```
Started ProjetJeeApplication in X.XXX seconds
```

Le backend sera accessible sur : **http://localhost:9090**

## Ports utilisés

- **Backend (Spring Boot)**: Port 9090
- **Frontend (Vite)**: Port 3000 (ou 5173)
- **MongoDB**: Port 27017

## Ordre de démarrage recommandé

1. **MongoDB** (si pas déjà démarré)
2. **Backend Spring Boot** (port 9090)
3. **Frontend** (port 3000)

## Dépannage

### Port 9090 déjà utilisé
```bash
# Windows
netstat -ano | findstr :9090
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:9090 | xargs kill -9
```

### MongoDB non démarré
```bash
# Windows (si installé comme service)
net start MongoDB

# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community
```

### Erreurs de compilation
```bash
cd projetJEE
mvn clean install
mvn spring-boot:run
```

## Test de connexion

Une fois le backend démarré, testez l'API :

```bash
# Dans un navigateur ou avec curl
curl http://localhost:9090/api/tournees
```

Vous devriez recevoir une réponse JSON (même si c'est un tableau vide).

