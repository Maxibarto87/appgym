import { useState } from 'react'
import API from '../services/api'

export default function RegisterPage({ onRegistroExitoso, onIrALogin, onClose }) {
  const [formData, setFormData] = useState({
    Nombre: '',
    Clave: ''
  })
  const [mensaje, setMensaje] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)

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
      await API.post('/usuarios', {
        Nombre: formData.Nombre,
        Clave: formData.Clave
      })

      if (onRegistroExitoso) {
        onRegistroExitoso()
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error.response?.data)
      setMensaje(
        error.response?.data?.mensaje ||
        'Error al registrar datos o conectar con el servidor.'
      )
    }
  }

  return (
    <div style={styles.card}>
      {onClose && (
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      )}

      <div style={styles.tabsContainer}>
        <button 
          type="button" 
          style={{ ...styles.tab, color: '#000', fontWeight: 'bold', borderBottom: '3px solid #ff5a36' }}
        >
          Regístrate
        </button>
        <button 
          type="button" 
          onClick={onIrALogin} 
          style={{ ...styles.tab, color: '#777', fontWeight: 'normal' }}
        >
          Inicia sesión
        </button>
      </div>

      {mensaje && <p style={styles.errorText}>{mensaje}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre de Usuario"
            value={formData.Nombre}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={{ ...styles.inputGroup, position: 'relative' }}>
          <input
            type={mostrarPassword ? 'text' : 'password'}
            name="Clave"
            placeholder="Contraseña"
            value={formData.Clave}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            style={styles.eyeBtn}
          >
            {mostrarPassword ? '👁️' : '🙈'}
          </button>
        </div>

        <button type="submit" style={styles.submitBtn}>
          Registrarse
        </button>
      </form>
    </div>
  )
}

const styles = {
  card: {
    maxWidth: '380px',
    margin: '30px auto',
    padding: '30px 25px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    position: 'relative',
    fontFamily: 'Arial, sans-serif',
    color: '#333'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: '#f2f2f2',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px'
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '25px'
  },
  tab: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    paddingBottom: '6px'
  },
  errorText: {
    textAlign: 'center',
    color: '#f44336',
    fontSize: '13px',
    marginBottom: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    width: '100%'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    opacity: 0.5
  },
  submitBtn: {
    marginTop: '10px',
    padding: '14px',
    backgroundColor: '#4b97d9',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(255, 138, 101, 0.3)'
  }
}