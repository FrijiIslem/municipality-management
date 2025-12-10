@echo off
echo ========================================
echo   DEMARRAGE AVEC JAVA 21
echo ========================================
echo.

REM Chercher Java 21 dans les emplacements communs
set JAVA21_PATH=

REM Java 21 est installe ici
set JAVA21_PATH=C:\Program Files\Java\jdk-21

if exist "%JAVA21_PATH%" (
    goto :found
)

if exist "C:\Program Files\Java\jdk-21.0.2" (
    set JAVA21_PATH=C:\Program Files\Java\jdk-21.0.2
    goto :found
)

REM Chercher dans tous les dossiers Java
for /d %%i in ("C:\Program Files\Java\jdk-21*") do (
    set JAVA21_PATH=%%i
    goto :found
)

echo ERREUR: Java 21 introuvable!
echo.
echo Veuillez installer Java 21 ou modifier JAVA_HOME manuellement.
echo.
pause
exit /b 1

:found
echo Java 21 trouve: %JAVA21_PATH%
echo.
set JAVA_HOME=%JAVA21_PATH%
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME configure: %JAVA_HOME%
echo.
java -version
echo.

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
echo Le backend va demarrer sur http://localhost:9090
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
call mvnw.cmd spring-boot:run

pause

