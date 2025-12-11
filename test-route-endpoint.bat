@echo off
echo ========================================
echo   TEST DE L'ENDPOINT /api/tournees/{id}/route
echo ========================================
echo.

REM Remplacez cet ID par un ID de tournee valide de votre base de données
set TOURNEE_ID=693a08a9e2a8186e8936962b

echo Test de l'endpoint: http://localhost:9090/api/tournees/%TOURNEE_ID%/route
echo.

curl -X GET "http://localhost:9090/api/tournees/%TOURNEE_ID%/route" ^
     -H "Content-Type: application/json" ^
     -w "\n\nStatus Code: %%{http_code}\n"

echo.
echo ========================================
echo Si vous voyez "Status Code: 404", le backend n'a pas ete redemarre
echo Si vous voyez "Status Code: 200", l'endpoint fonctionne!
echo ========================================
pause

