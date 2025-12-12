@echo off
echo ========================================
echo   FORCE RECOMPILATION COMPLETE
echo ========================================
echo.

REM Configuration de Java 21
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java 21 configure: %JAVA_HOME%
java -version
echo.

cd projetJEE

echo [1/4] Arret des processus Java en cours...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

echo [2/4] Suppression COMPLETE du dossier target...
if exist target (
    rmdir /s /q target
    echo Dossier target supprime.
) else (
    echo Dossier target n'existe pas.
)
echo.

echo [3/4] Nettoyage Maven...
call mvnw.cmd clean
if %errorlevel% neq 0 (
    echo ERREUR lors du nettoyage!
    pause
    exit /b 1
)
echo.

echo [4/4] Compilation complete...
call mvnw.cmd compile
if %errorlevel% neq 0 (
    echo ERREUR lors de la compilation!
    echo.
    echo Verifiez les erreurs ci-dessus.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Compilation terminee avec succes!
echo.
echo Vous DEVEZ maintenant redemarrer le backend:
echo   restart-backend.bat
echo ========================================
echo.

pause

