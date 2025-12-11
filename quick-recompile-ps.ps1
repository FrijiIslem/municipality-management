# Script PowerShell rapide pour recompiler
Set-Location projetJEE

Write-Host "Suppression du dossier target..." -ForegroundColor Yellow
if (Test-Path "target") {
    Remove-Item -Path "target" -Recurse -Force
    Write-Host "OK" -ForegroundColor Green
}

Write-Host "Nettoyage Maven..." -ForegroundColor Yellow
& .\mvnw.cmd clean

Write-Host "Compilation..." -ForegroundColor Yellow
& .\mvnw.cmd compile

Write-Host ""
Write-Host "Compilation terminee!" -ForegroundColor Green
Write-Host "Redemarrez le backend avec: .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow

