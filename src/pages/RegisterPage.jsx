import { useState } from 'react'
import API from '../services/api'

export default function RegisterPage({ onRegistroExitoso }) {
  const [formData, setFormData] = useState({
    nombre: '',
    clave: ''
  })
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('')
    
    try {
      // Petición directa al endpoint /usuarios
      const response = await API.post('/usuarios', {
        nombre: formData.nombre,
        clave: formData.clave
      })
      
      // Guardamos la sesión en el navegador
      const token = response.data?.token || 'sesion_activa'
      const valorAlmacenar = typeof token === 'object' ? JSON.stringify(token) : token
      localStorage.setItem('token', valorAlmacenar)
      
      if (onRegistroExitoso) {
        onRegistroExitoso()
      }
    } catch (error) {
      console.error('Error al registrar/ingresar:', error.response?.data)
      setMensaje(
        error.response?.data?.mensaje || 
        'Error al ingresar datos o conectar con el servidor.'
      )
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Registrar e Ingresar</h2>
      {mensaje && (
        <p style={{ textAlign: 'center', color: '#f44336', wordBreak: 'break-word' }}>
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}