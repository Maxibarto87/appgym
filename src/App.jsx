import { useState } from 'react'
import Navbar from './components/Navbar'
import SociosPage from './pages/SociosPage'
import PlanesPage from './pages/PlanesPage'
import CuotasPage from './pages/CuotasPage'
import PagosPage from './pages/PagosPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  // 1. Leemos el localStorage al iniciar
  const [estaAutenticado, setEstaAutenticado] = useState(() => {
    return localStorage.getItem('token') ? true : false
  })
  const [vistaActual, setVistaActual] = useState('socios')

  // 2. Función para cerrar sesión correctamente
  const handleCerrarSesion = () => {
    localStorage.removeItem('token') // Borramos el token guardado
    setEstaAutenticado(false)
  }

  if (!estaAutenticado) {
    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>🏋️ AppGym - Acceso al Sistema</h1>
        <RegisterPage onRegistroExitoso={() => setEstaAutenticado(true)} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', // Corregido: justifyContent
        alignItems: 'center', 
        marginBottom: '20px',
        gap: '20px'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', whiteSpace: 'nowrap' }}>
          🏋️ AppGym - Panel de Control
        </h1>
        <button 
          onClick={handleCerrarSesion} // Usamos la función que remueve el localStorage
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            flexShrink: 0
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      <Navbar setVistaActual={setVistaActual} />

      <main style={{ marginTop: '20px' }}>
        {vistaActual === 'socios' && <SociosPage />}
        {vistaActual === 'planes' && <PlanesPage />}
        {vistaActual === 'cuotas' && <CuotasPage />}
        {vistaActual === 'pagos' && <PagosPage />}
      </main>
    </div>
  )
}