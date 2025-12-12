@echo off
echo ========================================
echo   RECOMPILATION COMPLETE DU BACKEND
echo ========================================
echo.

REM Configuration de Java 21
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java 21 configure: %JAVA_HOME%
java -version
echo.

cd projetJEE

echo [1/3] Suppression du dossier target...
if exist target (
    rmdir /s /q target
    echo Dossier target supprime.
) else (
    echo Dossier target n'existe pas.
)
echo.

echo [2/3] Nettoyage Maven...
call mvnw.cmd clean
if %errorlevel% neq 0 (
    echo ERREUR lors du nettoyage!
    pause
    exit /b 1
)
echo.

echo [3/3] Compilation complete...
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
echo Vous pouvez maintenant demarrer le backend avec:
echo   start-backend-java21.bat
echo   ou
echo   restart-backend.bat
echo ========================================
echo.

pause

