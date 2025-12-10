# 🔧 Correction du problème Java 21

## 🔍 Problème identifié

Maven utilise **Java 11** alors que le projet nécessite **Java 21**.

```
Java version: 11.0.25  ❌
Projet nécessite: Java 21 ✅
```

## ✅ Solution

Java 21 est installé dans : `C:\Program Files\Java\jdk-21`

### Option 1 : Script automatique (RECOMMANDÉ)

**Double-cliquez sur : `restart-backend.bat`**

Le script configure automatiquement Java 21 pour cette session.

### Option 2 : Configuration manuelle dans le terminal

```bash
# 1. Configurez JAVA_HOME pour cette session
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

# 2. Vérifiez
java -version
# Doit afficher: java version "21.0.2"

# 3. Compilez et démarrez
cd projetJEE
.\mvnw.cmd clean
.\mvnw.cmd spring-boot:run
```

### Option 3 : Configuration permanente (Windows)

1. **Ouvrez les Variables d'environnement** :
   - Appuyez sur `Win + R`
   - Tapez `sysdm.cpl` et Entrée
   - Onglet "Avancé" > "Variables d'environnement"

2. **Modifiez JAVA_HOME** :
   - Sélectionnez `JAVA_HOME`
   - Cliquez sur "Modifier"
   - Changez la valeur en : `C:\Program Files\Java\jdk-21`
   - Cliquez sur "OK"

3. **Redémarrez votre terminal** et testez :
   ```bash
   java -version
   ```

## ✅ Vérification

Après configuration, vérifiez :

```bash
java -version
# Doit afficher: java version "21.0.2"

.\mvnw.cmd -version
# Doit afficher: Java version: 21.0.2
```

## 🚀 Ensuite

Une fois Java 21 configuré, le backend devrait compiler et démarrer correctement !

---

**Le problème était la version de Java, pas le code !** ✅


