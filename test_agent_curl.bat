# Test curl command for Agent creation (Windows compatible)
# Use curl.exe instead of PowerShell's curl alias

curl.exe -X POST http://localhost:9090/api/utilisateurs/agents ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test.agent@example.com\",\"nom\":\"Agent\",\"prenom\":\"Test\",\"password\":\"password123\",\"numeroTel\":1234567890,\"disponibilite\":true,\"plageHoraire\":\"9h-17h\",\"tache\":\"COLLECTE\"}"

# Alternative with JSON file:
# echo {"email":"test.agent2@example.com","nom":"Agent2","prenom":"Test2","password":"password123","numeroTel\":1234567891,"disponibilite":true,"plageHoraire":"9h-17h","tache":"CHAUFFEUR"} > agent.json
# curl.exe -X POST http://localhost:9090/api/utilisateurs/agents -H "Content-Type: application/json" -d @agent.json
