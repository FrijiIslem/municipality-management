@echo off
echo ========================================
echo   DEMARRAGE BACKEND AVEC JAVA 21
echo ========================================
echo.

REM Configuration de Java 21
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java 21 configure: %JAVA_HOME%
java -version
echo.

cd projetJEE

echo [1/3] Nettoyage...
call mvnw.cmd clean
if %errorlevel% neq 0 (
    echo ERREUR lors du nettoyage!
    pause
    exit /b 1
)

echo.
echo [2/3] Compilation...
call mvnw.cmd compile
if %errorlevel% neq 0 (
    echo ERREUR lors de la compilation!
    pause
    exit /b 1
)

echo.
echo [3/3] Demarrage du serveur Spring Boot...
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

