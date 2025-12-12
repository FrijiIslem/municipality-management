# Test script for Agent creation API
# PowerShell script with proper JSON formatting

$agentData = @{
    email = "test.agent@example.com"
    nom = "Agent"
    prenom = "Test"
    password = "password123"
    numeroTel = 1234567890
    disponibilite = $true
    plageHoraire = "9h-17h"
    tache = "COLLECTE"
}

$jsonBody = $agentData | ConvertTo-Json -Depth 10

Write-Host "JSON Body:"
Write-Host $jsonBody

try {
    $response = Invoke-WebRequest -Uri "http://localhost:9090/api/utilisateurs/agents" `
                                -Method POST `
                                -ContentType "application/json" `
                                -Body $jsonBody `
                                -UseBasicParsing
    
    Write-Host "Response Status:" $response.StatusCode
    Write-Host "Response Content:"
    Write-Host $response.Content
} catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Message
    Write-Host "Response Body:"
    Write-Host $_.Exception.Response.GetResponseStream()
}
