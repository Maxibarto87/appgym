import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
  const [form, setForm] = useState({ usuario: '', contrasena: '', confirmar: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    // Aquí realizas la petición HTTP a la API de registro
    alert('Usuario registrado con éxito. Inicia sesión.')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#222', color: '#fff' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Registro</h2>

        {error && <p style={{ color: '#ff5252', fontSize: '14px', margin: 0 }}>{error}</p>}

        <input 
          type="text" 
          placeholder="Usuario" 
          value={form.usuario} 
          onChange={(e) => setForm({ ...form, usuario: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
          required
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={form.contrasena} 
          onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
          required
        />
        <input 
          type="password" 
          placeholder="Confirmar Contraseña" 
          value={form.confirmar} 
          onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#388e3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Registrarse
        </button>

        <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#64b5f6' }}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}