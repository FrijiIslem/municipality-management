@echo off
echo ====================================
echo   Urbanova Frontend - Demarrage
echo ====================================
echo.

echo [1/3] Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
) else (
    echo Dependances deja installees.
)
echo.

echo [2/3] Demarrage du serveur de developpement...
echo Le frontend sera accessible sur http://localhost:3000
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm run dev

