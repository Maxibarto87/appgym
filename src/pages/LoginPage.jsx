import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Simulación de autenticación (Reemplazar por tu llamada a la API si aplica)
    if (usuario.trim() !== '' && contrasena.trim() !== '') {
      // Guardamos la sesión
      localStorage.setItem('usuario', usuario)
      // Redirigimos a socios
      navigate('/socios')
    } else {
      setError('Por favor completa todos los campos')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#222', color: '#fff' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Iniciar Sesión</h2>
        
        {error && <p style={{ color: '#ff5252', fontSize: '14px', margin: 0 }}>{error}</p>}

        <input 
          type="text" 
          placeholder="Usuario" 
          value={usuario} 
          onChange={(e) => setUsuario(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={contrasena} 
          onChange={(e) => setContrasena(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Ingresar
        </button>

        <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: '#64b5f6' }}>Regístrate aquí</Link>
        </p>
      </form>
    </div>
  )
}