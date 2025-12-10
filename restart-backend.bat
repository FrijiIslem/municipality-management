@echo off
echo ========================================
echo   REDEMARRAGE DU BACKEND SPRING BOOT
echo ========================================
echo.

REM Configuration de Java 21
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java 21 configure: %JAVA_HOME%
echo.
java -version
echo.

cd projetJEE

echo [1/4] Suppression du dossier target (recompilation complete)...
if exist target (
    rmdir /s /q target
    echo Dossier target supprime.
) else (
    echo Dossier target n'existe pas.
)

echo.
echo [2/4] Nettoyage du projet Maven...
call mvnw.cmd clean
if %errorlevel% neq 0 (
    echo ERREUR lors du nettoyage!
    pause
    exit /b 1
)

echo.
echo [3/4] Compilation complete du projet...
call mvnw.cmd compile
if %errorlevel% neq 0 (
    echo ERREUR lors de la compilation!
    pause
    exit /b 1
)

echo.
echo [4/4] Demarrage du serveur Spring Boot...
echo.
echo ========================================
echo Le backend va demarrer sur http://localhost:9090
echo.
echo IMPORTANT: Cherchez dans les logs la ligne:
echo "Mapped {[/api/tournees/planifier-automatique],methods=[POST]}"
echo.
echo Si cette ligne n'apparait pas, l'endpoint n'est pas charge!
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
call mvnw.cmd spring-boot:run

pause

