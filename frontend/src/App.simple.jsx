// Version simplifiée pour test
function App() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F5F5F5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4CAF50', fontSize: '2.5rem', marginBottom: '20px' }}>
        🗑️ Urbanova
      </h1>
      <p style={{ color: '#263238', fontSize: '1.2rem' }}>
        Si vous voyez ce message, React fonctionne correctement !
      </p>
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', display: 'inline-block' }}>
        <p style={{ color: '#666' }}>Le serveur de développement est actif sur le port 3001</p>
      </div>
    </div>
  )
}

export default App

