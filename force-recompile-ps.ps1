# Script PowerShell pour forcer la recompilation complète
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FORCE RECOMPILATION COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration de Java 21
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "Java 21 configure: $env:JAVA_HOME" -ForegroundColor Green
java -version
Write-Host ""

Set-Location projetJEE

Write-Host "[1/4] Arret des processus Java en cours..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host ""

Write-Host "[2/4] Suppression COMPLETE du dossier target..." -ForegroundColor Yellow
if (Test-Path "target") {
    Remove-Item -Path "target" -Recurse -Force
    Write-Host "Dossier target supprime." -ForegroundColor Green
} else {
    Write-Host "Dossier target n'existe pas." -ForegroundColor Gray
}
Write-Host ""

Write-Host "[3/4] Nettoyage Maven..." -ForegroundColor Yellow
& .\mvnw.cmd clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors du nettoyage!" -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour continuer"
    exit 1
}
Write-Host ""

Write-Host "[4/4] Compilation complete..." -ForegroundColor Yellow
& .\mvnw.cmd compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors de la compilation!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifiez les erreurs ci-dessus." -ForegroundColor Red
    Read-Host "Appuyez sur Entree pour continuer"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Compilation terminee avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "Vous DEVEZ maintenant redemarrer le backend:" -ForegroundColor Yellow
Write-Host "  restart-backend.bat" -ForegroundColor Yellow
Write-Host "  ou" -ForegroundColor Yellow
Write-Host "  .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Appuyez sur Entree pour continuer"

